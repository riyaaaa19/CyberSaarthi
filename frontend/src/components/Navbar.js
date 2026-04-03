import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeLangContext } from "../ThemeLangContext";
import { useT } from "../i18n";
import SettingsDrawer from "./SettingsDrawer";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { theme } = useContext(ThemeLangContext);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const t = useT();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    zIndex: 1000,
    background: theme === "dark" 
      ? "rgba(15, 15, 15, 0.95)" 
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: theme === "dark"
      ? "1px solid rgba(148, 163, 184, 0.1)"
      : "1px solid rgba(148, 163, 184, 0.1)",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
    background: "linear-gradient(90deg, #4f46e5, #8b5cf6)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "color 0.3s ease",
  };

  const settingsIconStyle = {
    fontSize: "20px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary-light)",
    background: "transparent",
    border: "none",
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: theme === "dark" ? "#e2e8f0" : "#374151",
  };

  return (
    <>
      <div style={navbarStyle} className="app-navbar">
        {/* Logo */}
        <Link to="/dashboard" style={logoStyle} className="app-navbar-logo">
          {t("app.title")}
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <nav className="app-navbar-links">
            <Link
              to="/dashboard"
              className={`app-navbar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              {t("dashboard.title")}
            </Link>
            <Link
              to="/scanner"
              className={`app-navbar-link ${location.pathname === "/scanner" ? "active" : ""}`}
            >
              {t("scanner.title")}
            </Link>
            <Link
              to="/reports"
              className={`app-navbar-link ${location.pathname === "/reports" ? "active" : ""}`}
            >
              {t("reports.title")}
            </Link>
          </nav>
        )}

        {/* Controls */}
        <div className="app-navbar-controls">
          {isAuthenticated && user && (
            <div style={userInfoStyle}>
              👤 {user.email}
            </div>
          )}

          {!isAuthenticated ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link
                to="/login"
                style={{
                  padding: "6px 12px",
                  background: "linear-gradient(90deg, #4f46e5, #8b5cf6)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: "6px 12px",
                  background: "#f3f4f6",
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              {/* Settings Icon */}
              <div
                style={settingsIconStyle}
                className="app-navbar-settings"
                onClick={() => setIsSettingsOpen(true)}
                onMouseEnter={(e) => e.target.style.background = theme === "dark" ? "#374151" : "#f3f4f6"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                ⚙️
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings Drawer */}
      {isAuthenticated && (
        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
