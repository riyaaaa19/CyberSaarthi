import React, { useEffect, useState } from "react";
import { useT } from "../i18n";

function Reports() {
  const [reports, setReports] = useState([]);
  const theme = localStorage.getItem("THEME") || "light";
  const t = useT();

  useEffect(() => {
    fetch("http://localhost:8000/v1/reports/history", {
      headers: { "x-api-key": "changeme-demo-key" },
    })
      .then((res) => res.json())
      .then((data) => setReports(data.items)) // ✅ history returns { items, total, limit, offset }
      .catch(() => console.log("⚠️ Could not load reports from backend"));
  }, []);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    background: theme === "dark" ? "#333" : "#f5f5f5",
    textAlign: "left",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "10px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("reports.title")}</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>
              {t("scanner.emailTab")}/{t("scanner.invoiceTab")}
            </th>
            <th style={thStyle}>{t("dashboard.safe")}</th>
            <th style={thStyle}>{t("dashboard.susp")}</th>
            <th style={thStyle}>{t("dashboard.mal")}</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.scan_type}</td>
                <td style={tdStyle}>
                  {r.verdict === "SAFE" ? t("email.safe") : ""}
                </td>
                <td style={tdStyle}>
                  {r.verdict === "SUSPICIOUS" ? t("email.susp") : ""}
                </td>
                <td style={tdStyle}>
                  {r.verdict === "MALICIOUS" ? t("email.mal") : ""}
                </td>
                <td style={tdStyle}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan="5">
                ⚠️ No reports available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
