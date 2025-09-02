import { useContext } from "react";
import { ThemeLangContext } from "./ThemeLangContext";

const MESSAGES = {
  en: {
    "app.title": "CyberSaarthi",

    // Email Scanner
    "email.safe": "Email appears safe.",
    "email.susp": "Suspicious indicators found (possible phishing).",
    "email.mal": "High-risk indicators found (likely phishing).",

    // Invoice Scanner
    "invoice.safe": "Invoice looks consistent.",
    "invoice.susp": "Suspicious invoice indicators found.",
    "invoice.mal": "Likely fraudulent invoice detected.",
    "invoice.upload": "Upload invoice file (PDF/image)",
    "invoice.paste": "Or paste invoice text",
    "invoice.scanText": "Scan Text",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.total": "Total Scans",
    "dashboard.susp": "Suspicious",
    "dashboard.mal": "Malicious",

    // Reports
    "reports.title": "Threat Reports",

    // Scanner
    "scanner.title": "Threat Scanner",
    "scanner.emailTab": "Email",
    "scanner.invoiceTab": "Invoice",

    // Settings
    "settings.title": "Settings",
    "settings.apiBase": "API Base URL",
    "settings.apiKey": "API Key (x-api-key header)",
    "settings.lang": "Language",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.notifications": "Enable Notifications",
    "settings.save": "Save",
    "settings.saved": "Settings saved successfully!"
  },

  hi: {
    "app.title": "साइबर सारथी",

    // Email Scanner
    "email.safe": "ईमेल सुरक्षित प्रतीत होता है।",
    "email.susp": "संदिग्ध संकेत मिले (संभावित फ़िशिंग)।",
    "email.mal": "उच्च जोखिम संकेत (संभावित फ़िशिंग)।",

    // Invoice Scanner
    "invoice.safe": "इनवॉइस सही लगता है।",
    "invoice.susp": "इनवॉइस में संदिग्ध संकेत मिले।",
    "invoice.mal": "संभावित धोखाधड़ी वाला इनवॉइस।",
    "invoice.upload": "इनवॉइस फ़ाइल अपलोड करें (PDF/इमेज)",
    "invoice.paste": "या इनवॉइस टेक्स्ट पेस्ट करें",
    "invoice.scanText": "टेक्स्ट स्कैन करें",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.total": "कुल स्कैन",
    "dashboard.susp": "संदिग्ध",
    "dashboard.mal": "हानिकारक",

    // Reports
    "reports.title": "खतरा रिपोर्ट",

    // Scanner
    "scanner.title": "खतरा स्कैनर",
    "scanner.emailTab": "ईमेल",
    "scanner.invoiceTab": "इनवॉइस",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.apiBase": "API बेस URL",
    "settings.apiKey": "API कुंजी (x-api-key हेडर)",
    "settings.lang": "भाषा",
    "settings.theme": "थीम",
    "settings.light": "हल्की",
    "settings.dark": "गहरी",
    "settings.notifications": "सूचनाएं सक्षम करें",
    "settings.save": "सहेजें",
    "settings.saved": "सेटिंग्स सफलतापूर्वक सहेजी गईं!"
  }
};

// ✅ Hook version of translator
export function useT() {
  const { lang } = useContext(ThemeLangContext);
  return (key) => MESSAGES[lang]?.[key] || key;
}
