import { useContext } from "react";
import { ThemeLangContext } from "./ThemeLangContext";

const MESSAGES = {
  en: {
    "verdict.safe": "Safe",
    "verdict.suspicious": "Suspicious",
    "verdict.malicious": "Malicious",
    "app.title": "CyberSaarthi",

    // Email Scanner Verdicts
    "email.safe": "Safe",
    "email.suspicious": "Suspicious",
    "email.malicious": "Malicious",

    // Email Scanner UI
    "email.scan": "Scan Email",
    "email.placeholder": "✉️ Paste email text here...",

    // Invoice Scanner
    "invoice.safe": "Invoice Safe",
    "invoice.suspicious": "Invoice Suspicious",
    "invoice.malicious": "Invoice Malicious",
    "invoice.upload": "Upload invoice file (PDF/image)",
    "invoice.paste": "Or paste invoice text",
    "invoice.scanText": "Scan Invoice",
    "invoice.placeholder": "📄 Paste invoice text here...",

    // Dashboard / Results
    "dashboard.heading": "Detect, Analyze & Stay Safe 🛡️", // ✅ added here
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

    // ✅ Results section for Scanner.js
    "result.verdict": "Verdict",
    "result.score": "Score",
    "result.explanation": "Explanation",

    // Reports
    "reports.title": "Threat Reports",

    // Explanations
    "explanation.safe": "Email/Invoice appears safe.",
    "explanation.suspicious": "Suspicious indicators found (possible phishing).",
    "explanation.malicious": "High-risk indicators found (likely phishing).",
    "explanation.invoice.consistent": "Invoice looks consistent.",
    "explanation.invoice.missingTotal": "Missing explicit total amount",
    "explanation.invoice.bankDetails": "Bank details without GSTIN reference",
    "explanation.invoice.accountNumber":
      "Account number present but vendor context unclear",

    // Dynamic explanations
    "explanation.mlScore": "ML score",
    "explanation.suspiciousDomainFound": "Suspicious domain found",
    "explanation.containsTerms":
      "Contains high-risk phishing terms ({count} matches)",

    // Scanner
    "scanner.title": "Threat Scanner",
    "scanner.emailTab": "Email",
    "scanner.invoiceTab": "Invoice",
    "scanner.scanning": "Scanning...",

    // Settings
    "settings.title": "Settings",
    "settings.apiBase": "API Base URL",
    "settings.apiKey": "API Key (x-api-key header)",
    "settings.lang": "Language",
    "settings.theme": "Theme",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.notifications": "Enable Notifications",
    "settings.showHistory": "Show History",
    "settings.save": "Save",
    "settings.saved": "Settings saved successfully!",
  },

  hi: {
    "verdict.safe": "सुरक्षित",
    "verdict.suspicious": "संदिग्ध",
    "verdict.malicious": "हानिकारक",
    "app.title": "साइबर सारथी",

    // Email Scanner Verdicts
    "email.safe": "सुरक्षित",
    "email.suspicious": "संदिग्ध",
    "email.malicious": "हानिकारक",

    // Email Scanner UI
    "email.scan": "ईमेल स्कैन करें",
    "email.placeholder": "✉️ यहाँ ईमेल टेक्स्ट पेस्ट करें...",

    // Invoice Scanner
    "invoice.safe": "इनवॉइस सुरक्षित",
    "invoice.suspicious": "इनवॉइस संदिग्ध",
    "invoice.malicious": "हानिकारक इनवॉइस",
    "invoice.upload": "इनवॉइस फ़ाइल अपलोड करें (PDF/इमेज)",
    "invoice.paste": "या इनवॉइस टेक्स्ट पेस्ट करें",
    "invoice.scanText": "इनवॉइस स्कैन करें",
    "invoice.placeholder": "📄 यहाँ इनवॉइस टेक्स्ट पेस्ट करें...",

    // Dashboard / Results
    "dashboard.heading": "सतर्क रहें, विश्लेषण करें और सुरक्षित रहें 🛡️", // ✅ added here
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

    // ✅ Results section for Scanner.js
    "result.verdict": "परिणाम",
    "result.score": "स्कोर",
    "result.explanation": "व्याख्या",

    // Reports
    "reports.title": "खतरे की रिपोर्टें",

    // Explanations
    "explanation.safe": "ईमेल/इनवॉइस सुरक्षित प्रतीत होता है।",
    "explanation.suspicious": "संदिग्ध संकेत पाए गए (संभवतः फ़िशिंग)।",
    "explanation.malicious": "उच्च जोखिम संकेत पाए गए (संभावित फ़िशिंग)।",
    "explanation.invoice.consistent": "इनवॉइस सही प्रतीत हो रहा है।",
    "explanation.invoice.missingTotal": "कुल राशि स्पष्ट रूप से अनुपस्थित है",
    "explanation.invoice.bankDetails": "बैंक विवरण बिना जीएसटीआईएन संदर्भ के",
    "explanation.invoice.accountNumber":
      "खाता संख्या मौजूद है लेकिन विक्रेता संदर्भ अस्पष्ट है",

    // Dynamic explanations
    "explanation.mlScore": "एमएल स्कोर",
    "explanation.suspiciousDomainFound": "संदिग्ध डोमेन पाया गया",
    "explanation.containsTerms":
      "उच्च जोखिम वाले फ़िशिंग शब्द शामिल हैं ({count} बार मिला)",

    // Scanner
    "scanner.title": "खतरा स्कैनर",
    "scanner.emailTab": "ईमेल",
    "scanner.invoiceTab": "इनवॉइस",
    "scanner.scanning": "स्कैन हो रहा है...",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.apiBase": "API बेस URL",
    "settings.apiKey": "API कुंजी (x-api-key हेडर)",
    "settings.lang": "भाषा",
    "settings.theme": "थीम",
    "settings.light": "हल्की",
    "settings.dark": "गहरी",
    "settings.notifications": "सूचनाएं सक्षम करें",
    "settings.showHistory": "इतिहास दिखाएं",
    "settings.save": "सहेजें",
    "settings.saved": "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
  },
};

export function useT() {
  const { lang } = useContext(ThemeLangContext);
  return (key, vars = {}) => {
    let template = MESSAGES[lang]?.[key] || key;
    Object.keys(vars).forEach(
      (v) => (template = template.replace(`{${v}}`, vars[v]))
    );
    return template;
  };
}
