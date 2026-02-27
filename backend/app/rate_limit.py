"""Rate limiting middleware using slowapi.

Provides per-user and per-IP rate limiting for API endpoints.
Authenticated users get higher limits; anonymous users get lower limits.
"""

import logging
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

logger = logging.getLogger(__name__)


def _get_rate_limit_key(request: Request) -> str:
    """Use user's clerk_id from JWT if available, otherwise fall back to IP."""
    # Check if user was injected by auth dependency
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer ") and len(auth_header) > 20:
        # Use a hash of the token as the key (stable per-user)
        import hashlib
        token_hash = hashlib.sha256(auth_header.encode()).hexdigest()[:16]
        return f"user:{token_hash}"
    return f"ip:{get_remote_address(request)}"


# Create the limiter instance
limiter = Limiter(
    key_func=_get_rate_limit_key,
    default_limits=["200/hour"],  # Global default
    storage_uri="memory://",      # In-memory storage (resets on restart)
)

# --- Rate limit strings ---
# Authenticated users: generous limits
CHAT_LIMIT_AUTH = "30/minute;200/hour;500/day"
# Anonymous users: restrictive
CHAT_LIMIT_ANON = "5/minute;30/hour;100/day"
# Streaming endpoint (same concept)
STREAM_LIMIT_AUTH = "30/minute;200/hour;500/day"
STREAM_LIMIT_ANON = "5/minute;30/hour;100/day"
# Feedback (light endpoint)
FEEDBACK_LIMIT = "60/minute"
# History (read-only)
HISTORY_LIMIT = "120/minute"
