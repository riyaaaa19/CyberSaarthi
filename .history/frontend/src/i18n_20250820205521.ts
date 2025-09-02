import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Dashboard: "Dashboard",
        "Email Scan": "Email Scan",
        "Invoice Scan": "Invoice Scan",
        "Upload Invoice": "Upload Invoice",
        Reports: "Reports",
        Settings: "Settings",
        "AI Cyber Shield for MSMEs": "AI Cyber Shield for MSMEs",
      },
    },
    hi: {
      translation: {
        Dashboard: "डैशबोर्ड",
        "Email Scan": "ईमेल स्कैन",
        "Invoice Scan": "इनवॉइस स्कैन",
        "Upload Invoice": "इनवॉइस अपलोड करें",
        Reports: "रिपोर्ट्स",
        Settings: "सेटिंग्स",
        "AI Cyber Shield for MSMEs": "एमएसएमई के लिए एआई साइबर शील्ड",
      },
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
