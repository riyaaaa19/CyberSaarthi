import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData).catch(() =>
      setData({
        threat_level: "Low",
        recent_alerts: 2,
        ai_suggestion: "Verify GSTIN in invoices",
        risk_distribution: [65, 20, 15],
        alerts_timeline: [1, 0, 2, 1, 3, 1, 2],
      })
    );
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3 border-start border-primary">
            <h6>Threat Level</h6>
            <h3>{data.threat_level}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-start border-warning">
            <h6>Recent Alerts</h6>
            <h3>{data.recent_alerts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-start border-success">
            <h6>AI Suggestions</h6>
            <p>{data.ai_suggestion}</p>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <Doughnut data={{ labels: ["Safe", "Suspicious", "Malicious"], datasets: [{ data: data.risk_distribution }] }} />
        </div>
        <div className="col-md-6">
          <Line data={{ labels: ["6d","5d","4d","3d","2d","1d","Today"], datasets:[{ data: data.alerts_timeline, label:"Alerts" }] }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
