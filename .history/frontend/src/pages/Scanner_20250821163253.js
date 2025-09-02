import React, { useState } from "react";
import { t } from "../i18n";

function Scanner() {
  const [activeTab, setActiveTab] = useState("email");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const boxStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    marginTop: "20px"
  };

  const tabStyle = (tab) => ({
    padding: "10px 15px",
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid #2196f3" : "3px solid transparent",
    fontWeight: activeTab === tab ? "bold" : "normal"
  });

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
    setResult("Scanning...");

    const endpoint =
      activeTab === "email"
        ? "http://localhost:8000/v1/scan/email"
        : "http://localhost:8000/v1/scan/invoice";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "changeme-demo-key"
        },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      const verdict = data.verdict || "Unknown";
      setResult(t(`${activeTab}.${verdict}`));

      // 🔔 Send browser notification
      showNotification("Scan Result", t(`${activeTab}.${verdict}`));
    } catch (err) {
      setResult("Error scanning. Check backend.");
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
          placeholder={activeTab === "email" ? "Paste email text here..." : t("invoice.paste")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", height: "150px", padding: "10px" }}
        />
        <br />
        <button
          onClick={handleScan}
          style={{
            marginTop: "10px",
            padding: "8px 15px",
            background: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {activeTab === "email" ? "Scan Email" : t("invoice.scanText")}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px", fontWeight: "bold", color: "#444" }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default Scanner;
