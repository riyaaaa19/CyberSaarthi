import React, { useContext } from "react";
import { ThemeLangContext } from "../ThemeLangContext";
import { t } from "../i18n";

function Navbar() {
  const { theme, setTheme, lang, setLang } = useContext(ThemeLangContext);

  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    background: theme === "dark" ? "#121212" : "#2196f3",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: 1000
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold"
  };

  const controlsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  };

  const selectStyle = {
    padding: "5px",
    borderRadius: "5px",
    border: "none",
    fontSize: "14px",
    cursor: "pointer"
  };

  return (
    <div style={navbarStyle}>
      {/* App Title */}
      <div style={titleStyle}>{t("app.title")}</div>

      {/* Controls */}
      <div style={controlsStyle}>
        {/* Language Selector */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={selectStyle}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        {/* Theme Selector */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={selectStyle}
        >
          <option value="light">☀ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>
    </div>
  );
}

export default Navbar;
