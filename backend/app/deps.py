from typing import Optional
from fastapi import Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from .db import get_db
from .config import get_settings, Settings
from .auth_models import User
from .auth_service import verify_token, get_user_by_email

def settings_dep() -> Settings:
    return get_settings()

def db_dep(db: Session = Depends(get_db)) -> Session:
    return db

def get_token_from_header_or_query(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None)
) -> str:
    """Extract token from Authorization header or query parameter"""
    # Try Authorization header first (Bearer token)
    if authorization:
        if authorization.startswith("Bearer "):
            return authorization[7:]  # Remove "Bearer " prefix
        return authorization
    
    # Fall back to query parameter
    if token:
        return token
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing authentication token"
    )

def get_current_user(
    token: str = Depends(get_token_from_header_or_query),
    db: Session = Depends(db_dep)
) -> User:
    """Dependency to get current authenticated user from token"""
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
