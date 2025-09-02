import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ SAFE: 0, SUSPICIOUS: 0, MALICIOUS: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/v1/reports/summary")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load reports."));
  }, []);

  const container: React.CSSProperties = {
    padding: "20px",
    animation: "fadeIn 0.6s ease-in-out",
  };

  const title: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#0B1930",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  };

  const card = (color: string): React.CSSProperties => ({
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.2s ease",
    borderTop: `4px solid ${color}`,
  });

  const cardTitle: React.CSSProperties = {
    fontSize: "14px",
    color: "#5B6B7C",
    marginBottom: "8px",
  };

  const cardValue = (color: string): React.CSSProperties => ({
    fontSize: "28px",
    fontWeight: 700,
    color,
  });

  const reports: React.CSSProperties = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    minHeight: "120px",
  };

  return (
    <div style={container}>
      <h2 style={title}>Dashboard Overview</h2>

      <div style={grid}>
        <div style={card("#1E824C")}>
          <div style={cardTitle}>SAFE</div>
          <div style={cardValue("#1E824C")}>{stats.SAFE}</div>
        </div>
        <div style={card("#C98300")}>
          <div style={cardTitle}>SUSPICIOUS</div>
          <div style={cardValue("#C98300")}>{stats.SUSPICIOUS}</div>
        </div>
        <div style={card("#C62828")}>
          <div style={cardTitle}>MALICIOUS</div>
          <div style={cardValue("#C62828")}>{stats.MALICIOUS}</div>
        </div>
      </div>

      <div style={reports}>
        <h4 style={{ marginBottom: "12px", color: "#0B1930" }}>Recent Reports</h4>
        {error ? (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#FDECEA",
              color: "#C62828",
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        ) : (
          <p style={{ color: "#5B6B7C" }}>No reports available yet.</p>
        )}
      </div>

      {/* Animation keyframes inline */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
