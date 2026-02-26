"""Import transcripts from Colab JSON export into the database.

Usage:
    python scripts/import_transcripts.py scripts/grii_transcripts.json
"""

import asyncio
import json
import logging
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
# Database URL comes from .env (Supabase)

from sqlalchemy import select
from app.database import async_session, init_db
from app.models import SermonSource, SermonChunk, SourceType
from app.services.chunker import chunk_text
from app.services.embedder import generate_embeddings

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


async def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_transcripts.py <path_to_grii_transcripts.json>")
        sys.exit(1)

    json_path = sys.argv[1]
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    transcripts = data["transcripts"]
    print(f"Loaded {len(transcripts)} transcripts from {json_path}\n")

    await init_db()

    total_processed = 0
    total_chunks = 0
    total_skipped = 0

    for i, t in enumerate(transcripts):
        video_id = t["video_id"]
        title = t["title"]
        source_url = t["source_url"]

        print(f"[{i+1}/{len(transcripts)}] {title}...", end=" ")

        async with async_session() as db:
            # Check if already ingested
            existing = await db.execute(
                select(SermonSource).where(SermonSource.source_url == source_url)
            )
            if existing.scalars().first():
                print("SKIPPED (already ingested)")
                total_skipped += 1
                continue

            try:
                # Create source record
                source = SermonSource(
                    source_type=SourceType.YOUTUBE,
                    title=title,
                    source_url=source_url,
                    language=t["language"],
                    metadata_={
                        "video_id": video_id,
                        "segment_count": len(t["segments"]),
                    },
                )
                db.add(source)
                await db.flush()

                # Chunk the transcript
                chunks = chunk_text(
                    text=t["full_text"],
                    metadata={
                        "source_id": source.id,
                        "title": title,
                        "video_id": video_id,
                    },
                )

                # Map chunks to timestamps
                for chunk_data in chunks:
                    chunk_content = chunk_data["content"]
                    char_pos = t["full_text"].find(chunk_content[:50])
                    if char_pos >= 0 and t["segments"]:
                        accumulated = 0
                        for seg in t["segments"]:
                            accumulated += len(seg["text"]) + 1
                            if accumulated >= char_pos:
                                minutes = int(seg["start"] // 60)
                                seconds = int(seg["start"] % 60)
                                chunk_data["timestamp_start"] = f"{minutes}:{seconds:02d}"
                                break

                if not chunks:
                    print("NO CHUNKS")
                    continue

                # Generate embeddings
                chunk_texts = [c["content"] for c in chunks]
                embeddings = generate_embeddings(chunk_texts)

                # Store chunks
                for chunk_data, embedding in zip(chunks, embeddings):
                    chunk = SermonChunk(
                        source_id=source.id,
                        content=chunk_data["content"],
                        embedding=embedding,
                        chunk_index=chunk_data["chunk_index"],
                        timestamp_start=chunk_data.get("timestamp_start"),
                        metadata_=chunk_data.get("metadata", {}),
                    )
                    db.add(chunk)

                source.chunk_count = len(chunks)
                await db.commit()

                total_processed += 1
                total_chunks += len(chunks)
                print(f"OK ({len(chunks)} chunks)")

            except Exception as e:
                logger.error(f"Error: {e}")
                await db.rollback()
                print(f"ERROR: {e}")

    print(f"\n{'='*60}")
    print(f"DONE! {total_processed} sermons imported, {total_chunks} chunks created.")
    print(f"Skipped: {total_skipped}")


if __name__ == "__main__":
    asyncio.run(main())
