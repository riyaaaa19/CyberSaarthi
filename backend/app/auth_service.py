import jwt  # type: ignore
import bcrypt  # type: ignore
from datetime import datetime, timedelta
from typing import cast
from sqlalchemy.orm import Session
from .auth_models import User
from .auth_schemas import UserCreate, UserResponse
from .config import get_settings

settings = get_settings()

# JWT Configuration
SECRET_KEY = settings.SECRET_KEY or "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 1


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def create_access_token(email: str) -> str:
    """Create a JWT access token"""
    payload = {
        "sub": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str) -> str | None:
    """Verify JWT token and return email if valid"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def create_user(db: Session, user: UserCreate) -> User | None:
    """Create a new user in the database"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return None
    
    # Hash password and create user
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate user with email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    
    if not verify_password(password, cast(str, user.password_hash)):
        return None
    
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()
