import React, { createContext, useState, useEffect } from "react";

export const ThemeLangContext = createContext();

export const ThemeLangProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");
  const [lang, setLang] = useState(localStorage.getItem("LANG") || "en");

  // Apply theme globally
  useEffect(() => {
    localStorage.setItem("THEME", theme);
    document.body.style.background = theme === "dark" ? "#121212" : "#fff";
    document.body.style.color = theme === "dark" ? "#f5f5f5" : "#000";
  }, [theme]);

  // Persist lang
  useEffect(() => {
    localStorage.setItem("LANG", lang);
  }, [lang]);

  return (
    <ThemeLangContext.Provider value={{ theme, setTheme, lang, setLang }}>
      {children}
    </ThemeLangContext.Provider>
  );
};
