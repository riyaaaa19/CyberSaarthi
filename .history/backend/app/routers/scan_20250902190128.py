from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import hashlib, re

from backend.app.schemas import EmailScanRequest, InvoiceScanRequest, ScanResponse, Verdict
from backend.app.services.phishing import PhishingDetector, PhishingVerdict
from backend.app.services.invoice import evaluate_invoice, evaluate_invoice_file, InvoiceVerdict
from backend.app.utils.security import verify_api_key
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


def classify_malicious(email_text: str, explanations: list[str], score: float):
    malicious_extensions = [".exe", ".bat", ".scr", ".js", ".vbs"]
    suspicious_domains = ["secure-login", "malicious", "fake", "verify", "update"]

    # Attachment check
    attachments = re.findall(r"\b[\w\-_]+\.(\w+)\b", email_text)
    for att in attachments:
        ext = "." + att.lower()
        if ext in malicious_extensions:
            explanations.append(f"Malicious attachment detected: {ext}")
            return Verdict.MALICIOUS, 1.0, explanations

    # Suspicious URL check
    urls = re.findall(r"http[s]?://[^\s]+", email_text)
    for url in urls:
        if any(dom in url.lower() for dom in suspicious_domains):
            if score >= 0.5:
                explanations.append(f"High-risk URL detected: {url}")
                return Verdict.MALICIOUS, min(1.0, score + 0.3), explanations

    return None, score, explanations


@router.post("/email", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
def scan_email(payload: EmailScanRequest, settings: Settings = Depends(settings_dep), db: Session = Depends(db_dep)):
    import json
    detector = _get_detector(settings)
    # Predict in both languages
    result_en: PhishingVerdict = detector.predict(payload.email_text, lang="en")
    result_hi: PhishingVerdict = detector.predict(payload.email_text, lang="hi")

    # Apply extra malicious logic to both
    new_verdict_en, new_score_en, new_expl_en = classify_malicious(payload.email_text, result_en.explanations, result_en.score)
    if new_verdict_en:
        result_en.verdict = new_verdict_en
        result_en.score = new_score_en
        result_en.explanations = new_expl_en

    new_verdict_hi, new_score_hi, new_expl_hi = classify_malicious(payload.email_text, result_hi.explanations, result_hi.score)
    if new_verdict_hi:
        result_hi.verdict = new_verdict_hi
        result_hi.score = new_score_hi
        result_hi.explanations = new_expl_hi

    # Save in DB as JSON
    explanation_obj = {
        "en": "; ".join(result_en.explanations),
        "hi": "; ".join(result_hi.explanations)
    }
    record = ScanHistory(
        scan_type="email",
        input_hash=sha256(payload.email_text[:2048]),
        input_text=payload.email_text,
        verdict=result_en.verdict.value,
        score=f"{result_en.score:.3f}",
        explanation=json.dumps(explanation_obj),
        lang=payload.lang,
    )
    db.add(record)
    db.commit()

    # Return response in requested language
    return ScanResponse(
        verdict=result_en.verdict if payload.lang == "en" else result_hi.verdict,
        score=result_en.score if payload.lang == "en" else result_hi.score,
        explanation=explanation_obj,
        explanations=result_en.explanations if payload.lang == "en" else result_hi.explanations,
        lang=payload.lang,
    )


@router.post("/invoice", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
def scan_invoice(payload: InvoiceScanRequest, db: Session = Depends(db_dep)):
    import json
    result_en: InvoiceVerdict = evaluate_invoice(payload.invoice_text, lang="en")
    result_hi: InvoiceVerdict = evaluate_invoice(payload.invoice_text, lang="hi")

    explanation_obj = {
        "en": "; ".join(result_en.explanations),
        "hi": "; ".join(result_hi.explanations)
    }
    record = ScanHistory(
        scan_type="invoice",
        input_hash=sha256(payload.invoice_text[:2048]),
        input_text=payload.invoice_text,
        verdict=result_en.verdict.value,
        score=f"{result_en.score:.3f}",
        explanation=json.dumps(explanation_obj),
        lang=payload.lang,
    )
    db.add(record)
    db.commit()

    return ScanResponse(
        verdict=result_en.verdict if payload.lang == "en" else result_hi.verdict,
        score=result_en.score if payload.lang == "en" else result_hi.score,
        explanation=explanation_obj,
        explanations=result_en.explanations if payload.lang == "en" else result_hi.explanations,
        lang=payload.lang,
    )


@router.post("/invoice/upload", response_model=ScanResponse, dependencies=[Depends(verify_api_key)])
async def scan_invoice_file(file: UploadFile = File(...), db: Session = Depends(db_dep)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename")

    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")

    file_bytes = await file.read()

    import json
    try:
        result_en: InvoiceVerdict = evaluate_invoice_file(file_bytes, file.filename, lang="en")
        result_hi: InvoiceVerdict = evaluate_invoice_file(file_bytes, file.filename, lang="hi")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    input_hash = hashlib.sha256(file_bytes[:2048]).hexdigest()

    explanation_obj = {
        "en": "; ".join(result_en.explanations),
        "hi": "; ".join(result_hi.explanations)
    }
    record = ScanHistory(
        scan_type="invoice_file",
        input_hash=input_hash,
        input_text="[file upload]",  # Not storing file content, but can be improved
        verdict=result_en.verdict.value,
        score=f"{result_en.score:.3f}",
        explanation=json.dumps(explanation_obj),
        lang="en",
    )
    db.add(record)
    db.commit()

    return ScanResponse(
        verdict=result_en.verdict,
        score=result_en.score,
        explanation=explanation_obj,
        explanations=result_en.explanations,
        lang="en",
    )
