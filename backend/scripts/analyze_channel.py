"""Analyze the full @GRIIPusatSore YouTube channel."""
import yt_dlp

CHANNEL_URL = "https://www.youtube.com/@Reformed21TV/videos"

ydl_opts = {
    "extract_flat": "in_playlist",
    "quiet": True,
    "no_warnings": True,
}

print("Fetching ALL videos from @GRIIPusatSore...")
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(CHANNEL_URL, download=False)

entries = info.get("entries", [])
print(f"Total videos found: {len(entries)}\n")

# Now fetch durations for each video
ydl_opts2 = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
}

short_videos = []  # < 15 min
medium_videos = []  # 15-45 min
long_videos = []  # > 45 min
unknown_videos = []

for i, e in enumerate(entries):
    title = e.get("title", "Unknown")
    duration = e.get("duration")
    url = e.get("url", "")

    if duration is None:
        unknown_videos.append((title, duration, url))
    elif duration < 900:  # < 15 min
        short_videos.append((title, duration, url))
    elif duration < 2700:  # 15-45 min
        medium_videos.append((title, duration, url))
    else:  # > 45 min
        long_videos.append((title, duration, url))

def fmt(secs):
    if secs is None:
        return "unknown"
    secs = int(secs)
    m, s = divmod(secs, 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h}h{m:02d}m"
    return f"{m}m{s:02d}s"

print("=" * 70)
print(f"FULL SERMONS (> 45 min): {len(long_videos)} videos")
print("=" * 70)
for title, dur, url in long_videos[:10]:
    print(f"  [{fmt(dur)}] {title}")
if len(long_videos) > 10:
    print(f"  ... and {len(long_videos) - 10} more")

print()
print("=" * 70)
print(f"MEDIUM-LENGTH (15-45 min): {len(medium_videos)} videos")
print("=" * 70)
for title, dur, url in medium_videos[:10]:
    print(f"  [{fmt(dur)}] {title}")
if len(medium_videos) > 10:
    print(f"  ... and {len(medium_videos) - 10} more")

print()
print("=" * 70)
print(f"SHORT CLIPS (< 15 min): {len(short_videos)} videos")
print("=" * 70)
for title, dur, url in short_videos:
    print(f"  [{fmt(dur)}] {title}")

print()
print("=" * 70)
print(f"UNKNOWN DURATION: {len(unknown_videos)} videos")
print("=" * 70)
for title, dur, url in unknown_videos:
    print(f"  {title}")

print()
print("=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"  Full sermons (>45 min):    {len(long_videos)}")
print(f"  Medium (15-45 min):        {len(medium_videos)}")
print(f"  Short clips (<15 min):     {len(short_videos)}")
print(f"  Unknown duration:          {len(unknown_videos)}")
print(f"  TOTAL:                     {len(entries)}")
print()
print("RECOMMENDATION:")
print(f"  Ingest-worthy videos: {len(long_videos) + len(medium_videos)} (all medium + full sermons)")
print(f"  Skip: {len(short_videos)} short clips (likely announcements/trailers)")
