import React, { useState } from "react";
import { endpoints, UploadInvoiceResponse } from "../api";

export default function UploadInvoice() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadInvoiceResponse | null>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return setError("Please select a file (PDF/JPG/PNG).");
    setError(""); setResult(null);

    try {
      setLoading(true);
      const res = await endpoints.uploadInvoice(file);
      setResult(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Upload failed. Confirm Base URL & API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="p-4 bg-white" style={{ borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
        <h4 className="mb-3">Upload Invoice</h4>
        <div className="mb-3">
          <input className="form-control"
                 type="file"
                 accept=".pdf, image/*"
                 onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="form-text">Supported: PDF, PNG, JPG</div>
        </div>
        <button className="btn btn-secondary" disabled={loading} onClick={handleUpload}>
          {loading ? "Uploading..." : "Upload & Check"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {result && (
          <div className="alert mt-3" style={{ background: "#f8f9fa" }}>
            <div className="d-flex align-items-center gap-3">
              <div className="display-6 fw-bold mb-0">{result.score}</div>
              <div>
                <div className="fw-bold text-capitalize">{result.result}</div>
                <div className="small text-muted">Risk Score</div>
              </div>
            </div>
            {result.details ? (
              <pre className="mt-3 mb-0 bg-white border p-3" style={{ borderRadius: 8, maxHeight: 280, overflow: "auto" }}>
                {JSON.stringify(result.details, null, 2)}
              </pre>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
