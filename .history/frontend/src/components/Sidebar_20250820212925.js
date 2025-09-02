import React from "react";
import { Link, useLocation } from "react-router-dom";

// Import correct icons
import { BsSpeedometer2 } from "react-icons/bs";   // Bootstrap speedometer
import { BiUser, BiCog, BiLogOut } from "react-icons/bi"; // Boxicons

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar bg-dark text-white p-3 vh-100">
      <h4 className="mb-4">CyberSaarthi</h4>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link
            to="/dashboard"
            className={`text-white text-decoration-none d-flex align-items-center ${
              location.pathname === "/dashboard" ? "fw-bold" : ""
            }`}
          >
            <BsSpeedometer2 className="me-2" />
            Dashboard
          </Link>
        </li>
        <li className="mb-3">
          <Link
            to="/profile"
            className={`text-white text-decoration-none d-flex align-items-center ${
              location.pathname === "/profile" ? "fw-bold" : ""
            }`}
          >
            <BiUser className="me-2" />
            Profile
          </Link>
        </li>
        <li className="mb-3">
          <Link
            to="/settings"
            className={`text-white text-decoration-none d-flex align-items-center ${
              location.pathname === "/settings" ? "fw-bold" : ""
            }`}
          >
            <BiCog className="me-2" />
            Settings
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="text-white text-decoration-none d-flex align-items-center"
          >
            <BiLogOut className="me-2" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
