import React, { useState } from "react";
import { t, setLang } from "../i18n";

function Settings() {
  const [language, setLanguage] = useState(localStorage.getItem("LANG") || "en");
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");
  const [notifications, setNotifications] = useState(localStorage.getItem("NOTIFY") === "true");

  const cardStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    maxWidth: "500px"
  };

  const saveSettings = () => {
    localStorage.setItem("LANG", language);
    localStorage.setItem("THEME", theme);
    localStorage.setItem("NOTIFY", notifications);
    setLang(language);
    alert(t("settings.saved"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("settings.title")}</h2>
      <div style={cardStyle}>
        {/* Language */}
        <div style={{ marginBottom: "15px" }}>
          <label>{t("settings.lang")}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: "15px" }}>
          <label>{t("settings.theme")}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="light">{t("settings.light")}</option>
            <option value="dark">{t("settings.dark")}</option>
          </select>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            {t("settings.notifications")}
          </label>
        </div>

        <button
          onClick={saveSettings}
          style={{
            padding: "8px 15px",
            background: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
