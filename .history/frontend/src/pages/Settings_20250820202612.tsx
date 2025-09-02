import { useState } from "react";
import { storage } from "../api";

export default function Settings() {
  const [url, setUrl] = useState(storage.getBaseUrl().replace(/\/v1$/, ""));
  const [key, setKey] = useState(storage.getApiKey());

  const handleSave = () => {
    storage.setBaseUrl(url);
    storage.setApiKey(key);
    alert("Settings saved!");
    window.location.reload();
  };

  return (
    <div className="p-3">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5>Settings</h5>
          <div className="mb-3">
            <label className="form-label">Backend API URL</label>
            <input
              type="text"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-control"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            Save & Reload
          </button>
        </div>
      </div>
    </div>
  );
}
