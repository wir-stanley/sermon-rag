"""Auth API router — user profile endpoint (Clerk handles authentication)."""

from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models import User
from app.schemas import UserInfo

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.get("/me", response_model=UserInfo)
async def me(user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return UserInfo.model_validate(user)
