import { useContext } from "react";
import { ThemeLangContext } from "./ThemeLangContext";

const MESSAGES = {
  en: {
    "app.title": "CyberSaarthi",

    // Email Scanner Verdicts (short form ✅)
    "email.safe": "Safe",
    "email.suspicious": "Suspicious",
    "email.malicious": "Malicious",

    // Invoice Scanner
    "invoice.safe": "Invoice Safe",
    "invoice.suspicious": "Invoice Suspicious",
    "invoice.malicious": "Invoice Malicious",
    "invoice.upload": "Upload invoice file (PDF/image)",
    "invoice.paste": "Or paste invoice text",
    "invoice.scanText": "Scan Text",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.total": "Total Scans",
    "dashboard.safe": "Safe",
    "dashboard.suspicious": "Suspicious",
    "dashboard.malicious": "Malicious",
    "dashboard.distribution": "Threat Distribution",
    "dashboard.trend": "Threat Trend",
    "dashboard.recentReports": "Recent Reports",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.verdict": "Verdict",
    "dashboard.score": "Score",
    "dashboard.explanation": "Explanation",
    "dashboard.date": "Date",
    "dashboard.noReports": "No reports available",
    

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

    // Email Scanner Verdicts (short form ✅)
    "email.safe": "सुरक्षित",
    "email.suspicious": "संदिग्ध",
    "email.malicious": "हानिकारक",

    // Invoice Scanner
    "invoice.safe": "इनवॉइस सुरक्षित",
    "invoice.suspicious": "इनवॉइस संदिग्ध",
    "invoice.malicious": "हानिकारक इनवॉइस",
    "invoice.upload": "इनवॉइस फ़ाइल अपलोड करें (PDF/इमेज)",
    "invoice.paste": "या इनवॉइस टेक्स्ट पेस्ट करें",
    "invoice.scanText": "टेक्स्ट स्कैन करें",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.total": "कुल स्कैन",
    "dashboard.safe": "सुरक्षित",
    "dashboard.suspicious": "संदिग्ध",
    "dashboard.malicious": "हानिकारक",
    "dashboard.distribution": "खतरे का वितरण",
    "dashboard.trend": "खतरे की प्रवृत्ति",
    "dashboard.recentReports": "हाल की रिपोर्टें",
    "dashboard.recentActivity": "हाल की गतिविधियाँ",
    "dashboard.verdict": "परिणाम",
    "dashboard.score": "स्कोर",
    "dashboard.explanation": "व्याख्या",
    "dashboard.date": "तारीख",
    "dashboard.noReports": "कोई रिपोर्ट उपलब्ध नहीं",

    // Reports
    "reports.title": "खतरे की रिपोर्टें",

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
