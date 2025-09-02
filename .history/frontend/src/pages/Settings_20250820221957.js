import React, { useState } from "react";
import { setRuntimeConfig, API_BASE } from "../services/api";

function Settings() {
  const [apiBase, setApiBase] = useState(window.localStorage.getItem('API_BASE') || API_BASE || "http://localhost:8000");
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('API_KEY') || "");

  const container = { padding:"20px" };
  const inputStyle = { width:"100%", padding:"10px", border:"1px solid #ccc", borderRadius:"5px", marginTop:"5px" };
  const buttonStyle = { marginTop:"15px", padding:"10px 20px", border:"none", borderRadius:"5px", background:"#2196f3", color:"white", cursor:"pointer" };

  const save = () => {
    setRuntimeConfig({ apiBase, apiKey });
    alert("Settings saved. Reload the page for changes to take full effect.");
  };

  return (
    <div style={container}>
      <h2>Settings</h2>
      <div style={{ marginBottom:"15px" }}>
        <label>API Base URL</label>
        <input style={inputStyle} value={apiBase} onChange={(e)=>setApiBase(e.target.value)} />
      </div>
      <div style={{ marginBottom:"15px" }}>
        <label>API Key (x-api-key header)</label>
        <input style={inputStyle} value={apiKey} onChange={(e)=>setApiKey(e.target.value)} />
      </div>
      <button style={buttonStyle} onClick={save}>Save</button>
    </div>
  );
}

export default Settings;
