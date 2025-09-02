import { useState } from "react";
import { endpoints, ScanResponse } from "../api";
import VerdictBadge from "../components/VerdictBadge";

export default function UploadInvoice() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      setLoading(true);
      const res = await endpoints.uploadInvoice(file);
      setResult(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to upload invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5>Upload Invoice PDF</h5>
          <input
            type="file"
            accept="application/pdf"
            className="form-control mt-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            disabled={!file || loading}
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
          {error && <div className="text-danger mt-3">{error}</div>}
          {result && (
            <div className="alert mt-3 border">
              <div className="d-flex align-items-center gap-2">
                <VerdictBadge verdict={result.verdict} />
                <span className="fw-semibold">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2">{result.explanation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
