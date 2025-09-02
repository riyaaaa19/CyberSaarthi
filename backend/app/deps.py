from fastapi import Depends
from sqlalchemy.orm import Session
from .db import get_db
from .config import get_settings, Settings

def settings_dep() -> Settings:
    return get_settings()

def db_dep(db: Session = Depends(get_db)) -> Session:
    return db
