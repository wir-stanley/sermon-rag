"""Batch ingest full sermons from GRII Pusat Sore YouTube channel."""

import asyncio
import sys
import time
import yt_dlp

# Add parent dir so we can import app modules
sys.path.insert(0, "/app")

from app.database import async_session, init_db
from app.services.ingestion import ingest_youtube_urls

CHANNEL_URL = "https://www.youtube.com/@GRIIPusatSore/videos"
SKIP_KEYWORDS = [
    "Sermon Clips", "Sermon Clip", "Koor ", "Virtual Ensemble",
    "Virtual Choir", "Sekolah Minggu", "Jendela Anak", "Perkenalan",
]
BATCH_SIZE = 3  # Process 3 videos at a time to stay under rate limits
BATCH_DELAY = 10  # Seconds to wait between batches


def get_full_sermon_urls() -> list[dict]:
    """Fetch channel videos and filter to full sermons only."""
    from app.services.youtube import _yt_dlp_cookie_opts
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "skip_download": True,
        **_yt_dlp_cookie_opts(),
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(CHANNEL_URL, download=False)
        entries = info.get("entries", [])

    sermons = []
    for e in entries:
        title = e.get("title", "")
        if any(kw.lower() in title.lower() for kw in SKIP_KEYWORDS):
            continue
        sermons.append({
            "id": e["id"],
            "title": title,
            "url": f"https://www.youtube.com/watch?v={e['id']}",
        })
    return sermons


async def main():
    await init_db()

    print("Fetching channel video list...")
    sermons = get_full_sermon_urls()
    print(f"Found {len(sermons)} full sermons to ingest.\n")

    total_processed = 0
    total_chunks = 0
    total_errors = []

    for i in range(0, len(sermons), BATCH_SIZE):
        batch = sermons[i : i + BATCH_SIZE]
        batch_urls = [s["url"] for s in batch]
        batch_num = (i // BATCH_SIZE) + 1
        total_batches = (len(sermons) + BATCH_SIZE - 1) // BATCH_SIZE

        print(f"--- Batch {batch_num}/{total_batches} ---")
        for s in batch:
            print(f"  {s['title']}")

        start = time.time()
        async with async_session() as db:
            stats = await ingest_youtube_urls(db, batch_urls, language="id")

        elapsed = time.time() - start
        total_processed += stats["sources_processed"]
        total_chunks += stats["chunks_created"]
        total_errors.extend(stats["errors"])

        print(f"  Processed: {stats['sources_processed']}, Chunks: {stats['chunks_created']}, "
              f"Errors: {len(stats['errors'])}, Time: {elapsed:.1f}s")
        if stats["errors"]:
            for err in stats["errors"]:
                print(f"    ERROR: {err}")
        print(f"  Running total: {total_processed} sources, {total_chunks} chunks\n")
        sys.stdout.flush()

        # Delay between batches to avoid YouTube rate limiting
        if i + BATCH_SIZE < len(sermons):
            print(f"  Waiting {BATCH_DELAY}s before next batch...")
            await asyncio.sleep(BATCH_DELAY)

    print("=" * 60)
    print(f"DONE! Processed {total_processed} sermons, {total_chunks} chunks total.")
    if total_errors:
        print(f"{len(total_errors)} errors:")
        for err in total_errors:
            print(f"  - {err}")


if __name__ == "__main__":
    asyncio.run(main())
