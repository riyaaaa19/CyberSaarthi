from __future__ import annotations
import re
from dataclasses import dataclass
import io

import pdfplumber
from docx import Document

from backend.app.schemas import Verdict
from backend.app.utils.i18n import msg, translate_explanation

SUSPICIOUS_INVOICE_TERMS = [
    "urgent", "immediately", "overdue", "wire transfer", "update bank details",
    "new account", "change of account", "penalty", "late fee", "pay now", "final notice",
    "तुरंत भुगतान", "विलंब शुल्क", "अंतिम नोटिस", "नया खाता", "खाता बदलें"
]

AMOUNT_RE = re.compile(r"(?i)total\s*[:\-]?\s*(₹|INR)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+)")
ACC_NO_RE = re.compile(r"(?i)(?:account|a/c|ac)\s*(?:no\.?|number)?\s*[:\-]?\s*([0-9]{6,18})")
IFSC_RE   = re.compile(r"(?i)ifsc\s*[:\-]?\s*([A-Z]{4}0[0-9A-Z]{6})")
GST_RE    = re.compile(r"(?i)gst(?:in)?\s*[:\-]?\s*([0-9A-Z]{15})")


@dataclass
class InvoiceVerdict:
    verdict: Verdict
    score: float
    explanations: list[str]   # 👈 structured


def _extract_basic_fields(text: str) -> dict:
    amt = AMOUNT_RE.search(text)
    acc = ACC_NO_RE.search(text)
    ifsc = IFSC_RE.search(text)
    gst = GST_RE.search(text)
    return {
        "amount": amt.group(2) if amt else None,
        "account_number": acc.group(1) if acc else None,
        "ifsc": ifsc.group(1) if ifsc else None,
        "gstin": gst.group(1) if gst else None,
    }


def evaluate_invoice(text: str, lang: str = "en") -> InvoiceVerdict:
    fields = _extract_basic_fields(text)
    reasons: list[str] = []
    risk = 0.0
    lower = (text or "").lower()

    if any(term in lower for term in SUSPICIOUS_INVOICE_TERMS):
        reasons.append(msg(lang, "invoice.reason.urgencyTerms"))
        risk += 0.4

    if fields["account_number"] and "vendor" not in lower:
        reasons.append(msg(lang, "invoice.reason.accountNumber"))
        risk += 0.25

    if fields["ifsc"] and not fields["gstin"]:
        reasons.append(msg(lang, "invoice.reason.bankDetails"))
        risk += 0.2

    if not fields["amount"]:
        reasons.append(msg(lang, "invoice.reason.missingTotal"))
        risk += 0.15

    if sum(1 for c in text if c.isupper()) / max(1, len(text)) > 0.25:
        reasons.append(msg(lang, "invoice.reason.uppercase"))
        risk += 0.1

    risk = min(1.0, risk)

    if risk >= 0.7:
        verdict = Verdict.MALICIOUS
        base_msg = msg(lang, "invoice.mal")
    elif risk >= 0.45:
        verdict = Verdict.SUSPICIOUS
        base_msg = msg(lang, "invoice.susp")
    else:
        verdict = Verdict.SAFE
        base_msg = msg(lang, "invoice.safe")

    explanations = [base_msg] + reasons
    explanations = [translate_explanation(lang, e) for e in explanations]

    return InvoiceVerdict(verdict=verdict, score=round(risk, 3), explanations=explanations)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    doc = Document(io.BytesIO(file_bytes))
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def evaluate_invoice_file(file_bytes: bytes, filename: str, lang: str = "en") -> InvoiceVerdict:
    if filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith(".docx"):
        text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX allowed.")

    if not text.strip():
        raise ValueError("Could not extract any text from the file.")

    return evaluate_invoice(text, lang=lang)
