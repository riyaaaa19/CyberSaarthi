import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { ThemeLangProvider } from "./ThemeLangContext";  // ✅ Import provider

function App() {
  const layoutStyle = { display: "flex" };
  const contentStyle = { marginLeft: "220px", flex: 1, padding: "20px" };

  return (
    <ThemeLangProvider>
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
    </ThemeLangProvider>
  );
}

export default App;
