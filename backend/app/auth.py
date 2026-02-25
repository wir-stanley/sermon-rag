"""Authentication utilities — Clerk JWT verification via JWKS, user sync."""

import logging
from datetime import datetime, timezone
from typing import Optional

import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models import User, UserRole

logger = logging.getLogger(__name__)
settings = get_settings()
bearer_scheme = HTTPBearer()

# JWKS client caches keys automatically
_jwks_client: Optional[PyJWKClient] = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(settings.clerk_jwks_url)
    return _jwks_client


def _verify_clerk_token(token: str) -> dict:
    """Verify a Clerk JWT using JWKS (RS256) and return the decoded payload."""
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer,
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        logger.error(f"JWT Verification Failed: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")


async def _sync_clerk_user(payload: dict, db: AsyncSession) -> User:
    """Find or create a user from Clerk JWT claims.

    3-step sync:
    1. Find by clerk_id (existing Clerk user)
    2. Find by email and link clerk_id (migration from old auth)
    3. Create new user
    """
    clerk_id = payload["sub"]
    email = payload.get("email", payload.get("email_address", ""))
    name = payload.get("name", payload.get("full_name", email.split("@")[0] if email else "User"))
    avatar = payload.get("image_url", payload.get("picture"))

    # 1. Find by clerk_id
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if user is not None:
        # Update last_login
        user.last_login = datetime.utcnow()
        if name and user.name != name:
            user.name = name
        if avatar and user.avatar_url != avatar:
            user.avatar_url = avatar
        if email and user.email != email:
            user.email = email
        await db.commit()
        return user

    # 2. Find by email and link clerk_id (migration path)
    if email:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user is not None:
            user.clerk_id = clerk_id
            user.last_login = datetime.utcnow()
            if name:
                user.name = name
            if avatar:
                user.avatar_url = avatar
            await db.commit()
            logger.info("Linked clerk_id %s to existing user %s", clerk_id, email)
            return user

    # 3. Create new user
    user = User(
        email=email or f"{clerk_id}@clerk.user",
        name=name or "User",
        clerk_id=clerk_id,
        avatar_url=avatar,
        role=UserRole.MEMBER,
        last_login=datetime.utcnow(),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    logger.info("Created new user from Clerk: %s (%s)", email, clerk_id)
    return user


# --- FastAPI dependencies ---

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate user from Clerk Bearer token."""
    payload = _verify_clerk_token(credentials.credentials)
    user = await _sync_clerk_user(payload, db)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Like get_current_user but returns None instead of 401 when no token is present."""
    if credentials is None:
        return None
    try:
        payload = _verify_clerk_token(credentials.credentials)
        user = await _sync_clerk_user(payload, db)
        if not user.is_active:
            return None
        return user
    except HTTPException:
        return None


def require_admin(user: User = Depends(get_current_user)) -> User:
    """Dependency that rejects non-admin users."""
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
