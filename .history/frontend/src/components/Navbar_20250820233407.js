import React from "react";
import { t } from "../i18n";

function Navbar() {
  const barStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#2196f3",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000
  };

  const brandStyle = { fontSize: "20px", fontWeight: "bold" };

  return (
    <nav style={barStyle}>
      <div style={brandStyle}>CyberSaarthi</div>
      <div>{t("settings.lang")}: {localStorage.getItem("LANG") || "en"}</div>
    </nav>
  );
}

export default Navbar;
