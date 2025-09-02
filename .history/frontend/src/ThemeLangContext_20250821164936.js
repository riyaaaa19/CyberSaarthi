import React, { createContext, useState, useEffect } from "react";

export const ThemeLangContext = createContext();

export const ThemeLangProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");
  const [lang, setLang] = useState(localStorage.getItem("LANG") || "en");

  // save settings persistently
  useEffect(() => {
    localStorage.setItem("THEME", theme);
    document.body.style.background = theme === "dark" ? "#121212" : "#fff";
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("LANG", lang);
  }, [lang]);

  return (
    <ThemeLangContext.Provider value={{ theme, setTheme, lang, setLang }}>
      {children}
    </ThemeLangContext.Provider>
  );
};
