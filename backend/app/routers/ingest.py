"""Ingestion API router — endpoints for uploading and managing sermon sources."""

import logging
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.auth import require_admin
from app.config import get_settings
from app.database import get_db
from app.models import SermonSource, User
from app.schemas import (
    IngestPDFRequest,
    IngestYouTubeRequest,
    IngestResponse,
    SourceInfo,
)
from app.services.ingestion import (
    ingest_pdf_directory,
    ingest_youtube_urls,
    get_ingestion_stats,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])
settings = get_settings()


async def require_admin_or_api_key(
    x_api_key: Optional[str] = Header(None),
    admin: Optional[User] = None,
):
    """Allow access via either Clerk admin JWT or a static API key."""
    # Check API key first
    if x_api_key and settings.ingest_api_key and x_api_key == settings.ingest_api_key:
        return True
    # Fall back to Clerk admin auth — but we need to call it manually
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")


@router.post("/pdf", response_model=IngestResponse)
async def ingest_pdfs(
    request: IngestPDFRequest,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Ingest all sermon PDFs from a directory. Admin only."""
    stats = await ingest_pdf_directory(db, request.directory, request.service_type)
    return IngestResponse(
        status="completed",
        sources_processed=stats["sources_processed"],
        chunks_created=stats["chunks_created"],
        errors=stats["errors"],
    )


@router.post("/youtube", response_model=IngestResponse)
async def ingest_youtube(
    request: IngestYouTubeRequest,
    db: AsyncSession = Depends(get_db),
    x_api_key: Optional[str] = Header(None),
):
    """Ingest YouTube sermon videos. Requires admin JWT or API key."""
    # Check API key
    if x_api_key and settings.ingest_api_key and x_api_key == settings.ingest_api_key:
        pass  # Authorized via API key
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Valid X-API-Key header required")

    stats = await ingest_youtube_urls(db, request.urls, request.language)
    return IngestResponse(
        status="completed",
        sources_processed=stats["sources_processed"],
        chunks_created=stats["chunks_created"],
        errors=stats["errors"],
    )


@router.get("/stats")
async def stats(db: AsyncSession = Depends(get_db)):
    """Get ingestion statistics."""
    return await get_ingestion_stats(db)


@router.get("/sources", response_model=list[SourceInfo])
async def list_sources(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all ingested sources."""
    result = await db.execute(
        select(SermonSource)
        .order_by(SermonSource.sermon_date.desc())
        .offset(skip)
        .limit(limit)
    )
    sources = result.scalars().all()
    return sources
