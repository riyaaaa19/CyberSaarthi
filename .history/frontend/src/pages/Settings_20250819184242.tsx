import React, { useEffect, useState } from "react";
import { getApiKey, getBaseUrl, setApiKey, setBaseUrl } from "../api";

export default function Settings() {
  const [baseUrl, setBase] = useState(getBaseUrl());
  const [apiKey, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 1800);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBaseUrl(baseUrl);
    setApiKey(apiKey);
    setSaved(true);
  };

  return (
    <div className="container py-4">
      <div className="p-4 bg-white" style={{ borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
        <h4>Settings</h4>
        <form className="mt-3" onSubmit={onSave}>
          <div className="mb-3">
            <label className="form-label">Backend Base URL</label>
            <input className="form-control" value={baseUrl} onChange={(e)=>setBase(e.target.value)} placeholder="http://localhost:8000" />
          </div>
          <div className="mb-3">
            <label className="form-label">API Key (Bearer)</label>
            <input className="form-control" value={apiKey} onChange={(e)=>setKey(e.target.value)} placeholder="Paste token if required" />
            <div className="form-text">Saved to localStorage. All requests include Authorization header if present.</div>
          </div>
          <button className="btn btn-primary">Save Settings</button>
          {saved && <span className="ms-3 text-success">Saved ✓</span>}
        </form>
      </div>
    </div>
  );
}
