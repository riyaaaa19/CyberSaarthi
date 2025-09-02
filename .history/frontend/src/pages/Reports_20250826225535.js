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

  // ✅ Explanation Translator
  const formatExplanation = (explanation, scanType, verdict) => {
    if (!explanation) return "";

    // If backend sends explanation as array → join it
    let expText = Array.isArray(explanation) ? explanation.join("\n") : explanation;

    // --- Email explanations ---
    if (scanType === "email") {
      expText = expText.replace(
        /Email appears safe\.|ईमेल सुरक्षित प्रतीत होता है।/g,
        t("explanation.safe")
      );
      expText = expText.replace(
        /Suspicious indicators found \(possible phishing\)\.|संदिग्ध संकेत मिले \(संभावित फ़िशिंग\)।/g,
        t("explanation.suspicious")
      );
      expText = expText.replace(
        /High-risk indicators found \(likely phishing\)\.|उच्च-जोखिम वाले फ़िशिंग शब्द शामिल हैं/g,
        t("explanation.malicious")
      );
    }

    // --- Invoice explanations ---
    if (scanType === "invoice" || scanType === "invoice_file") {
      expText = expText.replace(
        /Invoice looks consistent\.|इनवॉइस सही लग रहा है।/g,
        t("explanation.invoice.consistent")
      );
      expText = expText.replace(
        /Missing explicit total amount|कुल राशि अनुपस्थित/g,
        t("explanation.invoice.missingTotal")
      );
      expText = expText.replace(
        /Bank details without GSTIN reference|जीएसटीआईएन संदर्भ के बिना बैंक विवरण/g,
        t("explanation.invoice.bankDetails")
      );
      expText = expText.replace(
        /Account number present but vendor context unclear|खाता संख्या मौजूद है लेकिन विक्रेता स्पष्ट नहीं/g,
        t("explanation.invoice.accountNumber")
      );
    }

    // --- Technical parts ---
    expText = expText.replace(/ML score|एमएल स्कोर/g, t("explanation.mlScore"));
    expText = expText.replace(/Suspicious domain|संदिग्ध डोमेन/g, t("explanation.suspiciousDomain"));

    return expText;
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
                    {formatExplanation(r.explanation, r.scan_type, r.verdict)}
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
