from pydantic import BaseModel, Field
from enum import Enum
from typing import List


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
    explanation: List[str]   # ✅ list instead of single string
    lang: str = "en"


class HistoryItem(BaseModel):
    id: int
    scan_type: str
    verdict: Verdict
    score: float
    explanation: List[str]   # ✅ now a list too
    created_at: str


class HistoryPage(BaseModel):
    items: List[HistoryItem]
    total: int
    limit: int
    offset: int
