"""YouTube transcript extraction service.

Uses youtube-transcript-api for direct caption extraction.
Falls back to yt-dlp + OpenAI Whisper API for videos without captions.
"""

import http.cookiejar
import os
import re
import logging
from dataclasses import dataclass
from datetime import datetime

import requests as req_lib
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

logger = logging.getLogger(__name__)

COOKIES_PATH = os.environ.get("YOUTUBE_COOKIES_PATH", "/app/cookies.txt")


def _build_cookie_session() -> req_lib.Session | None:
    """Load a Netscape cookies.txt into a requests.Session if the file exists."""
    if not os.path.isfile(COOKIES_PATH):
        return None
    try:
        jar = http.cookiejar.MozillaCookieJar(COOKIES_PATH)
        jar.load(ignore_discard=True, ignore_expires=True)
        session = req_lib.Session()
        session.cookies = jar
        logger.info("Loaded YouTube cookies from %s (%d cookies)", COOKIES_PATH, len(jar))
        return session
    except Exception as e:
        logger.warning("Failed to load cookies from %s: %s", COOKIES_PATH, e)
        return None


def _yt_dlp_cookie_opts() -> dict:
    """Return yt-dlp options to use cookies.txt if available."""
    if os.path.isfile(COOKIES_PATH):
        return {"cookiefile": COOKIES_PATH}
    return {}


@dataclass
class TranscriptResult:
    video_id: str
    title: str
    full_text: str
    segments: list[dict]  # [{"text": ..., "start": ..., "duration": ...}]
    language: str
    source_url: str


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})",
        r"^([a-zA-Z0-9_-]{11})$",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript(url: str, preferred_language: str = "id") -> TranscriptResult:
    """Extract transcript from a YouTube video.

    Tries captions in preferred language first, then falls back to any available.
    """
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Could not extract video ID from URL: {url}")

    source_url = f"https://www.youtube.com/watch?v={video_id}"

    # Build session with cookies if available
    cookie_session = _build_cookie_session()

    # Try fetching transcript
    try:
        ytt_api = YouTubeTranscriptApi(http_client=cookie_session) if cookie_session else YouTubeTranscriptApi()

        # Try preferred language first
        try:
            transcript = ytt_api.fetch(video_id, languages=[preferred_language])
            detected_lang = preferred_language
        except NoTranscriptFound:
            # Try English fallback
            try:
                transcript = ytt_api.fetch(video_id, languages=["en"])
                detected_lang = "en"
            except NoTranscriptFound:
                # Try any available language
                transcript_list = ytt_api.list(video_id)
                available = list(transcript_list)
                if not available:
                    raise NoTranscriptFound(video_id, [], None)
                transcript = ytt_api.fetch(video_id, languages=[available[0].language_code])
                detected_lang = available[0].language_code

        # Convert to segments
        segments = []
        for entry in transcript.snippets:
            segments.append({
                "text": entry.text,
                "start": entry.start,
                "duration": entry.duration,
            })

        # Build full text
        full_text = " ".join(seg["text"] for seg in segments)

        # Try to get video title via yt-dlp (lightweight metadata only)
        title = _get_video_title(video_id)

        return TranscriptResult(
            video_id=video_id,
            title=title,
            full_text=full_text,
            segments=segments,
            language=detected_lang,
            source_url=source_url,
        )

    except TranscriptsDisabled:
        logger.warning(f"Transcripts disabled for {video_id}, attempting Whisper fallback")
        return _whisper_fallback(video_id, source_url, preferred_language)
    except VideoUnavailable:
        raise ValueError(f"Video unavailable: {source_url}")


def _get_video_title(video_id: str) -> str:
    """Get video title using yt-dlp metadata extraction (no download)."""
    try:
        import yt_dlp

        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            **_yt_dlp_cookie_opts(),
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False,
            )
            return info.get("title", f"YouTube Video {video_id}")
    except Exception:
        return f"YouTube Video {video_id}"


def _whisper_fallback(
    video_id: str,
    source_url: str,
    language: str,
) -> TranscriptResult:
    """Download audio via yt-dlp and transcribe with OpenAI Whisper API."""
    import tempfile
    import yt_dlp
    from openai import OpenAI
    from app.config import get_settings

    settings = get_settings()
    client = OpenAI(api_key=settings.openai_api_key)

    # Download audio to temp file
    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = f"{tmpdir}/{video_id}.mp3"
        ydl_opts = {
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "128",
            }],
            "outtmpl": f"{tmpdir}/{video_id}.%(ext)s",
            "quiet": True,
            **_yt_dlp_cookie_opts(),
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(source_url, download=True)
            title = info.get("title", f"YouTube Video {video_id}")

        # Transcribe with Whisper
        with open(output_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language if language != "auto" else None,
                response_format="verbose_json",
                timestamp_granularities=["segment"],
            )

        segments = []
        if hasattr(transcript, "segments"):
            for seg in transcript.segments:
                segments.append({
                    "text": seg["text"],
                    "start": seg["start"],
                    "duration": seg["end"] - seg["start"],
                })

        full_text = transcript.text

    return TranscriptResult(
        video_id=video_id,
        title=title,
        full_text=full_text,
        segments=segments,
        language=language,
        source_url=source_url,
    )
