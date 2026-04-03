from sqlalchemy import Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .db import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)  # User who performed the scan
    scan_type: Mapped[str] = mapped_column(String(32), index=True)  # email|invoice
    input_hash: Mapped[str] = mapped_column(String(64), index=True)
    input_text: Mapped[str] = mapped_column(Text)  # Store original email/invoice text
    verdict: Mapped[str] = mapped_column(String(64))  # SAFE|SUSPICIOUS|MALICIOUS
    score: Mapped[str] = mapped_column(String(32))    # e.g., "0.87"
    explanation: Mapped[str] = mapped_column(Text)  # Store as JSON string
    lang: Mapped[str] = mapped_column(String(8), default="en")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
