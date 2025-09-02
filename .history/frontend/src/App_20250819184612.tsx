import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/Dashboard";
import PhishingScan from "./pages/PhishingScan";
import InvoiceScan from "./pages/InvoiceScan";
import UploadInvoice from "./pages/UploadInvoice";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  const bg: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #ffffff 60%)",
  };

  return (
    <div style={bg}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan/phishing" element={<PhishingScan />} />
        <Route path="/scan/invoice" element={<InvoiceScan />} />
        <Route path="/scan/upload-invoice" element={<UploadInvoice />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
