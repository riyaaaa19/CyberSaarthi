import React from "react";
import { t } from "../i18n";

function Sidebar() {
  const sidebarStyle = {
    width: "220px",
    background: "#f5f5f5",
    height: "100vh",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    overflowY: "auto",
    borderRight: "1px solid #ddd"
  };

  const linkStyle = {
    display: "block",
    padding: "10px",
    marginBottom: "8px",
    color: "#333",
    textDecoration: "none",
    borderRadius: "5px"
  };

  const linkHover = {
    background: "#e0e0e0"
  };

  return (
    <div style={sidebarStyle}>
      <h3 style={{ marginBottom: "20px" }}>Menu</h3>
      <a href="/dashboard" style={linkStyle} onMouseOver={e => e.currentTarget.style.background = linkHover.background} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{t("dashboard.title")}</a>
      <a href="/scanner" style={linkStyle} onMouseOver={e => e.currentTarget.style.background = linkHover.background} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{t("scanner.title")}</a>
      <a href="/reports" style={linkStyle} onMouseOver={e => e.currentTarget.style.background = linkHover.background} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{t("reports.title")}</a>
      <a href="/settings" style={linkStyle} onMouseOver={e => e.currentTarget.style.background = linkHover.background} onMouseOut={e => e.currentTarget.style.background = "transparent"}>{t("settings.title")}</a>
    </div>
  );
}

export default Sidebar;
