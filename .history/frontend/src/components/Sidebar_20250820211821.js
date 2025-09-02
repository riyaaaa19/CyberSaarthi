import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BiSpeedometer2, BiFile, BiBarChart, BiCog } from "react-icons/bi";

function Sidebar() {
  const location = useLocation();
  return (
    <nav className="sidebar p-3 border-end">
      <h4 className="mb-4 text-primary">CyberSaarthi</h4>
      <ul className="nav flex-column">
        <li>
          <Link className={`nav-link ${location.pathname==="/dashboard" ? "active" : ""}`} to="/dashboard">
            <BiSpeedometer2 /> Dashboard
          </Link>
        </li>
        <li>
          <Link className={`nav-link ${location.pathname==="/invoice" ? "active" : ""}`} to="/invoice">
            <BiFile /> Invoice Scanner
          </Link>
        </li>
        <li>
          <Link className={`nav-link ${location.pathname==="/reports" ? "active" : ""}`} to="/reports">
            <BiBarChart /> Reports
          </Link>
        </li>
        <li>
          <Link className={`nav-link ${location.pathname==="/settings" ? "active" : ""}`} to="/settings">
            <BiCog /> Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
