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
      .then((data) => setReports(data.items))
      .catch(() => console.log("⚠️ Could not load reports from backend"));
  }, []);

  const formatScanType = (scanType) => {
    if (scanType === "email") return t("scanner.emailTab");
    if (scanType === "invoice" || scanType === "invoice_file")
      return t("scanner.invoiceTab");
    return scanType;
  };

  const formatVerdict = (verdict, scanType) => {
    if (!verdict) return verdict;
    const keyPrefix = scanType === "email" ? "email" : "invoice";
    return t(`${keyPrefix}.${verdict.toLowerCase()}`) || verdict;
  };

  // ✅ Explanation Translator (handles English/Hindi properly)
  const formatExplanation = (explanation, scanType, verdict) => {
    if (!explanation) return [];

    let list = Array.isArray(explanation)
      ? explanation
      : explanation.split(/;|\|/).map((e) => e.trim());

    return list.map((e) => {
      // Email cases
      if (scanType === "email") {
        if (e.toLowerCase().includes("safe"))
          return t("explanation.safe");
        if (e.toLowerCase().includes("suspicious indicators"))
          return t("explanation.suspicious");
        if (e.toLowerCase().includes("high-risk"))
          return t("explanation.malicious");
      }

      // Invoice cases
      if (scanType === "invoice" || scanType === "invoice_file") {
        if (e.includes("Invoice looks consistent"))
          return t("explanation.invoice.consistent");
        if (e.includes("Missing explicit total amount"))
          return t("explanation.invoice.missingTotal");
        if (e.includes("Bank details without GSTIN reference"))
          return t("explanation.invoice.bankDetails");
        if (e.includes("Account number present"))
          return t("explanation.invoice.accountNumber");
      }

      // Technical cases
      if (e.toLowerCase().includes("ml score")) {
        const val = e.split(":").pop().trim();
        return `${t("explanation.mlScore")}: ${val}`;
      }

      if (e.toLowerCase().includes("domain")) {
        const domain = e.split(":").pop().trim();
        return `${t("explanation.suspiciousDomainFound")}: ${domain}`;
      }

      if (e.toLowerCase().includes("term")) {
        const num = e.match(/\d+/)?.[0] || "0";
        return t("explanation.containsTerms", { count: num });
      }

      return e; // fallback raw text
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        background: theme === "dark" ? "#121212" : "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          marginBottom: "15px",
          color: theme === "dark" ? "#fff" : "#333",
        }}
      >
        {t("reports.title")}
      </h2>

      <div
        style={{
          background: theme === "dark" ? "#1e1e1e" : "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#f4f6f8",
              }}
            >
              <th style={headerStyle}>#</th>
              <th style={headerStyle}>
                {t("scanner.emailTab")}/{t("scanner.invoiceTab")}
              </th>
              <th style={headerStyle}>{t("dashboard.verdict")}</th>
              <th style={headerStyle}>{t("dashboard.score")}</th>
              <th style={headerStyle}>{t("dashboard.explanation")}</th>
              <th style={headerStyle}>{t("dashboard.date")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor:
                      i % 2 === 0
                        ? theme === "dark"
                          ? "#1a1a1a"
                          : "#ffffff"
                        : theme === "dark"
                        ? "#2a2a2a"
                        : "#f9f9f9",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      theme === "dark" ? "#333" : "#eef5ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      i % 2 === 0
                        ? theme === "dark"
                          ? "#1a1a1a"
                          : "#ffffff"
                        : theme === "dark"
                        ? "#2a2a2a"
                        : "#f9f9f9")
                  }
                >
                  <td style={cellStyle}>{i + 1}</td>
                  <td style={cellStyle}>{formatScanType(r.scan_type)}</td>
                  <td
                    style={{
                      ...cellStyle,
                      fontWeight: "600",
                      color:
                        r.verdict === "SAFE"
                          ? "green"
                          : r.verdict === "SUSPICIOUS"
                          ? "#ff9800"
                          : "red",
                    }}
                  >
                    {formatVerdict(r.verdict, r.scan_type)}
                  </td>
                  <td style={cellStyle}>{(r.score * 100).toFixed(1)}%</td>
                  <td
                    style={{
                      ...cellStyle,
                      maxWidth: "250px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {formatExplanation(r.explanation, r.scan_type, r.verdict).map(
                      (line, idx) => (
                        <div key={idx}>• {line}</div>
                      )
                    )}
                  </td>
                  <td style={cellStyle}>
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  style={{
                    ...cellStyle,
                    textAlign: "center",
                    padding: "20px",
                  }}
                  colSpan="6"
                >
                  {t("dashboard.noReports")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
};

export default Reports;
