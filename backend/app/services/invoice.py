from __future__ import annotations
import re
from dataclasses import dataclass
import io

import pdfplumber
from docx import Document

from ..schemas import Verdict
from ..utils.i18n import msg, translate_explanation, MESSAGES

# Suspicious terms (English + Hindi)
SUSPICIOUS_INVOICE_TERMS = [
    "urgent", "immediately", "overdue", "wire transfer", "update bank details",
    "new account", "change of account", "penalty", "late fee", "pay now", "final notice",
    # Hindi equivalents
    "तुरंत भुगतान", "विलंब शुल्क", "अंतिम नोटिस", "नया खाता", "खाता बदलें"
]

# Regex patterns
AMOUNT_RE = re.compile(r"(?i)total\s*[:\-]?\s*(₹|INR)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+)")
ACC_NO_RE = re.compile(r"(?i)(?:account|a/c|ac)\s*(?:no\.?|number)?\s*[:\-]?\s*([0-9]{6,18})")
IFSC_RE   = re.compile(r"(?i)ifsc\s*[:\-]?\s*([A-Z]{4}0[0-9A-Z]{6})")
GST_RE    = re.compile(r"(?i)gst(?:in)?\s*[:\-]?\s*([0-9A-Z]{15})")
EMAIL_RE  = re.compile(r"(?i)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})")
COMPANY_RE = re.compile(r"(?i)(?:company|vendor|supplier|from)\s*[:\-]?\s*([A-Za-z\s&]+)")
LINE_ITEM_RE = re.compile(r"(?i)(\d+(?:\.\d{1,2})?)\s*x?\s*(\d+(?:\.\d{1,2})?)\s*=\s*(\d+(?:\.\d{1,2})?)")
DESCRIPTION_RE = re.compile(r"(?i)(?:description|item)\s*[:\-]?\s*([A-Za-z\s]+)")


@dataclass
class InvoiceVerdict:
    verdict: Verdict
    score: float
    explanations: list[str]
    explanation: str


def _extract_basic_fields(text: str) -> dict:
    amt = AMOUNT_RE.search(text)
    acc = ACC_NO_RE.search(text)
    ifsc = IFSC_RE.search(text)
    gst = GST_RE.search(text)
    email = EMAIL_RE.search(text)
    company = COMPANY_RE.search(text)
    line_items = LINE_ITEM_RE.findall(text)
    descriptions = DESCRIPTION_RE.findall(text)
    return {
        "amount": amt.group(2) if amt else None,
        "account_number": acc.group(1) if acc else None,
        "ifsc": ifsc.group(1) if ifsc else None,
        "gstin": gst.group(1) if gst else None,
        "email": email.group(1) if email else None,
        "company": company.group(1).strip() if company else None,
        "line_items": line_items,  # list of (qty, price, total)
        "descriptions": descriptions,
    }


def _check_total_consistency(fields: dict, text: str) -> tuple[float, list[str]]:
    risk = 0.0
    reasons = []
    if fields["line_items"]:
        calculated_total = 0.0
        for qty, price, item_total in fields["line_items"]:
            try:
                qty = float(qty)
                price = float(price)
                item_total = float(item_total)
                if abs(qty * price - item_total) > 0.01:  # small mismatch
                    risk += 0.1
                    reasons.append("Line item calculation mismatch")
                calculated_total += item_total
            except ValueError:
                risk += 0.05
                reasons.append("Invalid line item format")
        if fields["amount"]:
            try:
                stated_total = float(fields["amount"].replace(",", ""))
                if abs(calculated_total - stated_total) > 0.01:
                    risk += 0.2
                    reasons.append("Calculated total does not match stated total")
            except ValueError:
                risk += 0.1
                reasons.append("Invalid total amount format")
    return risk, reasons


def _check_company_consistency(fields: dict, text: str) -> tuple[float, list[str]]:
    risk = 0.0
    reasons = []
    company = fields.get("company", "").lower()
    email = fields.get("email", "").lower()
    if company and email:
        # Check if email domain relates to company name
        domain = email.split("@")[-1].split(".")[0]
        if domain not in company and company not in domain:
            risk += 0.15
            reasons.append("Email domain does not align with company name")
    if fields["gstin"] and company:
        # GSTIN should start with state code, but for simplicity, check if company name is mentioned near GSTIN
        gst_context = text.lower().find(fields["gstin"].lower())
        if gst_context != -1 and company not in text[gst_context-50:gst_context+50].lower():
            risk += 0.1
            reasons.append("GSTIN not associated with company name")
    return risk, reasons


def _check_payment_details(fields: dict, text: str) -> tuple[float, list[str]]:
    risk = 0.0
    reasons = []
    if fields["account_number"] and not fields["gstin"]:
        risk += 0.2
        reasons.append("Bank details present without GSTIN reference")
    if fields["ifsc"] and fields["account_number"]:
        # Check if IFSC and account seem consistent (basic check)
        if len(fields["account_number"]) < 10:
            risk += 0.1
            reasons.append("Account number unusually short")
    return risk, reasons


def _check_anomalies(fields: dict, text: str) -> tuple[float, list[str]]:
    risk = 0.0
    reasons = []
    descriptions = fields.get("descriptions", [])
    generic_terms = ["service", "item", "product", "fee", "charge"]
    for desc in descriptions:
        if any(term in desc.lower() for term in generic_terms) and len(desc.split()) < 3:
            risk += 0.05
            reasons.append("Vague or generic item description")
    # Check for slight identity differences (e.g., company name variations)
    company = fields.get("company", "")
    if company:
        variations = [company.replace(" ", ""), company.replace("&", "and")]
        for var in variations:
            if var.lower() != company.lower() and var in text.lower():
                risk += 0.1
                reasons.append("Slight company name variations detected")
    return risk, reasons


def evaluate_invoice(text: str, lang: str = "en") -> InvoiceVerdict:
    fields = _extract_basic_fields(text)
    reasons: list[str] = []
    risk = 0.0

    lower = (text or "").lower()

    # Existing checks
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

    # New deep analysis checks
    total_risk, total_reasons = _check_total_consistency(fields, text)
    risk += total_risk
    reasons.extend(total_reasons)

    company_risk, company_reasons = _check_company_consistency(fields, text)
    risk += company_risk
    reasons.extend(company_reasons)

    payment_risk, payment_reasons = _check_payment_details(fields, text)
    risk += payment_risk
    reasons.extend(payment_reasons)

    anomaly_risk, anomaly_reasons = _check_anomalies(fields, text)
    risk += anomaly_risk
    reasons.extend(anomaly_reasons)

    risk = min(1.0, risk)

    if risk >= 0.7:
        verdict = Verdict.MALICIOUS
        explanations = [msg(lang, "invoice.mal")]
    elif risk >= 0.45:
        verdict = Verdict.SUSPICIOUS
        explanations = [msg(lang, "invoice.susp")]
    else:
        verdict = Verdict.SAFE
        explanations = [msg(lang, "invoice.safe")]

    explanations.extend(reasons)

    explanation = " | ".join(explanations)
    explanation = translate_explanation(lang, explanation)

    return InvoiceVerdict(
        verdict=verdict,
        score=round(risk, 3),
        explanations=explanations,
        explanation=explanation,
    )


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
