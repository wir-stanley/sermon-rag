"""PDF parser for GRII sermon documents.

Extracts text, title, speaker, scripture reference, date, and sermon number
from the standardized GRII PDF format:
  - Header: "Ringkasan Khotbah / Gereja Reformed Injili Indonesia"
  - Sermon number (e.g., 289)
  - Date, title, speaker (Pdt. XYZ)
  - Scripture reference
  - Two-column body text
  - Footer: "GRII SORE 289 – [hal. 1]" or "GRII 1847 – [hal. 1]"
"""

import fitz  # PyMuPDF
import re
import os
from datetime import datetime
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ParsedSermon:
    text: str
    title: str = ""
    speaker: str = ""
    scripture_ref: str = ""
    sermon_date: datetime | None = None
    sermon_number: str = ""
    source_type: str = "pdf_morning"
    language: str = "id"
    file_path: str = ""
    page_count: int = 0
    page_texts: list[str] = field(default_factory=list)


# Speaker code → full name mapping
SPEAKER_MAP = {
    "IK": "Pdt. Ivan Kristiono",
    "HL": "Pdt. Hadi Lim",
    "HT": "Pdt. Hadi Tjahyono",
    "HO": "Pdt. Heryanto Ong",
    "JP": "Pdt. Jimmy Pardede",
    "DT": "Pdt. Dawis Triyadi",
    "AU": "Pdt. Agus Urip",
    "ATR": "Pdt. Andrew Te Reh",
    "IR": "Pdt. Iwan Rosady",
    "BT": "Pdt. Benyamin Toy",
    "NS": "Pdt. Naga Surya",
    "RW": "Pdt. Richard Wenas",
    "BK": "Pdt. Billy Kristanto",
    "TS": "Pdt. Tony Salim",
    "JK": "Pdt. Jimmy Kuswadi",
}


def parse_filename(filename: str) -> dict:
    """Extract metadata from filename pattern: YYYYMMDD MRI-XXXX (speaker).pdf"""
    info = {
        "sermon_date": None,
        "sermon_number": "",
        "speaker_code": "",
        "source_type": "pdf_morning",
    }

    basename = Path(filename).stem

    # Extract date (first 8 digits)
    date_match = re.match(r"(\d{8})", basename)
    if date_match:
        try:
            info["sermon_date"] = datetime.strptime(date_match.group(1), "%Y%m%d")
        except ValueError:
            pass

    # Extract sermon number (MRI-XXXX or MRIS-XXX)
    num_match = re.search(r"(MRI[S]?-\d+)", basename)
    if num_match:
        info["sermon_number"] = num_match.group(1)
        if "MRIS" in info["sermon_number"]:
            info["source_type"] = "pdf_afternoon"

    # Also handle special services
    if not num_match:
        special_match = re.search(r"MRI[S]?-(.+)", basename)
        if special_match:
            info["sermon_number"] = special_match.group(0)

    # Extract speaker code from parentheses
    speaker_match = re.search(r"\(([A-Z]+)\)", basename)
    if speaker_match:
        info["speaker_code"] = speaker_match.group(1)

    return info


def extract_text_from_pdf(file_path: str) -> ParsedSermon:
    """Extract and parse a GRII sermon PDF."""
    doc = fitz.open(file_path)

    page_texts = []
    full_text_parts = []

    for page in doc:
        text = page.get_text()
        # Clean up common artifacts
        text = re.sub(r"\n{3,}", "\n\n", text)
        page_texts.append(text)
        full_text_parts.append(text)

    full_text = "\n".join(full_text_parts)

    # Parse filename metadata
    file_info = parse_filename(os.path.basename(file_path))

    # Try extracting title from text (usually in CAPS after header)
    title = ""
    title_match = re.search(r"\n([A-Z][A-Z\s,;:'\-–—]{5,})\n", full_text)
    if title_match:
        title = title_match.group(1).strip()

    # Try extracting speaker from text (Pdt. XXX pattern)
    speaker = ""
    speaker_text_match = re.search(r"Pdt\.\s+([A-Za-z\s]+?)(?:\n|$)", full_text)
    if speaker_text_match:
        speaker = f"Pdt. {speaker_text_match.group(1).strip()}"
    elif file_info["speaker_code"] in SPEAKER_MAP:
        speaker = SPEAKER_MAP[file_info["speaker_code"]]

    # Try extracting scripture reference
    scripture_ref = ""
    scripture_match = re.search(
        r"(\d?\s*[A-Za-z]+\s+\d+:\d+[\-–—]?\d*(?:\s*[,;]\s*\d+:\d+[\-–—]?\d*)*)",
        full_text[:500],
    )
    if scripture_match:
        scripture_ref = scripture_match.group(1).strip()

    # Clean the body text: remove headers/footers
    clean_text = full_text
    # Remove page headers like "GRII 1847 –[hal. 1 ]"
    clean_text = re.sub(r"GRII\s*(SORE)?\s*\d+\s*[–\-]\s*\[?\s*hal\.\s*\d+\s*\]?", "", clean_text)
    # Remove "Ringkasan Khotbah" header block
    clean_text = re.sub(r"Ringkasan Khotbah.*?Indonesia", "", clean_text, flags=re.DOTALL)
    # Remove excessive whitespace
    clean_text = re.sub(r"\n{3,}", "\n\n", clean_text).strip()

    sermon = ParsedSermon(
        text=clean_text,
        title=title,
        speaker=speaker,
        scripture_ref=scripture_ref,
        sermon_date=file_info["sermon_date"],
        sermon_number=file_info["sermon_number"],
        source_type=file_info["source_type"],
        language="id",
        file_path=file_path,
        page_count=len(doc),
        page_texts=page_texts,
    )

    doc.close()
    return sermon


def scan_sermon_directory(directory: str) -> list[str]:
    """Scan directory recursively for PDF files."""
    pdf_files = []
    for root, _, files in os.walk(directory):
        for f in sorted(files):
            if f.lower().endswith(".pdf"):
                pdf_files.append(os.path.join(root, f))
    return pdf_files
