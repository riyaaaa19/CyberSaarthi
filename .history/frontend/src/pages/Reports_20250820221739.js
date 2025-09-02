import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getHistory(50,0).then((page) => {
      const mapped = (page.items || []).map(it => ({
        date: it.created_at,
        type: it.scan_type,
        verdict: it.verdict,
        details: it.explanation
      }));
      setReports(mapped);
    }).catch(() => {
      setReports([{ date: "2025-08-19", type: "Invoice", verdict: "SAFE", details: "Demo entry" }]);
    });
  }, []);

  return (
    <div>
      <h3>Threat Reports</h3>
      <table className="table table-striped">
        <thead>
          <tr><th>Date</th><th>Type</th><th>Verdict</th><th>Details</th></tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr key={idx}>
              <td>{new Date(r.date).toLocaleString()}</td>
              <td>{r.type}</td>
              <td>{r.verdict}</td>
              <td>{r.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
