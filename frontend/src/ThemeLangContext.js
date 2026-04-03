import React, { createContext, useState, useEffect } from "react";

export const ThemeLangContext = createContext();

export const ThemeLangProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");
  const [lang, setLang] = useState(localStorage.getItem("LANG") || "en");

  // Apply theme globally
  useEffect(() => {
    localStorage.setItem("THEME", theme);
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
    document.body.style.background = theme === "dark" ? "#0f172a" : "#f3f4f6";
    document.body.style.color = theme === "dark" ? "#e2e8f0" : "#1f2937";
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
