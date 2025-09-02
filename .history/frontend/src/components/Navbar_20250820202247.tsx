import { storage } from "../api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [lang, setLang] = useState(storage.getLang());
  const location = useLocation();

  useEffect(() => {
    storage.setLang(lang);
  }, [lang]);

  return (
    <nav className="navbar navbar-expand bg-white px-3 border-bottom shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold text-primary">CyberSaarthi</span>
          <span className="text-secondary small">AI Cyber Shield for MSMEs</span>
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-secondary small">{location.pathname}</span>
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
