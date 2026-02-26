"""Unified LLM provider — abstracts OpenAI, Anthropic (Claude), and Google (Gemini)
behind a single interface for chat completions and streaming."""

import logging
from typing import Generator
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


# ─── Provider-specific model mappings for mini/lightweight tasks ───
MINI_MODELS = {
    "openai": "gpt-4o-mini",
    "anthropic": "claude-haiku-4-5",
    "google": "gemini-2.5-flash",
}


def _get_mini_model() -> str:
    """Return the lightweight model for the current provider."""
    return MINI_MODELS.get(settings.llm_provider, settings.llm_mini_model)


# ─────────────────────────────────────────────
# OpenAI
# ─────────────────────────────────────────────
_openai_client = None

def _get_openai():
    global _openai_client
    if _openai_client is None:
        from openai import OpenAI
        _openai_client = OpenAI(api_key=settings.openai_api_key)
    return _openai_client


def _openai_chat(messages: list[dict], model: str | None = None,
                 temperature: float | None = None, max_tokens: int | None = None,
                 stream: bool = False):
    client = _get_openai()
    model = model or settings.llm_model
    temperature = temperature if temperature is not None else settings.llm_temperature
    max_tokens = max_tokens or settings.llm_max_tokens

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_completion_tokens=max_tokens,
        stream=stream,
    )
    if stream:
        return response  # Returns iterator
    return response.choices[0].message.content


def _openai_stream_tokens(stream) -> Generator[str, None, None]:
    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


# ─────────────────────────────────────────────
# Anthropic (Claude)
# ─────────────────────────────────────────────
_anthropic_client = None

def _get_anthropic():
    global _anthropic_client
    if _anthropic_client is None:
        import anthropic
        _anthropic_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _anthropic_client


def _anthropic_chat(messages: list[dict], model: str | None = None,
                    temperature: float | None = None, max_tokens: int | None = None,
                    stream: bool = False):
    client = _get_anthropic()
    model = model or settings.llm_model
    temperature = temperature if temperature is not None else settings.llm_temperature
    max_tokens = max_tokens or settings.llm_max_tokens

    # Anthropic separates system from messages
    system_msg = ""
    chat_messages = []
    for msg in messages:
        if msg["role"] == "system":
            system_msg = msg["content"]
        else:
            chat_messages.append(msg)

    kwargs = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "messages": chat_messages,
    }
    if system_msg:
        kwargs["system"] = system_msg

    if stream:
        return client.messages.stream(**kwargs)
    
    response = client.messages.create(**kwargs)
    return response.content[0].text


def _anthropic_stream_tokens(stream) -> Generator[str, None, None]:
    with stream as s:
        for text in s.text_stream:
            yield text


# ─────────────────────────────────────────────
# Google (Gemini)
# ─────────────────────────────────────────────
_google_client = None

def _get_google():
    global _google_client
    if _google_client is None:
        from google import genai
        _google_client = genai.Client(api_key=settings.google_api_key)
    return _google_client


def _google_chat(messages: list[dict], model: str | None = None,
                 temperature: float | None = None, max_tokens: int | None = None,
                 stream: bool = False):
    client = _get_google()
    from google.genai import types
    model = model or settings.llm_model
    temperature = temperature if temperature is not None else settings.llm_temperature
    max_tokens = max_tokens or settings.llm_max_tokens

    # Convert OpenAI message format → Gemini format
    system_instruction = ""
    contents = []
    for msg in messages:
        if msg["role"] == "system":
            system_instruction = msg["content"]
        elif msg["role"] == "user":
            contents.append(types.Content(role="user", parts=[types.Part(text=msg["content"])]))
        elif msg["role"] == "assistant":
            contents.append(types.Content(role="model", parts=[types.Part(text=msg["content"])]))

    # Configure safety settings to avoid blocking innocuous religious queries
    safety_settings = [
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold=types.HarmBlockThreshold.BLOCK_NONE,
        ),
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold=types.HarmBlockThreshold.BLOCK_NONE,
        ),
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold=types.HarmBlockThreshold.BLOCK_NONE,
        ),
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold=types.HarmBlockThreshold.BLOCK_NONE,
        ),
    ]

    config = types.GenerateContentConfig(
        temperature=temperature,
        max_output_tokens=max_tokens,
        safety_settings=safety_settings,
    )
    if system_instruction:
        config.system_instruction = system_instruction

    if stream:
        return client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=config,
        )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=config,
    )
    return response.text


def _google_stream_tokens(stream) -> Generator[str, None, None]:
    for chunk in stream:
        if chunk.text:
            yield chunk.text

        # If the model abruptly finishes for a reason other than STOP or MAX_TOKENS, yield the error
        if chunk.candidates and chunk.candidates[0].finish_reason:
            reason = chunk.candidates[0].finish_reason
            if reason not in ("STOP", "MAX_TOKENS", 1, 2):  # 1 is STOP, 2 is MAX_TOKENS in some enum versions
                yield f"\n\n[Warning: Gemini stopped generating due to: {reason}]"


# ─────────────────────────────────────────────
# Unified Interface
# ─────────────────────────────────────────────

def chat_completion(
    messages: list[dict],
    model: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
    use_mini: bool = False,
) -> str:
    """Send a chat completion request to the configured LLM provider.
    
    Args:
        messages: OpenAI-format messages [{role, content}, ...]
        model: Override the model (otherwise uses config)
        temperature: Override temperature
        max_tokens: Override max tokens
        use_mini: Use the lightweight model for the provider (for rewriting/reranking)
    
    Returns:
        The assistant's response text.
    """
    if use_mini:
        model = _get_mini_model()

    provider = settings.llm_provider
    
    if provider == "openai":
        return _openai_chat(messages, model, temperature, max_tokens)
    elif provider == "anthropic":
        return _anthropic_chat(messages, model, temperature, max_tokens)
    elif provider == "google":
        return _google_chat(messages, model, temperature, max_tokens)
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")


def chat_completion_stream(
    messages: list[dict],
    model: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> Generator[str, None, None]:
    """Stream chat completion tokens from the configured provider.
    
    Yields individual text tokens as they arrive.
    """
    provider = settings.llm_provider

    if provider == "openai":
        stream = _openai_chat(messages, model, temperature, max_tokens, stream=True)
        yield from _openai_stream_tokens(stream)
    elif provider == "anthropic":
        stream = _anthropic_chat(messages, model, temperature, max_tokens, stream=True)
        yield from _anthropic_stream_tokens(stream)
    elif provider == "google":
        stream = _google_chat(messages, model, temperature, max_tokens, stream=True)
        yield from _google_stream_tokens(stream)
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
