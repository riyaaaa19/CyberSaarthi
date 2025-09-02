from sqlalchemy import Integer, String, DateTime, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .db import Base


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    scan_type: Mapped[str] = mapped_column(String(32), index=True)  # email|invoice
    input_hash: Mapped[str] = mapped_column(String(64), index=True)
    verdict: Mapped[str] = mapped_column(String(64))  # SAFE|SUSPICIOUS|MALICIOUS
    score: Mapped[float] = mapped_column(Float)       # store as number, easier for % formatting
    explanation: Mapped[list] = mapped_column(JSON)   # ✅ structured JSON list
    lang: Mapped[str] = mapped_column(String(8), default="en")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
