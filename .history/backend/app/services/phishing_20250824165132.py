from __future__ import annotations
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

import tldextract
import idna

from backend.app.config import get_settings
from backend.app.utils.text import find_urls, any_in
from backend.app.schemas import Verdict
from backend.app.utils.i18n import translate_explanation, msg   # ✅ Import translations

logger = logging.getLogger(__name__)
settings = get_settings()

# Expanded phishing term list
SUSPICIOUS_TERMS = [
    "verify your account", "password", "click here", "login immediately",
    "reset", "bank account", "one time password", "otp", "urgent", "limited time",
    "confirm details", "win prize", "lottery", "invoice attached",
    "account suspended", "download the attached file", "wire transfer", "payment required",
    "final notice", "immediate action", "permanent deletion", "account locked",
    "recover your account", "failure to act", "irreversible loss"
]

DEFAULT_BLOCKLIST = {"bit.ly", "tinyurl.com", "grabify.link", "goo.gl"}


@dataclass
class PhishingVerdict:
    verdict: Verdict
    score: float
    explanation: str


class PhishingDetector:
    def __init__(self, model_path: str, blocklist_path: str | None = None) -> None:
        self.model_path = Path(model_path)
        self.blocklist = set(DEFAULT_BLOCKLIST)
        if blocklist_path and Path(blocklist_path).exists():
            try:
                self.blocklist |= {
                    line.strip().lower()
                    for line in Path(blocklist_path).read_text().splitlines()
                    if line.strip()
                }
            except Exception as e:
                logger.warning("Failed to load blocklist: %s", e)
        self.pipeline: Pipeline | None = None
        self._ensure_model()

    def _ensure_model(self) -> None:
        if self.model_path.exists():
            try:
                self.pipeline = joblib.load(self.model_path)
                logger.info("Loaded phishing model from %s", self.model_path)
                return
            except Exception as e:
                logger.warning("Failed to load model (%s), retraining", e)
        self.pipeline = self._train_minimal_model()
        try:
            self.model_path.parent.mkdir(parents=True, exist_ok=True)
            joblib.dump(self.pipeline, self.model_path)
            logger.info("Saved phishing model to %s", self.model_path)
        except Exception as e:
            logger.warning("Could not persist model: %s", e)

    def _train_minimal_model(self) -> Pipeline:
        X = [
            "Your account password will expire, click here to verify now",
            "Urgent: confirm your bank account details to avoid suspension",
            "Lottery winner! claim prize by clicking this link",
            "Invoice attached for your recent purchase #12345",
            "Monthly newsletter: updates from our company and blog",
            "Meeting schedule attached for next week",
            "Your receipt and invoice for order 98765",
            "Security alert: unusual sign-in attempt detected"
        ]
        y = [1, 1, 1, 0, 0, 0, 0, 1]  # 1 = phishing/suspicious, 0 = legit

        pipe = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=300)),
        ])
        pipe.fit(X, y)
        return pipe

    @staticmethod
    def _is_punycode(domain: str) -> bool:
        try:
            idna.decode(domain)
            return False
        except idna.IDNAError:
            return True

    @staticmethod
    def _domain_from_url(url: str) -> str:
        ext = tldextract.extract(url)
        domain = ".".join(p for p in [ext.domain, ext.suffix] if p)
        return domain.lower()

    def _score_urls(self, text: str, lang: str) -> Tuple[float, list[str]]:
        urls = find_urls(text)
        reasons: list[str] = []
        risk = 0.0
        for u in urls:
            d = self._domain_from_url(u)
            if d in self.blocklist:
                risk += 0.6
                reasons.append(f"{msg(lang, 'phishing.reason.blocklist')}: {d}")
            else:
                risk += 0.4
                reasons.append(f"{msg(lang, 'phishing.reason.suspiciousDomain')}: {d}")

            # Suspicious patterns
            if any(c.isdigit() for c in d) and any(c.isalpha() for c in d) and sum(c == '-' for c in d) >= 2:
                risk += 0.25
                reasons.append(f"{msg(lang, 'phishing.reason.domainPattern')}: {d}")
            # Punycode
            if self._is_punycode(d):
                risk += 0.2
                reasons.append(f"{msg(lang, 'phishing.reason.punycode')}: {d}")
        return min(risk, 1.0), reasons

    def _score_text(self, text: str, lang: str) -> Tuple[float, list[str]]:
        reasons: list[str] = []
        risk = 0.0
        count_terms = sum(1 for term in SUSPICIOUS_TERMS if term in text.lower())
        if count_terms > 0:
            reasons.append(f"{msg(lang, 'phishing.reason.phishingTerms')} ({count_terms} matches)")
            risk += 0.55
        if sum(1 for c in text if c.isupper()) / max(1, len(text)) > 0.2:
            reasons.append(msg(lang, "phishing.reason.uppercase"))
            risk += 0.2
        return min(risk, 1.0), reasons

    def _score_ml(self, text: str) -> float:
        assert self.pipeline is not None
        proba = self.pipeline.predict_proba([text])[0][1]
        return float(proba)

    def predict(self, text: str, lang: str = "en") -> PhishingVerdict:
        """
        Predict phishing likelihood and return a localized verdict + explanation.
        """
        ml_score = self._score_ml(text)
        url_score, url_reasons = self._score_urls(text, lang)
        txt_score, txt_reasons = self._score_text(text, lang)

        score = 0.45 * ml_score + 0.35 * url_score + 0.2 * txt_score
        explanation_parts = [f"ML score={ml_score:.2f}"] + url_reasons + txt_reasons
        explanation = "; ".join(explanation_parts)

        # Pick verdict
        if score >= 0.7:
            verdict = Verdict.MALICIOUS
            explanation = msg(lang, "email.mal") + " | " + explanation
        elif score >= 0.45:
            verdict = Verdict.SUSPICIOUS
            explanation = msg(lang, "email.susp") + " | " + explanation
        else:
            verdict = Verdict.SAFE
            explanation = msg(lang, "email.safe") + " | " + explanation

        # Translate technical explanation keywords (but keep domains/numbers intact)
        explanation = translate_explanation(lang, explanation)

        return PhishingVerdict(
            verdict=verdict,
            score=round(score, 3),
            explanation=explanation,
        )
