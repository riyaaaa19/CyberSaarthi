import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeLangContext } from "../ThemeLangContext";
import { useT } from "../i18n";
import { useAuth } from "../contexts/AuthContext";

function SettingsDrawer({ isOpen, onClose }) {
  const { theme, setTheme, lang, setLang } = useContext(ThemeLangContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
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

  // Handle browser notifications change
  const handleBrowserNotifications = (value) => {
    setBrowserNotifications(value);
    localStorage.setItem("browserNotifications", JSON.stringify(value));
  };

  // Handle scan result notifications change
  const handleScanResultNotifications = (value) => {
    setScanResultNotifications(value);
    localStorage.setItem("scanResultNotifications", JSON.stringify(value));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const drawerStyle = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-400px",
    width: "400px",
    height: "100vh",
    background: theme === "dark" ? "#1a1a1a" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
    zIndex: 1100,
    transition: "right 0.3s ease",
    padding: "24px",
    overflowY: "auto",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    zIndex: 1050,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: theme === "dark" ? "1px solid #374151" : "1px solid #e0e0e0",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
  };

  const closeButtonStyle = {
    fontSize: "24px",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "background 0.2s ease",
  };

  const sectionStyle = {
    marginBottom: "32px",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
  };

  const settingItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: theme === "dark" ? "1px solid #374151" : "1px solid #f3f4f6",
  };

  const labelStyle = {
    fontSize: "16px",
    fontWeight: "500",
  };

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
    background: theme === "dark" ? "#1f2937" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
    minWidth: "120px",
  };

  const toggleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const toggleButtonStyle = (isActive) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: isActive
      ? "#2563eb"
      : theme === "dark" ? "#374151" : "#f3f4f6",
    color: isActive
      ? "#ffffff"
      : theme === "dark" ? "#d1d5db" : "#6b7280",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const logoutButtonStyle = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #ef4444, #dc2626)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "32px",
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>{t("settings.title")}</div>
          <div
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.background = theme === "dark" ? "#374151" : "#f3f4f6"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            ✕
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Preferences</div>

          <div style={settingItemStyle}>
            <div style={labelStyle}>Language</div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={selectStyle}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div style={settingItemStyle}>
            <div style={labelStyle}>Theme</div>
            <div style={toggleStyle}>
              <button
                style={toggleButtonStyle(theme === "light")}
                onClick={() => setTheme("light")}
              >
                ☀️ Light
              </button>
              <button
                style={toggleButtonStyle(theme === "dark")}
                onClick={() => setTheme("dark")}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Notifications</div>

          <div style={settingItemStyle}>
            <div style={labelStyle}>Browser Notifications</div>
            <div style={toggleStyle}>
              <button 
                style={toggleButtonStyle(browserNotifications)}
                onClick={() => handleBrowserNotifications(true)}
              >
                Enabled
              </button>
              <button 
                style={toggleButtonStyle(!browserNotifications)}
                onClick={() => handleBrowserNotifications(false)}
              >
                Disabled
              </button>
            </div>
          </div>

          <div style={settingItemStyle}>
            <div style={labelStyle}>Scan Results</div>
            <div style={toggleStyle}>
              <button 
                style={toggleButtonStyle(scanResultNotifications)}
                onClick={() => handleScanResultNotifications(true)}
              >
                On
              </button>
              <button 
                style={toggleButtonStyle(!scanResultNotifications)}
                onClick={() => handleScanResultNotifications(false)}
              >
                Off
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => e.target.opacity = "0.9"}
          onMouseLeave={(e) => e.target.opacity = "1"}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default SettingsDrawer;