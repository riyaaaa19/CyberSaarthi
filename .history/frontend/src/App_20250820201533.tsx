import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import EmailScan from "./pages/EmailScan";
import InvoiceScan from "./pages/InvoiceScan";
import UploadInvoice from "./pages/UploadInvoice";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content flex-grow-1">
        <Navbar />
        <div className="container-fluid px-0">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/scan/email" element={<Layout><EmailScan /></Layout>} />
      <Route path="/scan/invoice" element={<Layout><InvoiceScan /></Layout>} />
      <Route path="/upload/invoice" element={<Layout><UploadInvoice /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
