MESSAGES = {
    "en": {
        "email.safe": "Email appears safe.",
        "email.susp": "Suspicious indicators found (possible phishing).",
        "email.mal": "High-risk indicators found (likely phishing).",
        "invoice.safe": "Invoice looks consistent.",
        "invoice.susp": "Suspicious invoice indicators found.",
        "invoice.mal": "Likely fraudulent invoice detected.",
    },
    "hi": {
        "email.safe": "ईमेल सुरक्षित प्रतीत होता है।",
        "email.susp": "संदिग्ध संकेत मिले (संभावित फ़िशिंग)।",
        "email.mal": "उच्च जोखिम संकेत (संभावित फ़िशिंग)।",
        "invoice.safe": "इनवॉइस सही लगता है।",
        "invoice.susp": "इनवॉइस में संदिग्ध संकेत मिले।",
        "invoice.mal": "संभावित धोखाधड़ी वाला इनवॉइस।",
    },
}

def msg(lang: str, key: str) -> str:
    return MESSAGES.get(lang, MESSAGES["en"]).get(key, key)
