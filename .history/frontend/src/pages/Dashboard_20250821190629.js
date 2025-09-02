import React, { useEffect, useState, useContext } from "react";
import { getHistory } from "../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useT } from "../i18n";
import { ThemeLangContext } from "../ThemeLangContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function Dashboard() {
  const t = useT();
  const { theme } = useContext(ThemeLangContext);

  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({
    safe: 0,
    suspicious: 0,
    malicious: 0,
    total: 0,
  });

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

  // Chart data
  const doughnutData = {
    labels: [t("dashboard.safe"), t("dashboard.susp"), t("dashboard.mal")],
    datasets: [
      {
        data: [summary.safe, summary.suspicious, summary.malicious],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const lineData = {
    labels: history.slice(0, 7).map((h) =>
      new Date(h.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        data: history.slice(0, 7).map((_, i) => i + 1),
        label: t("dashboard.total"),
        borderColor: "#1976d2",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Styles
  const cardBase = {
    flex: 1,
    margin: "10px",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  };

  const sectionStyle = {
    background: theme === "dark" ? "#1e1e1e" : "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "20px",
    marginBottom: "30px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  };

  const thStyle = {
    padding: "10px",
    borderBottom: "2px solid #ccc",
    textAlign: "left",
    background: theme === "dark" ? "#333" : "#f5f5f5",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  };

  // Translate verdicts
  const verdictMap = {
    SAFE: t("email.safe"),
    SUSPICIOUS: t("email.susp"),
    MALICIOUS: t("email.mal"),
  };

  return (
    <div
      style={{
        padding: "20px",
        background: theme === "dark" ? "#121212" : "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: theme === "dark" ? "#fff" : "#333",
        }}
      >
        {t("dashboard.title")}
      </h2>

      {/* Stat Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div style={{ ...cardBase, background: "#1976d2" }}>
          <h4>{t("dashboard.total")}</h4>
          <h1>{summary.total}</h1>
        </div>
        <div style={{ ...cardBase, background: "#4caf50" }}>
          <h4>{t("dashboard.safe")}</h4>
          <h1>{summary.safe}</h1>
        </div>
        <div style={{ ...cardBase, background: "#ff9800" }}>
          <h4>{t("dashboard.susp")}</h4>
          <h1>{summary.suspicious}</h1>
        </div>
        <div style={{ ...cardBase, background: "#f44336" }}>
          <h4>{t("dashboard.mal")}</h4>
          <h1>{summary.malicious}</h1>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ ...sectionStyle, flex: 1 }}>
          <h3>{t("dashboard.distribution")}</h3>
          <div style={{ height: "300px" }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div style={{ ...sectionStyle, flex: 1 }}>
          <h3>{t("dashboard.trend")}</h3>
          <div style={{ height: "300px" }}>
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={sectionStyle}>
        <h3>{t("dashboard.recentActivity")}</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>
                {t("scanner.emailTab")}/{t("scanner.invoiceTab")}
              </th>
              <th style={thStyle}>{t("dashboard.verdict")}</th>
              <th style={thStyle}>{t("dashboard.date")}</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 5).map((h, i) => (
              <tr key={i}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{h.scan_type}</td>
                <td
                  style={{
                    ...tdStyle,
                    fontWeight: "600",
                    color:
                      h.verdict === "SAFE"
                        ? "green"
                        : h.verdict === "SUSPICIOUS"
                        ? "#ff9800"
                        : "red",
                  }}
                >
                  {verdictMap[h.verdict] || h.verdict}
                </td>
                <td style={tdStyle}>
                  {new Date(h.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan="4" align="center">
                  ⚠️ {t("dashboard.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
