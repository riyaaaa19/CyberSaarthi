import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({safe:0,suspicious:0,malicious:0, total:0});

  useEffect(() => {
    getHistory(50,0).then((page) => {
      const items = page.items || [];
      setHistory(items);
      const counts = { SAFE:0, SUSPICIOUS:0, MALICIOUS:0 };
      items.forEach(it => counts[it.verdict] = (counts[it.verdict]||0) + 1);
      setSummary({
        safe: counts.SAFE || 0,
        suspicious: counts.SUSPICIOUS || 0,
        malicious: counts.MALICIOUS || 0,
        total: items.length
      });
    }).catch(err => {
      console.error(err);
      // fallback demo data
      setHistory([]);
      setSummary({safe:8,suspicious:3,malicious:1,total:12});
    });
  }, []);

  const doughnutData = {
    labels: ["Safe","Suspicious","Malicious"],
    datasets: [{ data: [summary.safe, summary.suspicious, summary.malicious] }]
  };

  const lineData = {
    labels: history.slice(0,7).map(h => new Date(h.created_at).toLocaleDateString()),
    datasets: [{ data: history.slice(0,7).map((h,i) => i+1), label: "Recent scans" }]
  };

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Total Scans</h5>
            <h2>{summary.total}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Suspicious</h5>
            <h2>{summary.suspicious}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Malicious</h5>
            <h2>{summary.malicious}</h2>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <Doughnut data={doughnutData} />
        </div>
        <div className="col-md-6">
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
