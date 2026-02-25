"""Ingestion orchestration — coordinates PDF parsing, YouTube extraction,
chunking, embedding, and database storage."""

import logging
import os
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SermonSource, SermonChunk, SourceType
from app.services.pdf_parser import extract_text_from_pdf, scan_sermon_directory, parse_filename
from app.services.youtube import get_transcript
from app.services.chunker import chunk_sermon_pages, chunk_text
from app.services.embedder import generate_embeddings
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def ingest_pdf_directory(
    db: AsyncSession,
    directory: str | None = None,
    service_type: str = "morning",
) -> dict:
    """Ingest all PDFs from a directory into the vector store."""
    if directory is None:
        if service_type == "morning":
            directory = os.path.join(settings.sermon_pdf_dir, "GRII KU Indonesia")
        else:
            directory = os.path.join(settings.sermon_pdf_dir, "KU SORE")

    pdf_files = scan_sermon_directory(directory)
    logger.info(f"Found {len(pdf_files)} PDFs in {directory}")

    stats = {"sources_processed": 0, "chunks_created": 0, "errors": []}

    for pdf_path in pdf_files:
        try:
            # Check if already ingested
            filename = os.path.basename(pdf_path)
            existing = await db.execute(
                select(SermonSource).where(SermonSource.source_url == pdf_path)
            )
            if existing.scalar_one_or_none():
                logger.info(f"Skipping already ingested: {filename}")
                continue

            # Parse PDF
            sermon = extract_text_from_pdf(pdf_path)
            if not sermon.text.strip():
                stats["errors"].append(f"Empty text: {filename}")
                continue

            # Create source record
            source = SermonSource(
                source_type=SourceType.PDF_MORNING if service_type == "morning" else SourceType.PDF_AFTERNOON,
                title=sermon.title or sermon.sermon_number or filename,
                speaker=sermon.speaker,
                scripture_ref=sermon.scripture_ref,
                sermon_date=sermon.sermon_date,
                sermon_number=sermon.sermon_number,
                source_url=pdf_path,
                language=sermon.language,
                metadata_={
                    "file_path": pdf_path,
                    "page_count": sermon.page_count,
                },
            )
            db.add(source)
            await db.flush()  # Get the source ID

            # Chunk the sermon
            chunks = chunk_sermon_pages(
                page_texts=sermon.page_texts,
                metadata={
                    "source_id": source.id,
                    "title": source.title,
                    "speaker": sermon.speaker,
                    "sermon_number": sermon.sermon_number,
                    "sermon_date": sermon.sermon_date.isoformat() if sermon.sermon_date else None,
                },
            )

            if not chunks:
                stats["errors"].append(f"No chunks generated: {filename}")
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
                    page_number=chunk_data.get("page_number"),
                    metadata_=chunk_data.get("metadata", {}),
                )
                db.add(chunk)

            source.chunk_count = len(chunks)
            stats["sources_processed"] += 1
            stats["chunks_created"] += len(chunks)

            logger.info(f"Ingested {filename}: {len(chunks)} chunks")

            # Commit per file to avoid losing progress
            await db.commit()

        except Exception as e:
            logger.error(f"Error ingesting {pdf_path}: {e}")
            stats["errors"].append(f"{os.path.basename(pdf_path)}: {str(e)}")
            await db.rollback()

    return stats


async def ingest_youtube_urls(
    db: AsyncSession,
    urls: list[str],
    language: str = "id",
) -> dict:
    """Ingest YouTube videos into the vector store."""
    stats = {"sources_processed": 0, "chunks_created": 0, "errors": []}

    for url in urls:
        try:
            # Normalize URL to standard format
            from app.services.youtube import extract_video_id
            vid = extract_video_id(url)
            normalized_url = f"https://www.youtube.com/watch?v={vid}" if vid else url

            # Check if already ingested
            existing = await db.execute(
                select(SermonSource).where(SermonSource.source_url == normalized_url)
            )
            if existing.scalars().first():
                logger.info(f"Skipping already ingested: {url}")
                continue

            # Extract transcript
            result = get_transcript(url, preferred_language=language)

            # Create source record
            source = SermonSource(
                source_type=SourceType.YOUTUBE,
                title=result.title,
                source_url=result.source_url,
                language=result.language,
                metadata_={
                    "video_id": result.video_id,
                    "segment_count": len(result.segments),
                },
            )
            db.add(source)
            await db.flush()

            # Chunk the transcript
            chunks = chunk_text(
                text=result.full_text,
                metadata={
                    "source_id": source.id,
                    "title": result.title,
                    "video_id": result.video_id,
                },
            )

            # Map chunks to timestamps using segments
            for chunk_data in chunks:
                chunk_text_content = chunk_data["content"]
                # Find approximate timestamp
                char_pos = result.full_text.find(chunk_text_content[:50])
                if char_pos >= 0 and result.segments:
                    # Estimate which segment this corresponds to
                    accumulated = 0
                    for seg in result.segments:
                        accumulated += len(seg["text"]) + 1
                        if accumulated >= char_pos:
                            minutes = int(seg["start"] // 60)
                            seconds = int(seg["start"] % 60)
                            chunk_data["timestamp_start"] = f"{minutes}:{seconds:02d}"
                            break

            if not chunks:
                stats["errors"].append(f"No chunks generated: {url}")
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
            stats["sources_processed"] += 1
            stats["chunks_created"] += len(chunks)

            logger.info(f"Ingested YouTube {result.video_id}: {len(chunks)} chunks")
            await db.commit()

        except Exception as e:
            logger.error(f"Error ingesting {url}: {e}")
            stats["errors"].append(f"{url}: {str(e)}")
            await db.rollback()

    return stats


async def get_ingestion_stats(db: AsyncSession) -> dict:
    """Get current ingestion statistics."""
    source_count = await db.execute(select(func.count(SermonSource.id)))
    chunk_count = await db.execute(select(func.count(SermonChunk.id)))

    by_type = await db.execute(
        select(SermonSource.source_type, func.count(SermonSource.id))
        .group_by(SermonSource.source_type)
    )

    return {
        "total_sources": source_count.scalar(),
        "total_chunks": chunk_count.scalar(),
        "by_type": {str(row[0].value): row[1] for row in by_type.all()},
    }
