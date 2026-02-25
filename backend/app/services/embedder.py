"""Embedding generation service using OpenAI."""

import logging
from openai import OpenAI
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def generate_embeddings(texts: list[str], batch_size: int = 100) -> list[list[float]]:
    """Generate embeddings for a list of texts using OpenAI API.

    Processes in batches to avoid API limits.
    Returns list of embedding vectors (each is a list of floats).
    """
    client = _get_client()
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        logger.info(f"Embedding batch {i // batch_size + 1}/{(len(texts) - 1) // batch_size + 1} ({len(batch)} texts)")

        response = client.embeddings.create(
            model=settings.embedding_model,
            input=batch,
            dimensions=settings.embedding_dimensions,
        )

        batch_embeddings = [item.embedding for item in response.data]
        all_embeddings.extend(batch_embeddings)

    return all_embeddings


def generate_single_embedding(text: str) -> list[float]:
    """Generate embedding for a single text."""
    return generate_embeddings([text])[0]
