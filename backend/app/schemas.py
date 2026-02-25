"""Pydantic schemas for API request/response models."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# --- Chat ---

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    language: Optional[str] = Field(None, description="Force response language: 'id' or 'en'. Auto-detected if omitted.")
    conversation_id: Optional[int] = Field(None, description="Continue an existing conversation")


class SourceCitation(BaseModel):
    source_id: int
    title: str
    speaker: Optional[str] = None
    sermon_date: Optional[str] = None
    sermon_number: Optional[str] = None
    source_type: str
    relevance_score: float
    excerpt: str
    page_or_timestamp: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    citations: list[SourceCitation] = []
    language: str = "id"


# --- Ingestion ---

class IngestPDFRequest(BaseModel):
    directory: Optional[str] = None  # Override default sermon directory
    service_type: str = Field("morning", description="'morning' or 'afternoon'")


class IngestYouTubeRequest(BaseModel):
    urls: list[str] = Field(..., min_length=1)
    language: str = Field("id", description="'id' or 'en'")


class IngestResponse(BaseModel):
    status: str
    sources_processed: int
    chunks_created: int
    errors: list[str] = []


# --- Source Management ---

class SourceInfo(BaseModel):
    id: int
    source_type: str
    title: str
    speaker: Optional[str]
    sermon_date: Optional[datetime]
    sermon_number: Optional[str]
    language: str
    chunk_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Auth ---

class UserInfo(BaseModel):
    id: int
    email: str
    name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Conversations / History ---

class ConversationSummary(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageOut(BaseModel):
    id: int
    role: str
    content: str
    citations: Optional[list] = None
    language: Optional[str] = None
    created_at: datetime
    feedback: Optional["FeedbackOut"] = None

    model_config = {"from_attributes": True}


class ConversationDetail(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: list[ChatMessageOut] = []

    model_config = {"from_attributes": True}


class ConversationRenameRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)


# --- Feedback ---

class FeedbackRequest(BaseModel):
    message_id: int
    is_positive: bool
    comment: Optional[str] = Field(None, max_length=2000)


class FeedbackOut(BaseModel):
    id: int
    is_positive: bool
    comment: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class FeedbackStats(BaseModel):
    total: int
    positive: int
    negative: int
    with_comments: int
