import React, { useEffect, useMemo, useState } from "react";
import { endpoints, ThreatItem } from "../api";

export default function Reports() {
  const [items, setItems] = useState<ThreatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<"" | "high" | "medium" | "low">("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await endpoints.reportsList();
        setItems(res.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesRisk = risk ? i.risk === risk : true;
      const matchesQ = q
        ? [i.title, i.type, i.risk, i.timestamp].join(" ").toLowerCase().includes(q.toLowerCase())
        : true;
      return matchesRisk && matchesQ;
    });
  }, [items, q, risk]);

  return (
    <div className="container py-4">
      <div className="p-4 bg-white" style={{ borderRadius: 16, border: "1px solid #eee", boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
        <div className="d-flex flex-wrap gap-2 align-items-end">
          <div>
            <label className="form-label small text-muted">Search</label>
            <input className="form-control" placeholder="Search threats..." value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <div>
            <label className="form-label small text-muted">Risk</label>
            <select className="form-select" value={risk} onChange={(e)=>setRisk(e.target.value as any)}>
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="ms-auto small text-muted">{filtered.length} / {items.length} shown</div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>Risk</th>
                <th>Title</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-muted">No threats found.</td></tr>
              ) : (
                filtered.map((r) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
