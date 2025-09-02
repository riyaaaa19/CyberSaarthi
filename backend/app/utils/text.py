import hashlib
import re
from typing import Iterable

URL_RE = re.compile(r"https?://[^\s\]\)\}>,]+", re.IGNORECASE)

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()

def find_urls(text: str) -> list[str]:
    return URL_RE.findall(text or "")

def normalize_text(text: str) -> str:
    """Normalize text for matching (lowercase, strip extra spaces)."""
    return re.sub(r"\s+", " ", (text or "").strip().lower())

def any_in(text: str, keywords: Iterable[str]) -> list[str]:
    """
    Returns a list of keywords that are found in the text (case-insensitive).
    If no keywords matched, returns an empty list.
    """
    t = normalize_text(text)
    matched = [k for k in keywords if k.lower() in t]
    return matched
