"""Re-ranker — scores (query, chunk) pairs for true relevance after initial retrieval.

Uses the provider's mini model as a cross-encoder-style re-ranker.
Cheaper than the main model but far more accurate than embedding distance alone.
"""

import logging
from app.services.llm_provider import chat_completion
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


RERANK_PROMPT = """Score how relevant the following text passage is to the search query.
Return ONLY a number from 0 to 10, where:
- 0 = completely irrelevant
- 5 = somewhat relevant, tangentially related
- 10 = directly and precisely answers the query

Query: {query}

Passage: {passage}

Score:"""


def rerank_chunks(
    query: str,
    chunks: list[dict],
    top_n: int | None = None,
) -> list[dict]:
    """Re-rank retrieved chunks by true relevance using LLM scoring.
    
    Takes an over-retrieved set of chunks and returns the top_n most relevant.
    Each chunk gets a relevance score from the provider's mini model.
    """
    top_n = top_n or settings.rerank_top_n
    
    if len(chunks) <= top_n:
        return chunks

    scored_chunks = []

    for chunk in chunks:
        try:
            score_text = chat_completion(
                messages=[{
                    "role": "user",
                    "content": RERANK_PROMPT.format(
                        query=query,
                        passage=chunk["content"][:500],
                    ),
                }],
                temperature=0,
                max_tokens=5,
                use_mini=True,
            ).strip()
            score = float(score_text)
        except (ValueError, Exception) as e:
            logger.debug("Rerank score parse failed for chunk %s: %s", chunk.get("id"), e)
            score = 5.0  # Default to middle score if parsing fails

        scored_chunks.append({**chunk, "rerank_score": score})

    # Sort by rerank score descending
    scored_chunks.sort(key=lambda c: c["rerank_score"], reverse=True)
    
    logger.info(
        "Reranked %d chunks → top %d (scores: %s)",
        len(scored_chunks),
        top_n,
        [round(c["rerank_score"], 1) for c in scored_chunks[:top_n]],
    )

    return scored_chunks[:top_n]
