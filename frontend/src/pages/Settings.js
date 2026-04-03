import React, { useContext, useState, useEffect } from "react";
import { useT } from "../i18n";
import { ThemeLangContext } from "../ThemeLangContext";

function Settings() {
  const { theme, setTheme, lang, setLang } = useContext(ThemeLangContext);
  const t = useT();
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [scanResultNotifications, setScanResultNotifications] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedBrowserNoti = localStorage.getItem("browserNotifications");
    const savedScanNoti = localStorage.getItem("scanResultNotifications");
    if (savedBrowserNoti !== null) setBrowserNotifications(JSON.parse(savedBrowserNoti));
    if (savedScanNoti !== null) setScanResultNotifications(JSON.parse(savedScanNoti));
  }, []);

  // Save settings to localStorage whenever they change
  const handleBrowserNotifications = (value) => {
    setBrowserNotifications(value);
    localStorage.setItem("browserNotifications", JSON.stringify(value));
  };

  const handleScanResultNotifications = (value) => {
    setScanResultNotifications(value);
    localStorage.setItem("scanResultNotifications", JSON.stringify(value));
  };

  const pageStyle = {
    width: "100%",
    minHeight: "auto",
    padding: "80px 16px 16px",
    background: theme === "dark" 
      ? "radial-gradient(circle at 10% 10%, #1d2f6d 0%, #0b1231 38%, #03070f 83%)"
      : "radial-gradient(circle at 10% 10%, #f5f7ff 0%, #e5e9fb 35%, #cfd8f9 80%)",
    color: theme === "dark" ? "#eef4ff" : "#0f172a",
    position: "relative",
    overflow: "visible",
    boxSizing: "border-box"
  };

  const headerStyle = {
    position: "relative",
    zIndex: 3,
    maxWidth: "960px",
    margin: "0 auto 8px",
    textAlign: "left"
  };

  const headingStyle = {
    fontSize: "clamp(34px, 6vw, 44px)",
    fontWeight: "900",
    margin: "0 0 24px",
    letterSpacing: "0.02em",
    background: "linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const sectionStyle = {
    maxWidth: "960px",
    margin: "0 auto 32px",
    background: theme === "dark" 
      ? "rgba(30, 30, 30, 0.6)"
      : "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "24px",
    border: theme === "dark" 
      ? "1px solid rgba(148, 163, 184, 0.12)"
      : "1px solid rgba(148, 163, 184, 0.08)"
  };

  const sectionHeadingStyle = {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
    color: theme === "dark" ? "#f3f4f6" : "#111827"
  };

  const settingRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  };

  const labelStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: theme === "dark" ? "#e2e8f0" : "#374151"
  };

  const selectStyle = {
    padding: "8px 12px",
    border: theme === "dark" 
      ? "1px solid rgba(148, 163, 184, 0.2)"
      : "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    background: theme === "dark" ? "#1e1e1e" : "#ffffff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
    fontSize: "14px",
    minWidth: "180px"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "8px"
  };

  const getButtonStyle = (isActive) => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    background: isActive
      ? "linear-gradient(90deg, #4f46e5, #8b5cf6)"
      : theme === "dark" 
        ? "#2c2c2c"
        : "#e5e7eb",
    color: isActive 
      ? "#ffffff"
      : theme === "dark" ? "#9ca3af" : "#6b7280",
    transition: "all 0.2s ease"
  });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={headingStyle}>{t("settings.title")}</h1>
      </div>

      {/* Preferences */}
      <div style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>{t("settings.preferences") || "Preferences"}</h2>
        
        {/* Language */}
        <div style={settingRowStyle}>
          <label style={labelStyle}>{t("settings.lang")}</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={selectStyle}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* Theme */}
        <div style={settingRowStyle}>
          <label style={labelStyle}>{t("settings.theme")}</label>
          <div style={buttonGroupStyle}>
            <button
              onClick={() => setTheme("light")}
              style={getButtonStyle(theme === "light")}
            >
              ☀️ {t("settings.light")}
            </button>
            <button
              onClick={() => setTheme("dark")}
              style={getButtonStyle(theme === "dark")}
            >
              🌙 {t("settings.dark")}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>{t("settings.notificationsSection") || "Notifications"}</h2>
        
        {/* Browser Notifications */}
        <div style={settingRowStyle}>
          <label style={labelStyle}>{t("settings.browserNotifications") || "Browser Notifications"}</label>
          <div style={buttonGroupStyle}>
            <button
              onClick={() => handleBrowserNotifications(true)}
              style={getButtonStyle(browserNotifications)}
            >
              {t("settings.enabled") || "Enabled"}
            </button>
            <button
              onClick={() => handleBrowserNotifications(false)}
              style={getButtonStyle(!browserNotifications)}
            >
              {t("settings.disabled") || "Disabled"}
            </button>
          </div>
        </div>

        {/* Scan Results Notifications */}
        <div style={settingRowStyle}>
          <label style={labelStyle}>{t("settings.scanResults") || "Scan Results"}</label>
          <div style={buttonGroupStyle}>
            <button
              onClick={() => handleScanResultNotifications(true)}
              style={getButtonStyle(scanResultNotifications)}
            >
              {t("settings.on") || "On"}
            </button>
            <button
              onClick={() => handleScanResultNotifications(false)}
              style={getButtonStyle(!scanResultNotifications)}
            >
              {t("settings.off") || "Off"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
