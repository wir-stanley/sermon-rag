"""RAG query engine — retrieves relevant sermon chunks and generates
grounded answers with source citations via the configured LLM provider."""

import logging
import time
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SermonChunk, SermonSource
from app.services.embedder import generate_single_embedding
from app.services.query_rewriter import rewrite_query
from app.services.reranker import rerank_chunks
from app.services.llm_provider import chat_completion, chat_completion_stream
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


SYSTEM_PROMPT = """You are a knowledgeable theological assistant for GRII (Gereja Reformed Injili Indonesia / Indonesian Reformed Evangelical Church). You help church members find answers from past sermon transcripts.

CRITICAL RULES:
1. Answer ONLY based on the sermon excerpts provided in the context below. Do not fabricate or add information not found in the excerpts.
2. If the context doesn't contain relevant information, say so honestly — do not make up an answer.
3. Always cite which sermon(s) your answer comes from using the format [Sermon Number - Title/Speaker].
4. Be warm, pastoral, and encouraging in tone — you are serving a church community.
5. When referencing Bible verses mentioned in the sermons, you may provide additional context about those verses since you know the Bible well.
6. ALWAYS respond in Indonesian (Bahasa Indonesia), even if the user asks their question in English. This is an Indonesian church application.
7. Structure longer answers with clear paragraphs and bullet points for readability.

CONTEXT FROM SERMON TRANSCRIPTS:
{context}
"""


async def retrieve_relevant_chunks(
    db: AsyncSession,
    query: str,
    top_k: int | None = None,
) -> list[dict]:
    """Retrieve relevant sermon chunks using hybrid search (vector + full-text).
    
    Combines pgvector cosine similarity with PostgreSQL full-text search
    using Reciprocal Rank Fusion (RRF) for score merging.
    """
    top_k = top_k or settings.retrieval_top_k
    rrf_k = 60  # RRF constant

    # Generate query embedding
    query_embedding = generate_single_embedding(query)
    embedding_str = str(query_embedding)

    # --- Vector search (semantic) ---
    vec_result = await db.execute(
        text("""
            SELECT
                sc.id,
                sc.source_id,
                sc.content,
                sc.chunk_index,
                sc.page_number,
                sc.timestamp_start,
                sc.metadata,
                1 - (sc.embedding <=> CAST(:query_embedding AS vector)) AS similarity
            FROM sermon_chunks sc
            ORDER BY sc.embedding <=> CAST(:query_embedding AS vector)
            LIMIT :fetch_k
        """),
        {"query_embedding": embedding_str, "fetch_k": top_k * 2},
    )
    vec_rows = vec_result.mappings().all()

    # --- Full-text search (keyword / BM25-like) ---
    fts_result = await db.execute(
        text("""
            SELECT
                sc.id,
                sc.source_id,
                sc.content,
                sc.chunk_index,
                sc.page_number,
                sc.timestamp_start,
                sc.metadata,
                ts_rank_cd(to_tsvector('simple', sc.content), plainto_tsquery('simple', :query)) AS fts_rank
            FROM sermon_chunks sc
            WHERE to_tsvector('simple', sc.content) @@ plainto_tsquery('simple', :query)
            ORDER BY fts_rank DESC
            LIMIT :fetch_k
        """),
        {"query": query, "fetch_k": top_k * 2},
    )
    fts_rows = fts_result.mappings().all()

    # --- Reciprocal Rank Fusion ---
    scores: dict[int, float] = {}
    row_data: dict[int, dict] = {}

    for rank, row in enumerate(vec_rows):
        chunk_id = row["id"]
        scores[chunk_id] = scores.get(chunk_id, 0) + 1.0 / (rrf_k + rank + 1)
        row_data[chunk_id] = dict(row)

    for rank, row in enumerate(fts_rows):
        chunk_id = row["id"]
        scores[chunk_id] = scores.get(chunk_id, 0) + 1.0 / (rrf_k + rank + 1)
        if chunk_id not in row_data:
            row_data[chunk_id] = dict(row)

    # Sort by fused score, take top_k
    top_ids = sorted(scores, key=lambda cid: scores[cid], reverse=True)[:top_k]

    # Enrich with source metadata
    chunks = []
    source_cache = {}

    for chunk_id in top_ids:
        row = row_data[chunk_id]
        source_id = row["source_id"]
        if source_id not in source_cache:
            source_result = await db.execute(
                select(SermonSource).where(SermonSource.id == source_id)
            )
            source = source_result.scalar_one_or_none()
            if source:
                source_cache[source_id] = {
                    "title": source.title,
                    "speaker": source.speaker,
                    "sermon_date": source.sermon_date.isoformat() if source.sermon_date else None,
                    "sermon_number": source.sermon_number,
                    "source_type": source.source_type.value if source.source_type else None,
                    "source_url": source.source_url,
                    "scripture_ref": source.scripture_ref,
                }

        source_meta = source_cache.get(source_id, {})

        chunks.append({
            "id": row["id"],
            "source_id": source_id,
            "content": row["content"],
            "similarity": round(scores[chunk_id], 6),  # RRF fused score
            "page_number": row["page_number"],
            "timestamp_start": row["timestamp_start"],
            **source_meta,
        })

    return chunks


def _build_context(chunks: list[dict], max_chunks: int | None = None) -> str:
    """Build context string from retrieved chunks for the LLM prompt."""
    max_chunks = max_chunks or settings.rerank_top_n
    top_chunks = chunks[:max_chunks]

    context_parts = []
    for i, chunk in enumerate(top_chunks, 1):
        header = f"[Source {i}]"
        if chunk.get("sermon_number"):
            header += f" {chunk['sermon_number']}"
        if chunk.get("title"):
            header += f" - {chunk['title']}"
        if chunk.get("speaker"):
            header += f" ({chunk['speaker']})"
        if chunk.get("sermon_date"):
            header += f" [{chunk['sermon_date'][:10]}]"
        if chunk.get("scripture_ref"):
            header += f" | {chunk['scripture_ref']}"

        context_parts.append(f"{header}\n{chunk['content']}")

    return "\n\n---\n\n".join(context_parts)


async def query_sermons(
    db: AsyncSession,
    question: str,
    language: str | None = None,
    chat_history: list[dict] | None = None,
) -> dict:
    """Full RAG pipeline: retrieve → build context → generate answer."""
    # Rewrite vague or follow-up questions for better retrieval
    search_query = rewrite_query(question, chat_history) if chat_history else question

    # Retrieve relevant chunks using the (possibly rewritten) search query
    chunks = await retrieve_relevant_chunks(db, search_query)
    chunk_count = len(chunks)

    if not chunks:
        return {
            "answer": "Maaf, saya tidak menemukan konten khotbah yang relevan untuk menjawab pertanyaan Anda. Silakan coba rumuskan ulang atau tanyakan topik yang berbeda.",
            "citations": [],
            "language": "id",
            "generation_time_ms": 0,
            "context_chunk_count": 0,
        }

    # Re-rank for true relevance (uses original question, not rewritten)
    chunks = rerank_chunks(question, chunks)

    # Build context from re-ranked chunks
    context = _build_context(chunks)

    # Generate answer via configured LLM provider
    system_message = SYSTEM_PROMPT.format(context=context)

    # Build messages: system → conversation history → current question
    messages = [{"role": "system", "content": system_message}]
    if chat_history:
        messages.extend(chat_history)
    messages.append({"role": "user", "content": question})

    start_time = time.time()
    answer = chat_completion(messages)
    generation_time_ms = int((time.time() - start_time) * 1000)

    # Build citations from the top chunks used
    citations = []
    seen_sources = set()
    for chunk in chunks[: settings.rerank_top_n]:
        source_id = chunk["source_id"]
        if source_id in seen_sources:
            continue
        seen_sources.add(source_id)

        page_or_ts = None
        if chunk.get("page_number"):
            page_or_ts = f"Page {chunk['page_number']}"
        elif chunk.get("timestamp_start"):
            page_or_ts = chunk["timestamp_start"]

        citations.append({
            "source_id": source_id,
            "title": chunk.get("title", ""),
            "speaker": chunk.get("speaker"),
            "sermon_date": chunk.get("sermon_date"),
            "sermon_number": chunk.get("sermon_number"),
            "source_type": chunk.get("source_type", ""),
            "relevance_score": round(chunk["similarity"], 4),
            "excerpt": chunk["content"][:200] + "..." if len(chunk["content"]) > 200 else chunk["content"],
            "page_or_timestamp": page_or_ts,
        })

    return {
        "answer": answer,
        "citations": citations,
        "language": language or "id",
        "generation_time_ms": generation_time_ms,
        "context_chunk_count": chunk_count,
    }


async def query_sermons_stream(
    db: AsyncSession,
    question: str,
    language: str | None = None,
    chat_history: list[dict] | None = None,
):
    """Streaming version of query_sermons. Yields answer tokens as they arrive."""
    # Rewrite vague or follow-up questions for better retrieval
    search_query = rewrite_query(question, chat_history) if chat_history else question

    # Retrieve relevant chunks using the (possibly rewritten) search query
    chunks = await retrieve_relevant_chunks(db, search_query)
    chunk_count = len(chunks)

    if not chunks:
        no_answer = "Maaf, saya tidak menemukan konten khotbah yang relevan untuk menjawab pertanyaan Anda."
        yield {"type": "token", "content": no_answer}
        yield {"type": "citations", "data": []}
        yield {"type": "telemetry", "data": {"generation_time_ms": 0, "context_chunk_count": 0}}
        yield {"type": "done"}
        return

    # Re-rank for true relevance
    chunks = rerank_chunks(question, chunks)

    context = _build_context(chunks)

    system_message = SYSTEM_PROMPT.format(context=context)

    # Build messages: system → conversation history → current question
    messages = [{"role": "system", "content": system_message}]
    if chat_history:
        messages.extend(chat_history)
    messages.append({"role": "user", "content": question})

    start_time = time.time()
    for token in chat_completion_stream(messages):
        yield {"type": "token", "content": token}
    generation_time_ms = int((time.time() - start_time) * 1000)

    # Send citations after full answer
    citations = []
    seen_sources = set()
    for chunk in chunks[: settings.rerank_top_n]:
        source_id = chunk["source_id"]
        if source_id in seen_sources:
            continue
        seen_sources.add(source_id)

        page_or_ts = None
        if chunk.get("page_number"):
            page_or_ts = f"Page {chunk['page_number']}"
        elif chunk.get("timestamp_start"):
            page_or_ts = chunk["timestamp_start"]

        citations.append({
            "source_id": source_id,
            "title": chunk.get("title", ""),
            "speaker": chunk.get("speaker"),
            "sermon_date": chunk.get("sermon_date"),
            "sermon_number": chunk.get("sermon_number"),
            "source_type": chunk.get("source_type", ""),
            "relevance_score": round(chunk["similarity"], 4),
            "excerpt": chunk["content"][:200] + "...",
            "page_or_timestamp": page_or_ts,
        })

    yield {"type": "citations", "data": citations}
    yield {"type": "telemetry", "data": {"generation_time_ms": generation_time_ms, "context_chunk_count": chunk_count}}
    yield {"type": "done"}
