import React from "react";
import { Link, NavLink } from "react-router-dom";

const navStyle: React.CSSProperties = {
  backdropFilter: "saturate(180%) blur(8px)",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={navStyle}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard">
          <span style={{ display: "inline-flex", width: 34, height: 34, borderRadius: 8, background: "#0d6efd", color: "#fff",
            alignItems: "center", justifyContent: "center", marginRight: 8 }}>🛡️</span>
          CyberSaarthi
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#csNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="csNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">Scans</span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/scan/phishing">Phishing</NavLink></li>
                <li><NavLink className="dropdown-item" to="/scan/invoice">Invoice (Manual)</NavLink></li>
                <li><NavLink className="dropdown-item" to="/scan/upload-invoice">Invoice (Upload)</NavLink></li>
              </ul>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/reports">Reports</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/settings">Settings</NavLink></li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <a className="btn btn-sm btn-outline-primary" href="/auth">Login / Register</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
