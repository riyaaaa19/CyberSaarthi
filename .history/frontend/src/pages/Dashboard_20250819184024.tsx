import React, { useEffect, useState } from "react";
import { endpoints, ReportsSummary } from "../api";
import { Link } from "react-router-dom";

const card: React.CSSProperties = { borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" };

function Stat({ label, value, variant }: { label: string; value: number | string; variant: "primary"|"warning"|"danger"|"success" }) {
  const color = {
    primary: "#0d6efd",
    warning: "#fd7e14",
    danger: "#dc3545",
    success: "#198754",
  }[variant];

  return (
    <div className="col-6 col-md-3">
      <div className="p-3" style={{ ...card }}>
        <div className="text-muted small">{label}</div>
        <div className="display-6 fw-bold" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await endpoints.reportsSummary();
        setSummary(res.data);
      } catch {
        // ignore for now; show empty state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = summary?.totals || { high: 0, medium: 0, low: 0 };
  const totalThreats = totals.high + totals.medium + totals.low;

  const bar = (value: number, color: string) => (
    <div className="progress" style={{ height: 10 }}>
      <div className="progress-bar" role="progressbar" style={{ width: `${value}%`, background: color }}></div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="p-4 bg-white" style={{ ...card }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Security Posture</h5>
              <Link to="/reports" className="btn btn-sm btn-outline-secondary">View all reports</Link>
            </div>

            <div className="row g-3">
              <Stat label="Total Threats" value={totalThreats} variant="primary" />
              <Stat label="High Risk" value={totals.high} variant="danger" />
              <Stat label="Medium Risk" value={totals.medium} variant="warning" />
              <Stat label="Low Risk" value={totals.low} variant="success" />
            </div>

            <div className="mt-4">
              <div className="mb-2 small text-muted">Risk Distribution</div>
              {bar(totalThreats ? (totals.high / totalThreats) * 100 : 0, "#dc3545")}
              <div className="mt-1 small text-muted">High</div>
              {bar(totalThreats ? (totals.medium / totalThreats) * 100 : 0, "#fd7e14")}
              <div className="mt-1 small text-muted">Medium</div>
              {bar(totalThreats ? (totals.low / totalThreats) * 100 : 0, "#198754")}
              <div className="mt-1 small text-muted">Low</div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="p-4 bg-white h-100" style={{ ...card }}>
            <h5>Quick Actions</h5>
            <div className="d-grid gap-2 mt-3">
              <Link to="/scan/phishing" className="btn btn-primary">Scan for Phishing</Link>
              <Link to="/scan/invoice" className="btn btn-outline-primary">Check Invoice (Manual)</Link>
              <Link to="/scan/upload-invoice" className="btn btn-outline-secondary">Upload Invoice</Link>
            </div>
            <div className="mt-4 small text-muted">
              Works offline; syncs when online. Set your <Link to="/settings">Base URL & API key</Link>.
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white" style={{ ...card }}>
        <h5>Latest Threats</h5>
        {loading && <div className="text-muted">Loading...</div>}
        {!loading && (!summary?.recent?.length ? (
          <div className="text-muted">No recent threats.</div>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Risk</th>
                  <th>Title</th>
                  <th>Detected At</th>
                </tr>
              </thead>
              <tbody>
                {summary!.recent.map((r) => (
                  <tr key={r.id}>
                    <td className="text-capitalize">{r.type}</td>
                    <td>
                      <span className={`badge text-bg-${
                        r.risk === "high" ? "danger" : r.risk === "medium" ? "warning" : "success"
                      }`}>{r.risk}</span>
                    </td>
                    <td>{r.title}</td>
                    <td>{new Date(r.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
