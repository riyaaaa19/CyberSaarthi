import re

MESSAGES = {
    "en": {
        # Email explanations
        "email.safe": "Email appears safe.",
        "email.susp": "Suspicious indicators found (possible phishing).",
        "email.mal": "High-risk indicators found (likely phishing).",

        # Invoice explanations
        "invoice.safe": "Invoice looks consistent.",
        "invoice.susp": "Suspicious invoice indicators found.",
        "invoice.mal": "Likely fraudulent invoice detected.",

        # Technical explanation keywords
        "explanation.mlScore": "ML score",
        "explanation.suspiciousDomain": "Suspicious domain",
    },
    "hi": {
        # Email explanations
        "email.safe": "ईमेल सुरक्षित प्रतीत होता है।",
        "email.susp": "संदिग्ध संकेत मिले (संभावित फ़िशिंग)।",
        "email.mal": "उच्च जोखिम संकेत (संभावित फ़िशिंग)।",

        # Invoice explanations
        "invoice.safe": "इनवॉइस सही लगता है।",
        "invoice.susp": "इनवॉइस में संदिग्ध संकेत मिले।",
        "invoice.mal": "संभावित धोखाधड़ी वाला इनवॉइस।",

        # Technical explanation keywords
        "explanation.mlScore": "एमएल स्कोर",
        "explanation.suspiciousDomain": "संदिग्ध डोमेन",
    },
}


def msg(lang: str, key: str) -> str:
    return MESSAGES.get(lang, MESSAGES["en"]).get(key, key)


def ci_replace(text: str, pattern: str, replacement: str) -> str:
    """Case-insensitive replacement"""
    return re.sub(pattern, replacement, text, flags=re.IGNORECASE)


def translate_explanation(lang: str, explanation: str) -> str:
    """
    Replaces English keywords with localized equivalents,
    keeps domain names and numbers unchanged.
    Case-insensitive matching.
    """
    explanation = ci_replace(explanation, r"Email appears safe\.", msg(lang, "email.safe"))
    explanation = ci_replace(
        explanation, r"Suspicious indicators found \(possible phishing\)\.", msg(lang, "email.susp")
    )
    explanation = ci_replace(
        explanation, r"High-risk indicators found \(likely phishing\)\.", msg(lang, "email.mal")
    )

    explanation = ci_replace(explanation, r"Invoice looks consistent\.", msg(lang, "invoice.safe"))
    explanation = ci_replace(
        explanation, r"Suspicious invoice indicators found\.", msg(lang, "invoice.susp")
    )
    explanation = ci_replace(
        explanation, r"Likely fraudulent invoice detected\.", msg(lang, "invoice.mal")
    )

    # Technical keywords
    explanation = ci_replace(explanation, r"ML score", msg(lang, "explanation.mlScore"))
    explanation = ci_replace(
        explanation, r"Suspicious domain", msg(lang, "explanation.suspiciousDomain")
    )

    return explanation
