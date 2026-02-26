"""Chat API router — handles user questions and streams answers."""

import json
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_optional_user
from app.database import get_db
from app.models import User, Conversation, ChatMessage, MessageRole
from app.schemas import ChatRequest, ChatResponse
from app.services.query_engine import query_sermons, query_sermons_stream

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Chat"])

MAX_HISTORY_MESSAGES = 6  # last 3 turns (user + assistant each)


async def _fetch_chat_history(
    db: AsyncSession, conversation_id: int | None, user: User | None,
) -> list[dict]:
    """Load the last N messages from an existing conversation for context."""
    if not conversation_id or not user:
        return []

    conv = await db.get(Conversation, conversation_id)
    if not conv or conv.user_id != user.id:
        return []

    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(MAX_HISTORY_MESSAGES)
    )
    messages = list(reversed(result.scalars().all()))

    return [
        {"role": msg.role.value, "content": msg.content}
        for msg in messages
    ]


async def _get_or_create_conversation(
    db: AsyncSession, user: User, conversation_id: int | None, question: str,
) -> Conversation:
    """Load an existing conversation or create a new one titled from the first question."""
    if conversation_id:
        conv = await db.get(Conversation, conversation_id)
        if conv and conv.user_id == user.id:
            conv.updated_at = datetime.utcnow()
            return conv

    # Create new conversation — title is first ~80 chars of the question
    title = question[:80].rstrip() + ("..." if len(question) > 80 else "")
    conv = Conversation(user_id=user.id, title=title)
    db.add(conv)
    await db.flush()  # get conv.id without committing
    return conv


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
):
    """Ask a question about sermon content. Returns a grounded answer with citations."""
    # Fetch conversation history for context
    history = await _fetch_chat_history(db, request.conversation_id, user)

    result = await query_sermons(db, request.question, request.language, chat_history=history)

    # Persist conversation only when authenticated
    if user:
        conv = await _get_or_create_conversation(db, user, request.conversation_id, request.question)
        db.add(ChatMessage(
            conversation_id=conv.id, role=MessageRole.USER,
            content=request.question, language=request.language,
        ))
        db.add(ChatMessage(
            conversation_id=conv.id, role=MessageRole.ASSISTANT,
            content=result["answer"],
            citations=result.get("citations"),
            generation_time_ms=result.get("generation_time_ms"),
            context_chunk_count=result.get("context_chunk_count"),
            language=result.get("language"),
        ))
        await db.commit()

    return ChatResponse(**result)


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
):
    """Streaming version — sends answer tokens as server-sent events."""
    # Fetch conversation history for context
    history = await _fetch_chat_history(db, request.conversation_id, user)

    # Set up conversation persistence only when authenticated
    conv = None
    if user:
        conv = await _get_or_create_conversation(db, user, request.conversation_id, request.question)
        db.add(ChatMessage(
            conversation_id=conv.id, role=MessageRole.USER,
            content=request.question, language=request.language,
        ))
        await db.commit()

    async def event_generator():
        try:
            if conv:
                yield f"data: {json.dumps({'type': 'conversation', 'conversation_id': conv.id})}\n\n"

            full_answer = ""
            citations_data = []
            gen_time = None
            chunk_count = None

            async for event in query_sermons_stream(db, request.question, request.language, chat_history=history):
                yield f"data: {json.dumps(event)}\n\n"

                if event["type"] == "token":
                    full_answer += event["content"]
                elif event["type"] == "citations":
                    citations_data = event["data"]
                elif event["type"] == "telemetry":
                    gen_time = event["data"].get("generation_time_ms")
                    chunk_count = event["data"].get("context_chunk_count")

            # Persist assistant message only when authenticated
            if conv:
                asst_msg = ChatMessage(
                    conversation_id=conv.id, role=MessageRole.ASSISTANT,
                    content=full_answer,
                    citations=citations_data if citations_data else None,
                    generation_time_ms=gen_time,
                    context_chunk_count=chunk_count,
                    language=request.language,
                )
                db.add(asst_msg)
                await db.commit()
                yield f"data: {json.dumps({'type': 'message_id', 'id': asst_msg.id})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'token', 'content': f'\\n\\n[Backend Crash: {str(e)}]' })}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

