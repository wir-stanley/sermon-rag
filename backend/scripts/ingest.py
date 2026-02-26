#!/usr/bin/env python3
"""Unified CLI tool to ingest sermon content into the theological vector database."""

import argparse
import asyncio
import sys

# Ensure the parent directory is in the path to import app modules
sys.path.insert(0, "/app")

from app.database import async_session, init_db
from app.services.ingestion import ingest_pdf_directory, ingest_youtube_urls, get_ingestion_stats


async def handle_pdf(args):
    """Handle PDF ingestion."""
    print(f"Ingesting PDFs from directory: {args.directory or 'default'}")
    print(f"Service Type: {args.service_type}")
    
    async with async_session() as db:
        stats = await ingest_pdf_directory(
            db,
            directory=args.directory,
            service_type=args.service_type
        )
        await db.commit()
    
    _print_stats(stats)


async def handle_youtube(args):
    """Handle YouTube ingestion."""
    print(f"Ingesting YouTube URLs: {args.urls}")
    
    async with async_session() as db:
        stats = await ingest_youtube_urls(
            db,
            urls=args.urls,
            language=args.language
        )
        await db.commit()
        
    _print_stats(stats)


async def handle_stats(args):
    """Show current DB ingestion stats."""
    async with async_session() as db:
        stats = await get_ingestion_stats(db)
        
    print("\n--- Current Vector DB Stats ---")
    print(f"Total Sources Ingested: {stats.get('total_sources', 0)}")
    print(f"Total Embeddings (Chunks): {stats.get('total_chunks', 0)}")
    print("Breakdown by Type:")
    for src_type, count in stats.get('by_type', {}).items():
        print(f"  - {src_type}: {count}")


def _print_stats(stats):
    print("\n--- Ingestion Complete ---")
    print(f"Sources Processed: {stats['sources_processed']}")
    print(f"Chunks Created:    {stats['chunks_created']}")
    if stats["errors"]:
        print(f"\nEncountered {len(stats['errors'])} errors:")
        for err in stats["errors"]:
            print(f"  - {err}")


async def main():
    parser = argparse.ArgumentParser(description="GRII Sermon RAG Ingestion CLI")
    subparsers = parser.add_subparsers(dest="command", required=True, help="Ingestion command")

    # PDF Subparser
    pdf_parser = subparsers.add_parser("pdf", help="Ingest a directory of PDF sermons")
    pdf_parser.add_argument("--directory", type=str, default=None, help="Absolute path to the local directory containing PDFs.")
    pdf_parser.add_argument("--service-type", type=str, choices=["morning", "afternoon"], default="morning", help="The type of service (Morning KU / Afternoon KU).")

    # YouTube Subparser
    yt_parser = subparsers.add_parser("youtube", help="Ingest one or more YouTube sermon URLs")
    yt_parser.add_argument("urls", nargs="+", help="One or more YouTube URLs to ingest")
    yt_parser.add_argument("--language", type=str, default="id", help="Transcript language to extract (default 'id').")

    # Stats Subparser
    subparsers.add_parser("stats", help="View current ingestion database statistics")

    args = parser.parse_args()

    # Initialize the database connection
    await init_db()

    if args.command == "pdf":
        await handle_pdf(args)
    elif args.command == "youtube":
        await handle_youtube(args)
    elif args.command == "stats":
        await handle_stats(args)


if __name__ == "__main__":
    # Ensure event loop handles typical async cleanup
    asyncio.run(main())
