import React, { useState, useContext, useEffect } from "react";
import { useT } from "../i18n";
import { ThemeLangContext } from "../ThemeLangContext";

function Scanner() {
  const t = useT();
  const { theme } = useContext(ThemeLangContext);

  const [activeTab, setActiveTab] = useState("email");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  // ✅ Reset textarea + result when switching tab
  useEffect(() => {
    setInput("");
    setResult(null);
  }, [activeTab]);

  // styles
  const boxStyle = {
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const tabStyle = (tab) => ({
    padding: "10px 15px",
    cursor: "pointer",
    borderBottom:
      activeTab === tab
        ? `3px solid ${theme === "dark" ? "#90caf9" : "#2196f3"}`
        : "3px solid transparent",
    fontWeight: activeTab === tab ? "bold" : "normal",
    color: theme === "dark" ? "#f5f5f5" : "#000",
  });

  const buttonStyle = {
    marginTop: "10px",
    padding: "8px 15px",
    background: theme === "dark" ? "#90caf9" : "#2196f3",
    color: theme === "dark" ? "#000" : "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  // 🔔 Browser notification function
  function showNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }

  const handleScan = async () => {
    if (!input.trim()) {
      setResult({ verdict: "⚠️", explanation: "Please paste some text first." });
      return;
    }

    setResult({ verdict: "⏳", explanation: "Scanning..." });

    const endpoint =
      activeTab === "email"
        ? "http://localhost:8000/v1/scan/email"
        : "http://localhost:8000/v1/scan/invoice";

    const body =
      activeTab === "email"
        ? { email_text: input, lang: "en" }
        : { invoice_text: input, lang: "en" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": localStorage.getItem("API_KEY") || "changeme-demo-key",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResult(data);

      showNotification("Scan Result", `${data.verdict} - ${data.explanation}`);
    } catch (err) {
      console.error(err);
      setResult({ verdict: "ERROR", explanation: "⚠️ Error scanning. Check backend." });
      showNotification("Scan Error", "Could not reach backend.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("scanner.title")}</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={tabStyle("email")} onClick={() => setActiveTab("email")}>
          {t("scanner.emailTab")}
        </div>
        <div style={tabStyle("invoice")} onClick={() => setActiveTab("invoice")}>
          {t("scanner.invoiceTab")}
        </div>
      </div>

      {/* Input box */}
      <div style={boxStyle}>
        <textarea
          placeholder={
            activeTab === "email"
              ? "✉️ Paste email text here..."
              : t("invoice.paste")
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: theme === "dark" ? "#2c2c2c" : "#fff",
            color: theme === "dark" ? "#f5f5f5" : "#000",
          }}
        />
        <button onClick={handleScan} style={buttonStyle}>
          {activeTab === "email" ? `📧 ${t("invoice.scanEmail")}` : t("invoice.scanText")}
        </button>

      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            color: theme === "dark" ? "#90caf9" : "#444",
          }}
        >
          <p><b>Verdict:</b> {result.verdict}</p>
          <p><b>Score:</b> {result.score ?? "N/A"}</p>
          <p><b>Explanation:</b> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Scanner;
