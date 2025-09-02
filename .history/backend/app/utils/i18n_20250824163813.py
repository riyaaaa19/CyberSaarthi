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

        # Invoice reason details
        "invoice.reason.missingTotal": "Missing explicit total amount",
        "invoice.reason.accountNumber": "Account number present but vendor context unclear",
        "invoice.reason.bankDetails": "Bank details without GSTIN reference",
        "invoice.reason.urgencyTerms": "Contains suspicious financial urgency terms",
        "invoice.reason.uppercase": "Unusually high uppercase ratio",

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

        # Invoice reason details
        "invoice.reason.missingTotal": "कुल राशि स्पष्ट रूप से अनुपस्थित है",
        "invoice.reason.accountNumber": "खाता संख्या मौजूद है लेकिन विक्रेता संदर्भ अस्पष्ट है",
        "invoice.reason.bankDetails": "बैंक विवरण बिना जीएसटीआईएन संदर्भ के",
        "invoice.reason.urgencyTerms": "संदिग्ध वित्तीय आपातकालीन शब्द शामिल हैं",
        "invoice.reason.uppercase": "असामान्य रूप से अधिक अपरकेस अनुपात",

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
    """
    # Technical keywords
    explanation = ci_replace(explanation, r"ML score", msg(lang, "explanation.mlScore"))
    explanation = ci_replace(
        explanation, r"Suspicious domain", msg(lang, "explanation.suspiciousDomain")
    )
    return explanation
