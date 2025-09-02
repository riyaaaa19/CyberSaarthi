from fastapi import Header, HTTPException, status
from typing import Optional
from ..config import get_settings

settings = get_settings()

async def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
