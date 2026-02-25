"""Local YouTube ingestion script — runs outside Docker using your home IP.

Connects to the Dockerized PostgreSQL and uses the same chunking/embedding
pipeline as the backend.

Usage:
    cd C:\production\sermon-rag
    pip install -r scripts\requirements-local.txt
    python scripts\local_ingest_youtube.py
"""

import asyncio
import os
import sys
import time
import logging

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

# Load .env from backend
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

# Override DATABASE_URL to point to localhost (Docker exposes 5432)
os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:postgres@localhost:5432/sermon_rag"
os.environ["DATABASE_URL_SYNC"] = "postgresql://postgres:postgres@localhost:5432/sermon_rag"

import yt_dlp
from app.database import async_session, init_db
from app.services.ingestion import ingest_youtube_urls

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

CHANNEL_URL = "https://www.youtube.com/@GRIIPusatSore/videos"
SKIP_KEYWORDS = [
    "Sermon Clips", "Sermon Clip", "Koor ", "Virtual Ensemble",
    "Virtual Choir", "Sekolah Minggu", "Jendela Anak", "Perkenalan",
]
BATCH_SIZE = 3
BATCH_DELAY = 5  # seconds between batches


def get_full_sermon_urls() -> list[dict]:
    """Fetch channel videos and filter to full sermons only."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "skip_download": True,
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
    print(f"Found {len(sermons)} full sermons to process.\n")

    total_processed = 0
    total_chunks = 0
    total_errors = []
    total_skipped = 0

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

        batch_skipped = len(batch) - stats["sources_processed"] - len(stats["errors"])
        total_skipped += batch_skipped

        print(f"  Done: {stats['sources_processed']} new, {batch_skipped} skipped, "
              f"{len(stats['errors'])} errors, {elapsed:.1f}s")
        if stats["errors"]:
            for err in stats["errors"]:
                print(f"    ERROR: {err}")
        print(f"  Total so far: {total_processed} ingested, {total_skipped} skipped, "
              f"{total_chunks} chunks\n")
        sys.stdout.flush()

        # Delay between batches
        if i + BATCH_SIZE < len(sermons):
            await asyncio.sleep(BATCH_DELAY)

    print("=" * 60)
    print(f"DONE! {total_processed} sermons ingested, {total_chunks} chunks created.")
    print(f"Skipped: {total_skipped}, Errors: {len(total_errors)}")
    if total_errors:
        print("\nErrors:")
        for err in total_errors:
            print(f"  - {err}")


if __name__ == "__main__":
    asyncio.run(main())
