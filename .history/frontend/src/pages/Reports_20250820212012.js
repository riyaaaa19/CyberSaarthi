import React, { useEffect, useState } from "react";
import { getReports } from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports().then(setReports).catch(() =>
      setReports([{ date: "2025-08-19", type: "Invoice", verdict: "SAFE", details: "Demo entry" }])
    );
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
              <td>{r.date}</td>
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
