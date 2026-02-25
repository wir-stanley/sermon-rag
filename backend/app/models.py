"""SQLAlchemy models for sermon chunks, sources, users, conversations, and feedback."""

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean,
    Enum as SAEnum, ForeignKey, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
import enum

from app.database import Base
from app.config import get_settings

settings = get_settings()


# --- Enums ---

class SourceType(str, enum.Enum):
    PDF_MORNING = "pdf_morning"
    PDF_AFTERNOON = "pdf_afternoon"
    YOUTUBE = "youtube"


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"


# --- Existing models ---

class SermonSource(Base):
    """Tracks each ingested sermon source (PDF or YouTube video)."""
    __tablename__ = "sermon_sources"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_type = Column(SAEnum(SourceType), nullable=False)
    title = Column(String(500), nullable=False)
    speaker = Column(String(200), nullable=True)
    scripture_ref = Column(String(500), nullable=True)
    sermon_date = Column(DateTime, nullable=True)
    sermon_number = Column(String(50), nullable=True)       # MRI-1847, MRIS-405, etc.
    source_url = Column(String(1000), nullable=True)        # YouTube URL or file path
    language = Column(String(10), default="id")             # "id" or "en"
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    chunk_count = Column(Integer, default=0)


class SermonChunk(Base):
    """Individual text chunks with vector embeddings."""
    __tablename__ = "sermon_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(Integer, nullable=False, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(settings.embedding_dimensions))
    chunk_index = Column(Integer, nullable=False)           # Position within source
    page_number = Column(Integer, nullable=True)            # PDF page number
    timestamp_start = Column(String(20), nullable=True)     # YouTube timestamp
    metadata_ = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


# --- New auth / chat models ---

class User(Base):
    """Application user."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(320), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=True)  # nullable for Google-only
    name = Column(String(200), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.MEMBER)
    clerk_id = Column(String(200), unique=True, nullable=True, index=True)
    google_id = Column(String(100), unique=True, nullable=True)
    avatar_url = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    feedback_items = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    """A chat conversation belonging to a user."""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False, default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan",
                            order_by="ChatMessage.created_at")


class ChatMessage(Base):
    """A single message within a conversation."""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(SAEnum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    citations = Column(JSONB, nullable=True)
    generation_time_ms = Column(Integer, nullable=True)
    context_chunk_count = Column(Integer, nullable=True)
    language = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    feedback = relationship("Feedback", back_populates="message", uselist=False, cascade="all, delete-orphan")


class Feedback(Base):
    """Thumbs up/down feedback on an assistant message."""
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey("chat_messages.id", ondelete="CASCADE"), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_positive = Column(Boolean, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    message = relationship("ChatMessage", back_populates="feedback")
    user = relationship("User", back_populates="feedback_items")
