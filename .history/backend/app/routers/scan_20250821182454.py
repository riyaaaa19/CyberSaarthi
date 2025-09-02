# backend/app/routers/scan.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import hashlib, re

from backend.app.schemas import EmailScanRequest, InvoiceScanRequest, ScanResponse, Verdict
from backend.app.services.phishing import PhishingDetector, PhishingVerdict
from backend.app.services.invoice import evaluate_invoice, evaluate_invoice_file, InvoiceVerdict
from backend.app.utils.security import verify_api_key
from backend.app.utils.i18n import msg
from backend.app.utils.text import sha256
from backend.app.models import ScanHistory
from backend.app.deps import settings_dep, db_dep
from backend.app.config import Settings

router = APIRouter(prefix="/scan", tags=["scan"])

_detector: PhishingDetector | None = None

def _get_detector(settings: Settings) -> PhishingDetector:
    global _detector
    if _detector is None:
        _detector = PhishingDetector(
            model_path=settings.PHISHING_MODEL_PATH,
            blocklist_path=settings.BLOCKLIST_PATH,
        )
    return _detector


# --- Extra malicious pattern checks ---
def classify_malicious(email_text: str, explanation: str, score: float):
    malicious_extensions = [".exe", ".bat", ".scr", ".js", ".vbs"]
    suspicious_domains = ["secure-login", "malicious", "fake", "verify", "update"]

    # Check attachments
    attachments = re.findall(r"\b[\w\-_]+\.(\w+)\b", email_text)
    for att in attachments:
        ext = "." + att.lower()
        if ext in malicious_extensions:
            explanation += f" | Malicious attachment detected: {ext}"
            return Verdict.MALICIOUS, 1.0, explanation

    # Check suspicious URLs
    urls = re.findall(r"http[s]?://[^\s]+", email_text)
    for url in urls:
        if any(dom in url.lower() for dom in suspicious_domains):
            if score >= 0.5:  # strong enough + bad domain
                explanation += f" | High-risk URL detected: {url}"
                return Verdict.MALICIOUS, min(1.0, score + 0.3), explanation

    return None, score, explanation


@router.post("/email", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
def scan_email(
    payload: EmailScanRequest,
    settings: Settings = Depends(settings_dep),
    db: Session = Depends(db_dep),
):
    detector = _get_detector(settings)
    result: PhishingVerdict = detector.predict(payload.email_text)

    # Apply malicious classification logic
    new_verdict, new_score, new_expl = classify_malicious(
        payload.email_text, result.explanation, result.score
    )

    if new_verdict:
        result.verdict = new_verdict
        result.score = new_score
        result.explanation = new_expl

    key = {
        Verdict.SAFE: "email.safe",
        Verdict.SUSPICIOUS: "email.susp",
        Verdict.MALICIOUS: "email.mal",
    }[result.verdict]

    explanation = f"{msg(payload.lang, key)} | {result.explanation}"

    record = ScanHistory(
        scan_type="email",
        input_hash=sha256(payload.email_text[:2048]),
        verdict=result.verdict.value,
        score=f"{result.score:.3f}",
        explanation=explanation,
        lang=payload.lang,
    )
    db.add(record)
    db.commit()

    return ScanResponse(
        verdict=result.verdict,
        score=result.score,
        explanation=explanation,
        lang=payload.lang,
    )


@router.post("/invoice", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
def scan_invoice(payload: InvoiceScanRequest, db: Session = Depends(db_dep)):
    result: InvoiceVerdict = evaluate_invoice(payload.invoice_text)

    key = {
        Verdict.SAFE: "invoice.safe",
        Verdict.SUSPICIOUS: "invoice.susp",
        Verdict.MALICIOUS: "invoice.mal",
    }[result.verdict]

    explanation = f"{msg(payload.lang, key)} | {result.explanation}"

    record = ScanHistory(
        scan_type="invoice",
        input_hash=sha256(payload.invoice_text[:2048]),
        verdict=result.verdict.value,
        score=f"{result.score:.3f}",
        explanation=explanation,
        lang=payload.lang,
    )
    db.add(record)
    db.commit()

    return ScanResponse(
        verdict=result.verdict,
        score=result.score,
        explanation=explanation,
        lang=payload.lang,
    )


@router.post("/invoice/upload", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
async def scan_invoice_file(
    file: UploadFile = File(...),
    db: Session = Depends(db_dep),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename")

    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")

    file_bytes = await file.read()

    try:
        result: InvoiceVerdict = evaluate_invoice_file(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    explanation = f"{msg('en', 'invoice.' + result.verdict.value.lower())} | {result.explanation}"

    # Hash raw bytes for uploaded files
    input_hash = hashlib.sha256(file_bytes[:2048]).hexdigest()

    record = ScanHistory(
        scan_type="invoice_file",
        input_hash=input_hash,
        verdict=result.verdict.value,
        score=f"{result.score:.3f}",
        explanation=explanation,
        lang="en",
    )
    db.add(record)
    db.commit()

    return ScanResponse(
        verdict=result.verdict,
        score=result.score,
        explanation=explanation,
        lang="en",
    )
