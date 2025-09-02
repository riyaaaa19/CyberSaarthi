import React, { useEffect, useState } from "react";
import { useT } from "../i18n";

function Reports() {
  const [reports, setReports] = useState([]);
  const theme = localStorage.getItem("THEME") || "light";
  const t = useT(); // ✅ use hook instead of direct import

  useEffect(() => {
    fetch("http://localhost:8000/v1/reports", {
      headers: { "x-api-key": "changeme-demo-key" }
    })
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => console.log("⚠️ Could not load reports from backend"));
  }, []);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000"
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    background: theme === "dark" ? "#333" : "#f5f5f5",
    textAlign: "left"
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "10px"
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
            <th style={thStyle}>{t("dashboard.total")}</th>
            <th style={thStyle}>{t("dashboard.susp")}</th>
            <th style={thStyle}>{t("dashboard.mal")}</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.type}</td>
                <td style={tdStyle}>
                  {r.verdict === "safe" ? t("email.safe") : ""}
                </td>
                <td style={tdStyle}>
                  {r.verdict === "susp" ? t("email.susp") : ""}
                </td>
                <td style={tdStyle}>
                  {r.verdict === "mal" ? t("email.mal") : ""}
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
