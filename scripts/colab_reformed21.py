# ==========================================
# Google Colab: Extract Reformed21TV Sermons
# (Resumes, tracks skip reasons, uses cookies)
# ==========================================
# Usage in Colab:
#   1. Export YouTube cookies as `cookies.txt` (Netscape format) using a browser extension.
#   2. Upload this file + reformed21_transcripts.json + cookies.txt to Colab.
#   3. Run: !pip install yt-dlp youtube-transcript-api
#   4. Run: !python colab_reformed21.py
#   5. Download reformed21_transcripts.json when done
# ==========================================

import json
import os
import http.cookiejar
import requests as req_lib
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi

CHANNEL_URL = "https://www.youtube.com/@Reformed21TV/videos"
OUTPUT_FILE = "reformed21_transcripts.json"
COOKIES_FILE = "cookies.txt"

SKIP_KEYWORDS = ["sermon clips", "sermon clip", "thoughts from his servants", "cuplikan", "highlight"]

def should_skip(title):
    return any(kw in title.lower() for kw in SKIP_KEYWORDS)

def build_cookie_session():
    """Load a Netscape cookies.txt into a requests.Session if the file exists."""
    if not os.path.exists(COOKIES_FILE):
        return None
    try:
        jar = http.cookiejar.MozillaCookieJar(COOKIES_FILE)
        jar.load(ignore_discard=True, ignore_expires=True)
        session = req_lib.Session()
        session.cookies = jar
        print(f"🍪 Loaded YouTube cookies from {COOKIES_FILE}")
        return session
    except Exception as e:
        print(f"⚠️ Failed to load cookies: {e}")
        return None

def main():
    # Step 0: Load existing results
    results = []
    no_transcript_ids = set()

    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            results = data.get("transcripts", [])
            no_transcript_ids = set(data.get("no_transcript_ids", []))
        print(f"📂 Loaded {len(results)} extracted + {len(no_transcript_ids)} permanently skipped (no transcript).\n")

    done_ids = {r["video_id"] for r in results}

    # Step 1: Get all videos
    print("Fetching channel video list...")
    ydl_opts = {"extract_flat": "in_playlist", "quiet": True, "no_warnings": True}
    if os.path.exists(COOKIES_FILE):
        ydl_opts["cookiefile"] = COOKIES_FILE
        
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(CHANNEL_URL, download=False)
        all_videos = [v for v in info.get("entries", []) if not should_skip(v.get("title", ""))]

    remaining = [v for v in all_videos if v["id"] not in done_ids and v["id"] not in no_transcript_ids]
    print(f"Total eligible: {len(all_videos)} | Done: {len(done_ids)} | No transcript: {len(no_transcript_ids)} | To process: {len(remaining)}\n")

    if not remaining:
        print("🎉 Nothing left to process!")
        return

    # Step 2: Fetch transcripts
    cookie_session = build_cookie_session()
    ytt = YouTubeTranscriptApi(http_client=cookie_session) if cookie_session else YouTubeTranscriptApi()
    
    new_count = 0
    no_transcript_count = 0
    ip_blocked_count = 0
    consecutive_ip_errors = 0
    MAX_CONSECUTIVE_ERRORS = 3

    for i, video in enumerate(remaining):
        vid = video["id"]
        title = video.get("title", "Unknown")
        url = video.get("url", f"https://www.youtube.com/watch?v={vid}")

        print(f"[{i+1}/{len(remaining)}] {title}...", end=" ")

        import time
        from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled, VideoUnavailable
        
        try:
            try:
                transcript = ytt.fetch(vid, languages=["id"])
                detected_lang = "id"
            except NoTranscriptFound:
                try:
                    transcript = ytt.fetch(vid, languages=["en"])
                    detected_lang = "en"
                except NoTranscriptFound:
                    transcript_list = ytt.list(vid)
                    available = list(transcript_list)
                    if not available:
                        raise NoTranscriptFound(vid, [], None)
                    transcript = ytt.fetch(vid, languages=[available[0].language_code])
                    detected_lang = available[0].language_code

            segments = [{"text": s["text"], "start": s["start"], "duration": s["duration"]} for s in transcript]
            full_text = " ".join([s["text"].strip() for s in transcript])

            results.append({
                "video_id": vid,
                "title": title,
                "source_url": url,
                "full_text": full_text.replace("\n", " "),
                "segments": segments,
                "language": detected_lang
            })
            new_count += 1
            consecutive_ip_errors = 0
            print(f"✅ OK ({len(segments)} segments)")
        except Exception as e:
            err = str(e).lower()

            if "blocked" in err or "ip" in err or "too many" in err:
                ip_blocked_count += 1
                consecutive_ip_errors += 1
                print(f"🚫 IP BLOCKED (will retry next run)")
                if consecutive_ip_errors >= MAX_CONSECUTIVE_ERRORS:
                    print(f"\n⛔ IP BLOCKED {MAX_CONSECUTIVE_ERRORS}x in a row! Stopping early.")
                    break
            else:
                no_transcript_ids.add(vid)
                no_transcript_count += 1
                consecutive_ip_errors = 0
                print(f"⚠️ NO TRANSCRIPT ({str(e)[:50]})")

        time.sleep(3)

    # Step 3: Save everything
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "transcripts": results,
            "no_transcript_ids": list(no_transcript_ids)
        }, f, ensure_ascii=False, indent=2)

    # Step 4: Stats
    total_done = len(results)
    total_no_transcript = len(no_transcript_ids)
    still_remaining = len(all_videos) - total_done - total_no_transcript

    print(f"\n{'='*50}")
    print(f"📊 STATS")
    print(f"{'='*50}")
    print(f"  ✅ Previously extracted:     {len(done_ids)}")
    print(f"  ✅ Newly extracted:          {new_count}")
    print(f"  ⚠️ No transcript (permanent): {total_no_transcript}")
    print(f"  🚫 IP blocked (will retry):  {ip_blocked_count}")
    print(f"  ─────────────────────────────")
    print(f"  📦 Total saved:              {total_done}")
    print(f"  ⏳ Still remaining:           {still_remaining}")
    print(f"{'='*50}")
    if still_remaining > 0:
        print(f"⏳ Re-run this script later to continue ({still_remaining} videos left).")
    else:
        print(f"🎉 All done! Every eligible video has been extracted.")
    print(f"\nDownload '{OUTPUT_FILE}' from the Colab file browser.")

if __name__ == "__main__":
    main()
