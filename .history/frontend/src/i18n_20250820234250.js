const MESSAGES = {
  en: {
    "app.title": "CyberSaarthi",
    "email.safe": "Email appears safe.",
    "email.susp": "Suspicious indicators found (possible phishing).",
    "email.mal": "High-risk indicators found (likely phishing).",
    "invoice.safe": "Invoice looks consistent.",
    "invoice.susp": "Suspicious invoice indicators found.",
    "invoice.mal": "Likely fraudulent invoice detected.",
    "settings.title": "Settings",
    "settings.apiBase": "API Base URL",
    "settings.apiKey": "API Key (x-api-key header)",
    "settings.save": "Save",
    "settings.lang": "Language",
    "invoice.upload": "Upload invoice file (PDF/image)",
    "invoice.paste": "Or paste invoice text",
    "invoice.scanText": "Scan Text",
    "reports.title": "Threat Reports",
    "dashboard.title": "Dashboard",
    "dashboard.total": "Total Scans",
    "dashboard.susp": "Suspicious",
    "dashboard.mal": "Malicious",
    "scanner.title": "Threat Scanner",
    "scanner.emailTab": "Email",
    "scanner.invoiceTab": "Invoice",

  },
  hi: {
    "app.title": "साइबर सारथी",
    "email.safe": "ईमेल सुरक्षित प्रतीत होता है।",
    "email.susp": "संदिग्ध संकेत मिले (संभावित फ़िशिंग)।",
    "email.mal": "उच्च जोखिम संकेत (संभावित फ़िशिंग)।",
    "invoice.safe": "इनवॉइस सही लगता है।",
    "invoice.susp": "इनवॉइस में संदिग्ध संकेत मिले।",
    "invoice.mal": "संभावित धोखाधड़ी वाला इनवॉइस।",
    "settings.title": "सेटिंग्स",
    "settings.apiBase": "API बेस URL",
    "settings.apiKey": "API कुंजी (x-api-key हेडर)",
    "settings.save": "सहेजें",
    "settings.lang": "भाषा",
    "invoice.upload": "इनवॉइस फ़ाइल अपलोड करें (PDF/इमेज)",
    "invoice.paste": "या इनवॉइस टेक्स्ट पेस्ट करें",
    "invoice.scanText": "टेक्स्ट स्कैन करें",
    "reports.title": "खतरा रिपोर्ट",
    "dashboard.title": "डैशबोर्ड",
    "dashboard.total": "कुल स्कैन",
    "dashboard.susp": "संदिग्ध",
    "dashboard.mal": "हानिकारक",
    "scanner.title": "खतरा स्कैनर",
    "scanner.emailTab": "ईमेल",
    "scanner.invoiceTab": "इनवॉइस",

  }
};

export function t(key) {
  const lang = window.localStorage.getItem("LANG") || "en";
  return MESSAGES[lang]?.[key] || key;
}

export function setLang(lang) {
  window.localStorage.setItem("LANG", lang);
  window.location.reload();
}
