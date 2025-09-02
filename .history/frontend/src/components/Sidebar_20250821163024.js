import React from "react";
import { NavLink } from "react-router-dom";
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

  const activeStyle = {
    background: "#2196f3",
    color: "white"
  };

  return (
    <div style={sidebarStyle}>
      <h3 style={{ marginBottom: "20px" }}>Menu</h3>
      <NavLink to="/dashboard" style={linkStyle} activeStyle={activeStyle}>{t("dashboard.title")}</NavLink>
      <NavLink to="/scanner" style={linkStyle} activeStyle={activeStyle}>{t("scanner.title")}</NavLink>
      <NavLink to="/reports" style={linkStyle} activeStyle={activeStyle}>{t("reports.title")}</NavLink>
      <NavLink to="/settings" style={linkStyle} activeStyle={activeStyle}>{t("settings.title")}</NavLink>
    </div>
  );
}

export default Sidebar;
