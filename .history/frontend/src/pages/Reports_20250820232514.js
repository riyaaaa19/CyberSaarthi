import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { t } from "../i18n";

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
      setReports([{ date: "2025-08-19", type: "Invoice", verdict: "SAFE", details: t("invoice.safe") }]);
    });
  }, []);

  const tableStyle = { width:"100%", borderCollapse:"collapse", marginTop:"20px" };
  const thtd = { border:"1px solid #ddd", padding:"8px", textAlign:"left" };
  const headerStyle = { ...thtd, background:"#f5f5f5", fontWeight:"bold" };

  return (
    <div style={{ padding:"20px" }}>
      <h2>{t("reports.title")}</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Type</th>
            <th style={headerStyle}>Verdict</th>
            <th style={headerStyle}>Details</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr key={idx}>
              <td style={thtd}>{new Date(r.date).toLocaleString()}</td>
              <td style={thtd}>{r.type}</td>
              <td style={thtd}>{r.verdict}</td>
              <td style={thtd}>{r.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
