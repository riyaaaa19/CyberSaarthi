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


def translate_explanation(lang: str, explanation: str) -> str:
    """
    Replaces English keywords with localized equivalents,
    keeps domain names and numbers unchanged.
    """
    explanation = explanation.replace(
        "Email appears safe.", msg(lang, "email.safe")
    )
    explanation = explanation.replace(
        "Suspicious indicators found (possible phishing).", msg(lang, "email.susp")
    )
    explanation = explanation.replace(
        "High-risk indicators found (likely phishing).", msg(lang, "email.mal")
    )

    explanation = explanation.replace(
        "Invoice looks consistent.", msg(lang, "invoice.safe")
    )
    explanation = explanation.replace(
        "Suspicious invoice indicators found.", msg(lang, "invoice.susp")
    )
    explanation = explanation.replace(
        "Likely fraudulent invoice detected.", msg(lang, "invoice.mal")
    )

    # Technical keywords
    explanation = explanation.replace("ML score", msg(lang, "explanation.mlScore"))
    explanation = explanation.replace(
        "Suspicious domain", msg(lang, "explanation.suspiciousDomain")
    )

    return explanation
