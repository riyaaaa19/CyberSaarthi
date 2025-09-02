import { useState } from "react";
import { endpoints, ScanResponse } from "../api";
import VerdictBadge from "../components/VerdictBadge";

export default function EmailScan() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    try {
      setLoading(true);
      const res = await endpoints.scanEmail(text);
      setResult(res.data);
    } catch (e: any) {
      setError(e?.message || "Failed to scan email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5>Email Phishing Scan</h5>
          <textarea
            className="form-control mt-2"
            rows={8}
            placeholder="Paste email content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="d-flex gap-2 mt-3">
            <button
              disabled={!text || loading}
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {loading ? "Analyzing..." : "Analyze Email"}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setText("");
                setResult(null);
                setError(null);
              }}
            >
              Clear
            </button>
          </div>
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
