"""Backfill speaker names for existing YouTube sermon sources.

Reads the title of each YouTube source and extracts the speaker name.
"""
import asyncio
import re
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.database import engine, async_session
from app.models import SermonSource, SourceType


def extract_speaker_from_yt_title(title: str) -> str:
    """Extract speaker name from YouTube video title."""
    match = re.search(
        r'[-–]\s*((?:Pdt\.\s*(?:Dr\.\s*)?|Ev\.\s*)[A-Z][a-zA-Z\s.]+)',
        title
    )
    if match:
        speaker = match.group(1).strip()
        speaker = re.sub(r'\s*\|.*$', '', speaker).strip()
        return speaker
    return ""


async def main():
    async with async_session() as db:
        result = await db.execute(
            select(SermonSource).where(SermonSource.source_type == SourceType.YOUTUBE)
        )
        sources = result.scalars().all()

        updated = 0
        for source in sources:
            speaker = extract_speaker_from_yt_title(source.title)
            if speaker and source.speaker != speaker:
                print(f"  [{source.id}] {source.title}")
                print(f"    -> Speaker: {speaker}")
                source.speaker = speaker
                updated += 1
            elif not speaker:
                print(f"  [{source.id}] {source.title} -> NO SPEAKER FOUND")

        await db.commit()
        print(f"\nUpdated {updated}/{len(sources)} YouTube sources with speaker names.")


if __name__ == "__main__":
    asyncio.run(main())
