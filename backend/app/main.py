"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import auth, chat, feedback, history, ingest

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized. pgvector extension enabled.")
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="GRII Sermon RAG",
    description="Ask questions about past sermons from Gereja Reformed Injili Indonesia",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(feedback.router)
app.include_router(history.router)
app.include_router(ingest.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "grii-sermon-rag"}
