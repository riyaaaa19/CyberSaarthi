import React, { useState, useEffect } from "react";
import { setRuntimeConfig, API_BASE } from "../services/api";

function Settings() {
  const [apiBase, setApiBase] = useState(window.localStorage.getItem('API_BASE') || API_BASE || "http://localhost:8000");
  const [apiKey, setApiKey] = useState(window.localStorage.getItem('API_KEY') || "");

  useEffect(()=> {
    // nothing extra
  },[]);

  const save = () => {
    setRuntimeConfig({ apiBase, apiKey });
    alert("Settings saved. Reload the page for changes to take full effect.");
  };

  return (
    <div>
      <h3>Settings</h3>
      <div className="mb-3">
        <label>API Base URL</label>
        <input className="form-control" value={apiBase} onChange={(e)=>setApiBase(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>API Key (x-api-key header)</label>
        <input className="form-control" value={apiKey} onChange={(e)=>setApiKey(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={save}>Save</button>
    </div>
  );
}

export default Settings;
