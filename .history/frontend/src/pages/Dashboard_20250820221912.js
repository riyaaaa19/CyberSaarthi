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
    }).catch(() => {
      setSummary({safe:8,suspicious:3,malicious:1,total:12});
    });
  }, []);

  const doughnutData = {
    labels: ["Safe","Suspicious","Malicious"],
    datasets: [{ data: [summary.safe, summary.suspicious, summary.malicious], backgroundColor:["#4caf50","#ffc107","#f44336"] }]
  };

  const lineData = {
    labels: history.slice(0,7).map(h => new Date(h.created_at).toLocaleDateString()),
    datasets: [{ data: history.slice(0,7).map((h,i) => i+1), label: "Recent scans", borderColor:"#2196f3" }]
  };

  const cardStyle = { flex:1, margin:"10px", padding:"15px", border:"1px solid #ddd", borderRadius:"10px", boxShadow:"0 2px 5px rgba(0,0,0,0.1)", textAlign:"center" };

  return (
    <div style={{ padding:"20px" }}>
      <h2>Dashboard</h2>
      <div style={{ display:"flex", justifyContent:"space-around", marginTop:"20px" }}>
        <div style={cardStyle}>
          <h4>Total Scans</h4>
          <h2>{summary.total}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Suspicious</h4>
          <h2>{summary.suspicious}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Malicious</h4>
          <h2>{summary.malicious}</h2>
        </div>
      </div>

      <div style={{ display:"flex", marginTop:"40px" }}>
        <div style={{ flex:1, padding:"20px" }}>
          <Doughnut data={doughnutData} />
        </div>
        <div style={{ flex:1, padding:"20px" }}>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
