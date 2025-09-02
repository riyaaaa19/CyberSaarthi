import React, { useContext, useState } from "react";
import { useT } from "../i18n";   // ✅ use hook
import { ThemeLangContext } from "../ThemeLangContext";

function Settings() {
  const { theme, setTheme, lang, setLang } = useContext(ThemeLangContext);
  const t = useT();   // ✅ call hook
  const [notifications, setNotifications] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const boxStyle = {
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "20px auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const labelStyle = {
    display: "block",
    margin: "15px 0 5px",
    fontWeight: "bold"
  };
  const selectStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    background: theme === "dark" ? "#2c2c2c" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000"
  };
  const checkboxStyle = { marginRight: "10px" };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("settings.title")}</h2>
      <div style={boxStyle}>
        {/* Language Selector */}
        <label style={labelStyle}>{t("settings.lang")}</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={selectStyle}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        {/* Theme Selector */}
        <label style={labelStyle}>{t("settings.theme")}</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={selectStyle}
        >
          <option value="light">{t("settings.light")}</option>
          <option value="dark">{t("settings.dark")}</option>
        </select>

        {/* Notifications */}
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            style={checkboxStyle}
          />
          {t("settings.notifications")}
        </label>

        {/* Privacy / History */}
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={showHistory}
            onChange={() => setShowHistory(!showHistory)}
            style={checkboxStyle}
          />
          {t("settings.showHistory")}
        </label>
      </div>
    </div>
  );
}

export default Settings;
