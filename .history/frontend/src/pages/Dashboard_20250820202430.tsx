import { useEffect, useState } from "react";
import { endpoints, HistoryItem } from "../api";
import VerdictBadge from "../components/VerdictBadge";

export default function Dashboard() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await endpoints.history(200, 0);
        setItems(res.data.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = items.length;
  const safe = items.filter((i) => i.verdict === "SAFE").length;
  const suspicious = items.filter((i) => i.verdict === "SUSPICIOUS").length;
  const malicious = items.filter((i) => i.verdict === "MALICIOUS").length;

  return (
    <div className="p-3">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-secondary small">SAFE</div>
              <div className="display-6 fw-bold text-success">{safe}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-secondary small">SUSPICIOUS</div>
              <div className="display-6 fw-bold text-warning">{suspicious}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-secondary small">MALICIOUS</div>
              <div className="display-6 fw-bold text-danger">{malicious}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent Reports</h5>
            <span className="text-secondary small">Total: {total}</span>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Verdict</th>
                    <th>Score</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 10).map((r) => (
                    <tr key={r.id}>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                      <td className="text-capitalize">{r.scan_type}</td>
                      <td><VerdictBadge verdict={r.verdict} /></td>
                      <td>{(r.score * 100).toFixed(1)}%</td>
                      <td style={{ maxWidth: 480 }}>{r.explanation}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-secondary">
                        No data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
