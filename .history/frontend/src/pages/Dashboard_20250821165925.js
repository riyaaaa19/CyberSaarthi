import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useT } from "../i18n";
import { useContext } from "react";
import { ThemeLangContext } from "../ThemeLangContext";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

function Dashboard() {
  const t = useT(); // ✅ hook for translations
  const { theme } = useContext(ThemeLangContext);

  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ safe: 0, suspicious: 0, malicious: 0, total: 0 });

  useEffect(() => {
    getHistory(50, 0)
      .then((page) => {
        const items = page.items || [];
        setHistory(items);

        const counts = { SAFE: 0, SUSPICIOUS: 0, MALICIOUS: 0 };
        items.forEach((it) => {
          counts[it.verdict] = (counts[it.verdict] || 0) + 1;
        });

        setSummary({
          safe: counts.SAFE || 0,
          suspicious: counts.SUSPICIOUS || 0,
          malicious: counts.MALICIOUS || 0,
          total: items.length,
        });
      })
      .catch(() => {
        // fallback dummy data
        setSummary({ safe: 8, suspicious: 3, malicious: 1, total: 12 });
      });
  }, []);

  const doughnutData = {
    labels: [t("dashboard.total"), t("dashboard.susp"), t("dashboard.mal")],
    datasets: [
      {
        data: [summary.safe, summary.suspicious, summary.malicious],
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"],
      },
    ],
  };

  const lineData = {
    labels: history.slice(0, 7).map((h) => new Date(h.created_at).toLocaleDateString()),
    datasets: [
      {
        data: history.slice(0, 7).map((_, i) => i + 1),
        label: t("dashboard.total"),
        borderColor: "#2196f3",
        tension: 0.3,
      },
    ],
  };

  const cardStyle = {
    flex: 1,
    margin: "10px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#f5f5f5" : "#000",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("dashboard.title")}</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h4>{t("dashboard.total")}</h4>
          <h2>{summary.total}</h2>
        </div>
        <div style={cardStyle}>
          <h4>{t("dashboard.susp")}</h4>
          <h2>{summary.suspicious}</h2>
        </div>
        <div style={cardStyle}>
          <h4>{t("dashboard.mal")}</h4>
          <h2>{summary.malicious}</h2>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "40px" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          <Doughnut data={doughnutData} />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
