import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeLangProvider, ThemeLangContext } from "./ThemeLangContext";
import { AuthProvider } from "./contexts/AuthContext";

function AppContent() {
  const { theme } = useContext(ThemeLangContext);

  const appStyle = {
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: theme === "dark" ? "var(--bg-primary-dark)" : "var(--bg-primary-light)",
    minHeight: "auto",
    transition: "background-color 0.3s ease",
  };

  const contentStyle = {
    marginTop: "0px",
    padding: "0",
    maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <div style={appStyle}>
      <Router>
        <Navbar />
        <div style={contentStyle}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeLangProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeLangProvider>
  );
}

export default App;
