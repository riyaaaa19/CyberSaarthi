from pydantic import BaseModel, Field
from enum import Enum

class Verdict(str, Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    MALICIOUS = "MALICIOUS"


class EmailScanRequest(BaseModel):
    email_text: str = Field(..., min_length=10)
    lang: str = Field("en", description="Language code for message localization")


class InvoiceScanRequest(BaseModel):
    invoice_text: str = Field(..., min_length=10)
    lang: str = Field("en")


class ScanResponse(BaseModel):
    verdict: Verdict
    score: float
    explanation: dict  # { 'en': '...', 'hi': '...' }
    explanations: list[str] | None = None   # ✅ structured reasons
    lang: str = "en"


class HistoryItem(BaseModel):
    id: int
    scan_type: str
    verdict: Verdict
    score: float
    explanation: dict  # { 'en': '...', 'hi': '...' }
    created_at: str


class HistoryPage(BaseModel):
    items: list[HistoryItem]
    total: int
    limit: int
    offset: int
