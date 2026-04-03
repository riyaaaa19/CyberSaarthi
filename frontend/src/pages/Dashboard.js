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
          const cleanVerdict = normalizeVerdict(it.verdict);
          counts[cleanVerdict] = (counts[cleanVerdict] || 0) + 1;
        });

        setSummary({
          safe: counts.SAFE || 0,
          suspicious: counts.SUSPICIOUS || 0,
          malicious: counts.MALICIOUS || 0,
          total: items.length,
        });
      })
      .catch((err) => {
        console.error("Failed to load dashboard history:", err);
        // Show empty state instead of dummy data
        setSummary({ safe: 0, suspicious: 0, malicious: 0, total: 0 });
      });
  }, []);

  // 🔹 Normalize API verdict values like "email.malicious" → "MALICIOUS"
  const normalizeVerdict = (verdict) => {
    if (!verdict) return "";
    const v = verdict.toUpperCase();
    if (v.includes("SAFE")) return "SAFE";
    if (v.includes("SUSPICIOUS")) return "SUSPICIOUS";
    if (v.includes("MALICIOUS")) return "MALICIOUS";
    return verdict;
  };

  // Chart data
  const doughnutData = {
    labels: [
      t("dashboard.safe"),
      t("dashboard.suspicious"),
      t("dashboard.malicious"),
    ],
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
    padding: "24px",
    borderRadius: "16px",
    color: "#ffffff",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  };

  const sectionStyle = {
    background: theme === "dark" ? "#1e1e1e" : "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "24px",
    marginBottom: "32px",
    border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  };

  const thStyle = {
    padding: "16px",
    borderBottom: "2px solid #e5e7eb",
    textAlign: "left",
    background: theme === "dark" ? "#374151" : "#f9fafb",
    fontWeight: "600",
    fontSize: "14px",
    color: theme === "dark" ? "#f3f4f6" : "#374151",
  };

  const tdStyle = {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: theme === "dark" ? "#d1d5db" : "#6b7280",
  };

  // ✅ Translate verdicts
const verdictMap = {
  SAFE: t("email.safe"),
  SUSPICIOUS: t("email.suspicious"),
  MALICIOUS: t("email.malicious"),
};

  // ✅ Translate scan_type (email / invoice)
  const scanTypeMap = {
    email: t("scanner.emailTab"),
    invoice: t("scanner.invoiceTab"),
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">
          {t("dashboard.heading")}
        </h1>
        <p className="dashboard-subtitle">
          Monitor and analyze security threats in real-time
        </p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stat-grid">
        <div
          style={{
            ...cardBase,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            ":hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "8px" }}>
            {t("dashboard.total")}
          </div>
          <div style={{ fontSize: "48px", fontWeight: "700" }}>
            {summary.total}
          </div>
        </div>

        <div
          style={{
            ...cardBase,
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "8px" }}>
            {t("dashboard.safe")}
          </div>
          <div style={{ fontSize: "48px", fontWeight: "700" }}>
            {summary.safe}
          </div>
        </div>

        <div
          style={{
            ...cardBase,
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "8px" }}>
            {t("dashboard.suspicious")}
          </div>
          <div style={{ fontSize: "48px", fontWeight: "700" }}>
            {summary.suspicious}
          </div>
        </div>

        <div
          style={{
            ...cardBase,
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "8px" }}>
            {t("dashboard.malicious")}
          </div>
          <div style={{ fontSize: "48px", fontWeight: "700" }}>
            {summary.malicious}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-chart-grid">
        <div style={sectionStyle}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2563eb"
            }}></div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: theme === "dark" ? "#f3f4f6" : "#111827",
              margin: 0
            }}>
              {t("dashboard.distribution")}
            </h3>
          </div>
          <div style={{ height: "320px" }}>
            <Doughnut data={doughnutData} options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                  }
                }
              }
            }} />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#7c3aed"
            }}></div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: theme === "dark" ? "#f3f4f6" : "#111827",
              margin: 0
            }}>
              {t("dashboard.trend")}
            </h3>
          </div>
          <div style={{ height: "320px" }}>
            <Line data={lineData} options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false
                  }
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: theme === "dark" ? "#374151" : "#e5e7eb"
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={sectionStyle}>
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px"
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#059669"
          }}></div>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "600",
            color: theme === "dark" ? "#f3f4f6" : "#111827",
            margin: 0
          }}>
            {t("dashboard.recentActivity")}
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 8).map((h, i) => {
                const cleanVerdict = normalizeVerdict(h.verdict);
                return (
                  <tr key={i} style={{
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.closest('tr').style.background = theme === "dark" ? "#374151" : "#f9fafb"}
                  onMouseLeave={(e) => e.target.closest('tr').style.background = "transparent"}
                  >
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: theme === "dark" ? "#374151" : "#f3f4f6",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}>
                        {scanTypeMap[h.scan_type] || h.scan_type}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: cleanVerdict === "SAFE" ? "#dcfce7" :
                                   cleanVerdict === "SUSPICIOUS" ? "#fef3c7" : "#fee2e2",
                        color: cleanVerdict === "SAFE" ? "#166534" :
                               cleanVerdict === "SUSPICIOUS" ? "#92400e" : "#991b1b",
                      }}>
                        {verdictMap[cleanVerdict] || cleanVerdict}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(h.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, textAlign: "center", padding: "48px" }} colSpan="4">
                    <div style={{
                      color: theme === "dark" ? "#6b7280" : "#9ca3af",
                      fontSize: "16px"
                    }}>
                      No recent activity
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
