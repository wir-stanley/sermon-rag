"""Backfill speaker names for MRI sermons in the database.
Default to Pdt. Dr. Stephen Tong for morning sermons with no explicit speaker.
"""
import asyncio
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from sqlalchemy import select
from app.database import async_session, init_db
from app.models import SermonSource
from app.services.pdf_parser import extract_text_from_pdf, SPEAKER_MAP, parse_filename

SERMON_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "Khotbah", "GRII KU Indonesia")
DEFAULT_MORNING_SPEAKER = "Pdt. Dr. Stephen Tong"

async def main():
    await init_db()
    
    async with async_session() as db:
        result = await db.execute(
            select(SermonSource)
            .where(SermonSource.source_type == "pdf_morning")
            .where((SermonSource.speaker == None) | (SermonSource.speaker == ""))
        )
        sermons = result.scalars().all()
        print(f"Found {len(sermons)} MRI sermons with empty speaker.\n")
        
        updated = 0
        defaulted = 0
        
        for sermon in sermons:
            sermon_num = sermon.sermon_number
            pdf_path = None
            
            # Find the PDF file
            if os.path.exists(SERMON_DIR):
                for f in os.listdir(SERMON_DIR):
                    if sermon_num and sermon_num in f and f.endswith(".pdf"):
                        pdf_path = os.path.join(SERMON_DIR, f)
                        break
            
            speaker = None
            
            if pdf_path:
                # 1) Check filename for speaker code
                file_info = parse_filename(os.path.basename(pdf_path))
                if file_info["speaker_code"] in SPEAKER_MAP:
                    speaker = SPEAKER_MAP[file_info["speaker_code"]]
                    print(f"  {sermon_num}: {speaker} (from filename)")
                else:
                    # 2) Try re-parsing the PDF text
                    try:
                        parsed = extract_text_from_pdf(pdf_path)
                        if parsed.speaker:
                            speaker = parsed.speaker
                            print(f"  {sermon_num}: {speaker} (from PDF text)")
                    except Exception as e:
                        print(f"  {sermon_num}: ERROR parsing - {e}")
            
            # 3) Default: morning service without identified speaker = Stephen Tong
            if not speaker:
                speaker = DEFAULT_MORNING_SPEAKER
                defaulted += 1
                print(f"  {sermon_num}: {speaker} (default)")
            
            sermon.speaker = speaker
            updated += 1
        
        await db.commit()
        
        print(f"\n{'='*50}")
        print(f"Total updated:    {updated}")
        print(f"  From filename:  {updated - defaulted - (updated - defaulted)}")
        print(f"  Defaulted (ST): {defaulted}")

asyncio.run(main())
