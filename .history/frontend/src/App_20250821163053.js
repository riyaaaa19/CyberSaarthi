import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("THEME") || "light");

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#121212" : "#fff";
    document.body.style.color = theme === "dark" ? "#f5f5f5" : "#000";
  }, [theme]);

  const layoutStyle = { display: "flex" };
  const contentStyle = { marginLeft: "220px", flex: 1, padding: "20px" };

  return (
    <Router>
      <Navbar />
      <div style={layoutStyle}>
        <Sidebar />
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
