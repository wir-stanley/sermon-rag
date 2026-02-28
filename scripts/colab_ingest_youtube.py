"""Google Colab: Ingest YouTube sermons into the production database.

This script mirrors the local `local_ingest_youtube.py` workflow:
  1. Fetches the channel video list via yt-dlp
  2. Filters to full sermons (skips clips, choir, etc.)
  3. Sends batches of URLs to the production API endpoint
     POST /api/ingest/youtube  (admin-only, requires Clerk JWT)

Usage in Colab:
  1. pip install yt-dlp requests
  2. Upload cookies.txt (optional, for YouTube anti-bot bypass)
  3. Set CLERK_TOKEN (your admin Bearer token) and API_BASE_URL
  4. Run this script
"""

import json
import os
import time
import requests
import yt_dlp

# ============================================================
# CONFIGURATION — edit these before running
# ============================================================

# Your production API base URL (no trailing slash)
API_BASE_URL = "https://sermon-rag-production.up.railway.app"

# Static API key for ingestion (never expires, set in Railway env vars)
INGEST_API_KEY = "ThqQrkLiWe_yYFwLJRv3q4OEGnawggI-5iU9Bgugtsc"

# YouTube channel to ingest
CHANNEL_URL = "https://www.youtube.com/@Reformed21TV/videos"

# Titles containing these keywords will be skipped
SKIP_KEYWORDS = [
    "Sermon Clips", "Sermon Clip", "Koor ", "Virtual Ensemble",
    "Virtual Choir", "Sekolah Minggu", "Jendela Anak", "Perkenalan",
    "Thoughts from His Servants", "Cuplikan", "Highlight",
]

# How many URLs to send per API call
BATCH_SIZE = 3

# Seconds to wait between batches (to avoid YouTube rate limits)
BATCH_DELAY = 10

# Preferred transcript language
LANGUAGE = "id"

# Optional cookies file for yt-dlp (to avoid IP blocks)
COOKIES_FILE = "cookies.txt"

# ============================================================


def get_full_sermon_urls() -> list[dict]:
    """Fetch channel videos and filter to full sermons only."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "skip_download": True,
    }
    if os.path.exists(COOKIES_FILE):
        ydl_opts["cookiefile"] = COOKIES_FILE
        print(f"🍪 Using cookies from {COOKIES_FILE}")

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(CHANNEL_URL, download=False)
        entries = info.get("entries", [])

    sermons = []
    skipped = []
    for e in entries:
        title = e.get("title", "")
        if any(kw.lower() in title.lower() for kw in SKIP_KEYWORDS):
            skipped.append(title)
            continue
        sermons.append({
            "id": e["id"],
            "title": title,
            "url": f"https://www.youtube.com/watch?v={e['id']}",
        })

    print(f"📺 Found {len(sermons)} full sermons, skipped {len(skipped)} non-sermon videos.")
    return sermons


def ingest_batch(urls: list[str]) -> dict:
    """Send a batch of YouTube URLs to the production API for ingestion."""
    resp = requests.post(
        f"{API_BASE_URL}/api/ingest/youtube",
        json={"urls": urls, "language": LANGUAGE},
        headers={"X-API-Key": INGEST_API_KEY},
        timeout=300,  # 5 min timeout per batch (embedding takes time)
    )
    resp.raise_for_status()
    return resp.json()


def main():
    if not INGEST_API_KEY:
        print("❌ ERROR: You must set INGEST_API_KEY before running this script!")
        return

    print("=" * 60)
    print("🚀 YouTube Sermon Ingestion (via Production API)")
    print("=" * 60)
    print(f"   API:     {API_BASE_URL}")
    print(f"   Channel: {CHANNEL_URL}")
    print(f"   Batch:   {BATCH_SIZE} URLs, {BATCH_DELAY}s delay")
    print()

    # Step 1: Get video list
    sermons = get_full_sermon_urls()
    if not sermons:
        print("Nothing to process!")
        return

    # Step 2: Ingest in batches
    total_processed = 0
    total_chunks = 0
    total_errors = []
    total_skipped = 0

    for i in range(0, len(sermons), BATCH_SIZE):
        batch = sermons[i : i + BATCH_SIZE]
        batch_urls = [s["url"] for s in batch]
        batch_num = (i // BATCH_SIZE) + 1
        total_batches = (len(sermons) + BATCH_SIZE - 1) // BATCH_SIZE

        print(f"\n--- Batch {batch_num}/{total_batches} ---")
        for s in batch:
            print(f"  📹 {s['title']}")

        try:
            start = time.time()
            result = ingest_batch(batch_urls)
            elapsed = time.time() - start

            processed = result.get("sources_processed", 0)
            chunks = result.get("chunks_created", 0)
            errors = result.get("errors", [])
            skipped = len(batch) - processed - len(errors)

            total_processed += processed
            total_chunks += chunks
            total_errors.extend(errors)
            total_skipped += skipped

            print(f"  ✅ {processed} ingested, {skipped} skipped, "
                  f"{len(errors)} errors, {elapsed:.1f}s")
            if errors:
                for err in errors:
                    print(f"    ⚠️ {err}")

        except requests.exceptions.HTTPError as e:
            print(f"  ❌ API Error: {e.response.status_code} — {e.response.text[:200]}")
            if e.response.status_code == 401:
                print("     Your INGEST_API_KEY is invalid. Check the key!")
                break
            elif e.response.status_code == 403:
                print("     Your account is not an admin. Contact the system administrator.")
                break
            total_errors.append(str(e))
        except Exception as e:
            print(f"  ❌ Error: {e}")
            total_errors.append(str(e))

        print(f"  📊 Running total: {total_processed} ingested, "
              f"{total_skipped} skipped, {total_chunks} chunks")

        # Delay between batches
        if i + BATCH_SIZE < len(sermons):
            print(f"  ⏱️ Waiting {BATCH_DELAY}s...")
            time.sleep(BATCH_DELAY)

    # Final stats
    print(f"\n{'=' * 60}")
    print(f"📊 FINAL STATS")
    print(f"{'=' * 60}")
    print(f"  ✅ Ingested:   {total_processed}")
    print(f"  ⏭️  Skipped:    {total_skipped}")
    print(f"  📦 Chunks:     {total_chunks}")
    print(f"  ⚠️  Errors:     {len(total_errors)}")
    print(f"{'=' * 60}")

    if total_errors:
        print("\nErrors:")
        for err in total_errors:
            print(f"  - {err}")

    print("\n🎉 Done!")


if __name__ == "__main__":
    main()
