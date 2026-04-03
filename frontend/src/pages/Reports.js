import React, { useEffect, useState, useContext } from "react";
import { useT } from "../i18n";
import { ThemeLangContext } from "../ThemeLangContext";
import { getHistory } from "../services/api";

function Reports() {
  const { theme, lang } = useContext(ThemeLangContext); // ✅ centralized
  const t = useT();
  const [reports, setReports] = useState([]);
  const [filterVerdic, setFilterVerdic] = useState("ALL");

  useEffect(() => {
    getHistory(1000, 0)
      .then((data) => setReports(data.items || []))
      .catch(() => console.log("⚠️ Could not load reports from backend"));
  }, []);

  const formatScanType = (scanType) => {
    if (scanType === "email") return t("scanner.emailTab");
    if (scanType === "invoice" || scanType === "invoice_file")
      return t("scanner.invoiceTab");
    return scanType;
  };

  // Verdict localization mapping
  const verdictMap = {
    SAFE: t("verdict.safe"),
    SUSPICIOUS: t("verdict.suspicious"),
    MALICIOUS: t("verdict.malicious"),
  };
  const formatVerdict = (verdict) => verdictMap[verdict] || verdict;

  const summaryStats = reports.reduce(
    (acc, r) => {
      const key = (r.verdict || "").toUpperCase();
      if (key === "SAFE") acc.safe += 1;
      else if (key === "SUSPICIOUS") acc.suspicious += 1;
      else if (key === "MALICIOUS") acc.malicious += 1;
      return acc;
    },
    { safe: 0, suspicious: 0, malicious: 0 }
  );

  const totalReports = reports.length;

  // Filter reports based on selected verdict
  const filteredReports = filterVerdic === "ALL" 
    ? reports 
    : reports.filter(r => (r.verdict || "").toUpperCase() === filterVerdic);

  const filteredCount = filteredReports.length;

  // ✅ Explanation Translator
  const formatExplanation = (explanation, scanType, verdict) => {
    if (!explanation) return [];

    let expText = explanation;
    if (typeof explanation === "object" && explanation !== null) {
      expText =
        typeof explanation[lang] === "string"
          ? explanation[lang]
          : typeof explanation["en"] === "string"
          ? explanation["en"]
          : "";
    } else if (typeof explanation !== "string") {
      expText = String(explanation);
    }

    let list = Array.isArray(expText)
      ? expText
      : String(expText).split(/;|\|/).map((e) => e.trim());

    return list
      .filter((e) => typeof e === "string")
      .map((e) => {
        // Email cases
        if (scanType === "email") {
          if (e.toLowerCase().includes("safe")) return t("explanation.safe");
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

  const displayReportsHeader = t("reports.title");
  const displayReportsSubtitle =
    t("reports.subtitle") !== "reports.subtitle"
      ? t("reports.subtitle")
      : "Visualize your past scanning history with insights";
  const displayHistoryHeading =
    t("reports.history") !== "reports.history" ? t("reports.history") : "Recent Scan History";
  const displayAnnotationHeading =
    t("reports.annotation") !== "reports.annotation"
      ? t("reports.annotation")
      : "Here is an easy overview of your latest scan details";

  // Verdict badge styling
  const getVerdictBadgeStyle = (verdict) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    };

    if (verdict === "SAFE") {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#ffffff",
      };
    } else if (verdict === "SUSPICIOUS") {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#ffffff",
      };
    } else if (verdict === "MALICIOUS") {
      return {
        ...baseStyle,
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "#ffffff",
      };
    }
    return baseStyle;
  };

  // Filter dropdown styling
  const filterDropdownStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: theme === "dark" 
      ? "1px solid rgba(148, 163, 184, 0.2)" 
      : "1px solid rgba(148, 163, 184, 0.3)",
    background: theme === "dark" 
      ? "rgba(30, 41, 59, 0.8)" 
      : "rgba(248, 250, 252, 0.8)",
    color: theme === "dark" ? "#e2e8f0" : "#1e293b",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  return (
    <div className={`reports-page ${theme === "dark" ? "dark" : "light"}`}>
      <header className="reports-header">
        <h2>{displayReportsHeader || "Reports"}</h2>
        <p>{displayReportsSubtitle}</p>
      </header>

      <section className="reports-stats-grid">
        <article className="report-card total-card">
          <h3>{t("reports.totalScans") || "Total Scans"}</h3>
          <p>{totalReports}</p>
        </article>
        <article className="report-card safe-card">
          <h3>{t("verdict.safe")}</h3>
          <p>{summaryStats.safe}</p>
        </article>
        <article className="report-card suspicious-card">
          <h3>{t("verdict.suspicious")}</h3>
          <p>{summaryStats.suspicious}</p>
        </article>
        <article className="report-card malicious-card">
          <h3>{t("verdict.malicious")}</h3>
          <p>{summaryStats.malicious}</p>
        </article>
      </section>

      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>{displayHistoryHeading}</h3>
          <span>{displayAnnotationHeading}</span>
        </div>

        {/* Filter Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <label style={{
              fontSize: "14px",
              fontWeight: "500",
              color: theme === "dark" ? "#cbd5e1" : "#475569",
            }}>
              {t("reports.filterByVerdict") || "Filter by Verdict:"}
            </label>
            <select
              value={filterVerdic}
              onChange={(e) => setFilterVerdic(e.target.value)}
              style={filterDropdownStyle}
            >
              <option value="ALL">{t("reports.allReports") || "All Reports"}</option>
              <option value="SAFE">{t("verdict.safe")}</option>
              <option value="SUSPICIOUS">{t("verdict.suspicious")}</option>
              <option value="MALICIOUS">{t("verdict.malicious")}</option>
            </select>
          </div>

          {/* Result Count */}
          <div style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: theme === "dark" 
              ? "rgba(79, 70, 229, 0.15)" 
              : "rgba(79, 70, 229, 0.1)",
            color: theme === "dark" ? "#a78bfa" : "#4f46e5",
            fontSize: "13px",
            fontWeight: "600",
          }}>
            {filteredCount} {filteredCount === 1 ? t("reports.result") || "Result" : t("reports.results") || "Results"}
          </div>
        </div>

        <div className="reports-table-wrapper">

        <table className="reports-table">
          <thead>
            <tr
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#f4f6f8",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              <th style={headerStyle}>#</th>
              <th style={headerStyle}>Email / Invoice</th>
              <th style={headerStyle}>Verdict</th>
              <th style={headerStyle}>Risk Score</th>
              <th style={headerStyle}>Explanation</th>
              <th style={headerStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((r, i) => (
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
                    color: theme === "dark" ? "#ddd" : "#333",
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
                  <td style={cellStyle}>
                    <div style={getVerdictBadgeStyle(r.verdict)}>
                      {formatVerdict(r.verdict)}
                    </div>
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
                    color: theme === "dark" ? "#ccc" : "#333",
                  }}
                  colSpan="6"
                >
                  {filterVerdic === "ALL" 
                    ? t("dashboard.noReports")
                    : `${t("reports.noResultsFor") || "No"} ${filterVerdic.toLowerCase()} ${t("reports.resultsFound") || "results found"}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </section>
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
