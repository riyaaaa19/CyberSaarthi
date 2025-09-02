import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeLangContext } from "../ThemeLangContext";
import { useT } from "../i18n";   // ✅ use hook

function Sidebar() {
  const { theme } = useContext(ThemeLangContext);
  const location = useLocation();
  const t = useT();   // ✅ call hook

  const sidebarStyle = {
    width: "220px",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    background: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
    color: theme === "dark" ? "#fff" : "#000",
    paddingTop: "60px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
  };

  const linkStyle = (path) => ({
    display: "block",
    padding: "12px 20px",
    color:
      location.pathname === path
        ? "#2196f3"
        : theme === "dark"
        ? "#ddd"
        : "#000",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
    background:
      location.pathname === path
        ? theme === "dark"
          ? "#333"
          : "#e0e0e0"
        : "transparent",
    borderRadius: "5px",
    margin: "5px 10px"
  });

  return (
    <div style={sidebarStyle}>
      <Link to="/dashboard" style={linkStyle("/dashboard")}>
        {t("dashboard.title")}
      </Link>
      <Link to="/scanner" style={linkStyle("/scanner")}>
        {t("scanner.title")}
      </Link>
      <Link to="/reports" style={linkStyle("/reports")}>
        {t("reports.title")}
      </Link>
      <Link to="/settings" style={linkStyle("/settings")}>
        {t("settings.title")}
      </Link>
    </div>
  );
}

export default Sidebar;
