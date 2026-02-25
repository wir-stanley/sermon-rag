"""Feedback API router — thumbs up/down on assistant messages."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user, require_admin
from app.database import get_db
from app.models import User, ChatMessage, Feedback, MessageRole
from app.schemas import FeedbackRequest, FeedbackOut, FeedbackStats

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


@router.post("", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    body: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Submit thumbs up/down for an assistant message. Upserts — one feedback per message."""
    # Verify the message exists and is an assistant message
    msg = await db.get(ChatMessage, body.message_id)
    if msg is None or msg.role != MessageRole.ASSISTANT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assistant message not found")

    # Check for existing feedback (upsert)
    result = await db.execute(
        select(Feedback).where(Feedback.message_id == body.message_id)
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.is_positive = body.is_positive
        existing.comment = body.comment
        await db.commit()
        await db.refresh(existing)
        return existing

    fb = Feedback(
        message_id=body.message_id,
        user_id=user.id,
        is_positive=body.is_positive,
        comment=body.comment,
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)
    return fb


@router.get("/stats", response_model=FeedbackStats)
async def feedback_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Aggregate feedback statistics. Admin only."""
    total = (await db.execute(select(func.count(Feedback.id)))).scalar() or 0
    positive = (await db.execute(
        select(func.count(Feedback.id)).where(Feedback.is_positive == True)
    )).scalar() or 0
    negative = total - positive
    with_comments = (await db.execute(
        select(func.count(Feedback.id)).where(Feedback.comment.isnot(None))
    )).scalar() or 0

    return FeedbackStats(total=total, positive=positive, negative=negative, with_comments=with_comments)
