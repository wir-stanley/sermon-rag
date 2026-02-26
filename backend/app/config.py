"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # --- API Keys ---
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""

    # --- Database ---
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/sermon_rag"
    database_url_sync: str = "postgresql://postgres:postgres@localhost:5432/sermon_rag"

    # --- Embedding ---
    embedding_model: str = "text-embedding-3-large"
    embedding_dimensions: int = 3072

    # --- LLM ---
    llm_provider: str = "google"  # "openai" | "anthropic" | "google"
    llm_model: str = "gemini-3.0-flash"
    llm_mini_model: str = "gemini-3.0-flash"  # For lightweight tasks (rewrite, rerank)
    llm_temperature: float = 0.3
    llm_max_tokens: int = 2048

    # --- Chunking ---
    chunk_size: int = 512
    chunk_overlap: int = 50

    # --- Retrieval ---
    retrieval_top_k: int = 20
    rerank_top_n: int = 5

    # --- Clerk Auth ---
    clerk_issuer: str = ""
    clerk_jwks_url: str = ""

    # --- CORS ---
    frontend_url: str = "http://localhost:3000"

    # --- Paths ---
    sermon_pdf_dir: str = r"c:\production\GRII-RAG\Khotbah"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
