import { useEffect, useState } from "react";
import { endpoints, HistoryItem } from "../api";
import VerdictBadge from "../components/VerdictBadge";

export default function Reports() {
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
        setError(e?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const downloadCSV = () => {
    const csv = [
      ["Date", "Type", "Verdict", "Score", "Explanation"].join(","),
      ...items.map((r) =>
        [
          new Date(r.created_at).toLocaleString(),
          r.scan_type,
          r.verdict,
          (r.score * 100).toFixed(1) + "%",
          `"${r.explanation.replace(/"/g, '""')}"`
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cybersaarthi_reports.csv";
    a.click();
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Reports</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={downloadCSV}>
          Export CSV
        </button>
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
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.scan_type}</td>
                  <td><VerdictBadge verdict={r.verdict} /></td>
                  <td>{(r.score * 100).toFixed(1)}%</td>
                  <td style={{ maxWidth: 480 }}>{r.explanation}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-secondary">
                    No reports available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
