import hashlib
import re
from typing import Iterable

URL_RE = re.compile(r"https?://[^\s]+", re.IGNORECASE)

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()

def find_urls(text: str) -> list[str]:
    return URL_RE.findall(text or "")

def any_in(text: str, keywords: Iterable[str]) -> bool:
    t = (text or "").lower()
    return any(k.lower() in t for k in keywords)
