import React, { useState } from "react";
import { endpoints, PhishingScanResponse } from "../api";

export default function PhishingScan() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingScanResponse | null>(null);
  const [error, setError] = useState<string>("");

  const onScan = async () => {
    setError("");
    setResult(null);
    if (!input.trim()) return setError("Please enter text, email or URL.");

    try {
      setLoading(true);
      const res = await endpoints.phishingScan({ input });
      setResult(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Scan failed. Check Base URL and API key in Settings.");
    } finally {
      setLoading(false);
    }
  };

  const ring: React.CSSProperties = {
    position: "absolute", inset: -6, borderRadius: 16, border: "2px dashed rgba(13,110,253,.25)",
    animation: "pulse 2s infinite",
  };

  return (
    <div className="container py-4">
      <div className="p-4 bg-white position-relative" style={{ borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
        <div style={ring}></div>
        <h4 className="mb-3">Phishing Scan</h4>
        <div className="mb-3">
          <textarea className="form-control" rows={5} placeholder="Paste email content / URL / text here..."
                    value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={onScan} disabled={loading}>
          {loading ? "Scanning..." : "Scan for Phishing"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {result && (
          <div className="alert mt-3" role="alert" style={{ background: "#f8f9fa" }}>
            <div className="d-flex align-items-center gap-3">
              <div className="display-6 fw-bold mb-0">{result.score}</div>
              <div>
                <div className="fw-bold text-capitalize">{result.result}</div>
                <div className="small text-muted">Risk Score</div>
              </div>
            </div>
            {result.reasons?.length ? (
              <ul className="mt-3 mb-0">
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            ) : null}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }`}</style>
    </div>
  );
}
