"""Query rewriter — uses a fast LLM to reformulate vague or follow-up
questions into self-contained, search-optimised queries."""

import logging
from app.services.llm_provider import chat_completion
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


REWRITE_PROMPT = """You are a query rewriter for a sermon search engine.
Your job is to rewrite the user's question into a clear, self-contained search query 
optimised for semantic similarity search over sermon transcripts.

RULES:
1. Resolve any pronouns or references ("it", "that", "the same topic") using the conversation history.
2. Keep the query concise (1-2 sentences max).
3. Preserve the user's language (Indonesian or English).
4. If the question is already clear and self-contained, return it as-is.
5. Do NOT answer the question — only rewrite it.
6. Return ONLY the rewritten query, nothing else."""


def rewrite_query(
    question: str,
    chat_history: list[dict] | None = None,
) -> str:
    """Rewrite a user question into a search-optimised query.
    
    Uses the provider's mini model for speed (~200ms). Only rewrites if there
    is conversation history that might contain needed context.
    """
    # Skip rewriting if no history — the question is already self-contained
    if not chat_history:
        return question

    messages = [{"role": "system", "content": REWRITE_PROMPT}]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": f"Rewrite this search query: {question}"})

    try:
        rewritten = chat_completion(
            messages,
            temperature=0,
            max_tokens=200,
            use_mini=True,
        ).strip()
        
        if rewritten:
            logger.info("Query rewritten: '%s' → '%s'", question, rewritten)
            return rewritten
    except Exception as e:
        logger.warning("Query rewrite failed, using original: %s", e)

    return question
