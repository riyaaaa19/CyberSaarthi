const MESSAGES = {
  en: {
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
    "invoice.upload": "Upload invoice file (PDF/image)",
    "invoice.paste": "Or paste invoice text",
    "invoice.scanText": "Scan Text",
    "reports.title": "Threat Reports",
    "dashboard.title": "Dashboard",
  },
  hi: {
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
    "invoice.upload": "इनवॉइस फ़ाइल अपलोड करें (PDF/इमेज)",
    "invoice.paste": "या इनवॉइस टेक्स्ट पेस्ट करें",
    "invoice.scanText": "टेक्स्ट स्कैन करें",
    "reports.title": "खतरा रिपोर्ट",
    "dashboard.title": "डैशबोर्ड",
  }
};

// Helper to get message
export function t(key) {
  const lang = window.localStorage.getItem("LANG") || "en";
  return MESSAGES[lang]?.[key] || key;
}

// Change language at runtime
export function setLang(lang) {
  window.localStorage.setItem("LANG", lang);
  window.location.reload();
}
