import React, { useState, useEffect } from "react";
import { t } from "../i18n";

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, susp: 0, mal: 0 });
  const theme = localStorage.getItem("THEME") || "light";

  useEffect(() => {
    // Fetch stats from backend API
    fetch("http://localhost:8000/v1/stats", {
      headers: { "x-api-key": "changeme-demo-key" }
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log("⚠️ Backend not reachable, showing default stats"));
  }, []);

  const cardStyle = {
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("dashboard.title")}</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>{t("dashboard.total")}</h3>
          <p>{stats.total}</p>
        </div>
        <div style={cardStyle}>
          <h3>{t("dashboard.susp")}</h3>
          <p>{stats.susp}</p>
        </div>
        <div style={cardStyle}>
          <h3>{t("dashboard.mal")}</h3>
          <p>{stats.mal}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
