import React, { useState, useEffect } from "react";
import { t, setLang } from "../i18n";

function Settings() {
  const [apiBase, setApiBase] = useState(localStorage.getItem("API_BASE") || "http://localhost:8000/v1");
  const [apiKey, setApiKey] = useState(localStorage.getItem("API_KEY") || "changeme-demo-key");
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");
  const [lang, setLanguage] = useState(localStorage.getItem("LANG") || "en");

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#121212" : "#fff";
    document.body.style.color = theme === "dark" ? "#f5f5f5" : "#000";
  }, [theme]);

  const saveSettings = () => {
    localStorage.setItem("API_BASE", apiBase);
    localStorage.setItem("API_KEY", apiKey);
    localStorage.setItem("THEME", theme);
    setLang(lang); // language save + reload
  };

  const boxStyle = {
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "20px auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const labelStyle = { display: "block", margin: "10px 0 5px" };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    background: theme === "dark" ? "#2c2c2c" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000"
  };
  const buttonStyle = {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("settings.title")}</h2>
      <div style={boxStyle}>
        <label style={labelStyle}>{t("settings.apiBase")}</label>
        <input value={apiBase} onChange={(e) => setApiBase(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>{t("settings.apiKey")}</label>
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>{t("settings.lang")}</label>
        <select value={lang} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        <label style={labelStyle}>Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={inputStyle}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button onClick={saveSettings} style={buttonStyle}>
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
