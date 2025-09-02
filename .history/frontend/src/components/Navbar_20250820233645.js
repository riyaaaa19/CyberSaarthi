import React from "react";
import { t, setLang } from "../i18n";

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

  const toggleLang = () => {
    const current = localStorage.getItem("LANG") || "en";
    const newLang = current === "en" ? "hi" : "en";
    setLang(newLang); // reloads app with new lang
  };

  return (
    <nav style={barStyle}>
      <div style={brandStyle}>CyberSaarthi</div>
      <button
        onClick={toggleLang}
        style={{
          padding: "6px 12px",
          background: "white",
          color: "#2196f3",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {localStorage.getItem("LANG") === "hi" ? "EN" : "हिंदी"}
      </button>
    </nav>
  );
}

export default Navbar;
