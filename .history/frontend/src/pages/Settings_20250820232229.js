import React, { useState } from "react";
import { setRuntimeConfig, API_BASE } from "../services/api";
import { setLang, t } from "../i18n";

function Settings() {
  const [apiBase, setApiBase] = useState(window.localStorage.getItem('API_BASE') || API_BASE || "http://localhost:8000");
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('API_KEY') || "");
  const [lang, setLanguage] = useState(window.localStorage.getItem("LANG") || "en");

  const inputStyle = { width:"100%", padding:"10px", border:"1px solid #ccc", borderRadius:"5px", marginTop:"5px" };
  const buttonStyle = { marginTop:"15px", padding:"10px 20px", border:"none", borderRadius:"5px", background:"#2196f3", color:"white", cursor:"pointer" };

  const save = () => {
    setRuntimeConfig({ apiBase, apiKey });
    setLang(lang);
  };

  return (
    <div style={{ padding:"20px" }}>
      <h2>{t("settings.title")}</h2>
      <div style={{ marginBottom:"15px" }}>
        <label>{t("settings.apiBase")}</label>
        <input style={inputStyle} value={apiBase} onChange={(e)=>setApiBase(e.target.value)} />
      </div>
      <div style={{ marginBottom:"15px" }}>
        <label>{t("settings.apiKey")}</label>
        <input style={inputStyle} value={apiKey} onChange={(e)=>setApiKey(e.target.value)} />
      </div>
      <div style={{ marginBottom:"15px" }}>
        <label>Language</label>
        <select style={inputStyle} value={lang} onChange={(e)=>setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
      <button style={buttonStyle} onClick={save}>{t("settings.save")}</button>
    </div>
  );
}

export default Settings;
