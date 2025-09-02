// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

// Import from Boxicons
import { BiTachometer, BiUser, BiCog, BiLogOut } from "react-icons/bi";

// Import from Bootstrap Icons (for Speedometer2)
import { BsSpeedometer2 } from "react-icons/bs";

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white p-3 vh-100">
      <h4 className="mb-4">Dashboard</h4>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/dashboard" className="text-white text-decoration-none d-flex align-items-center">
            {/* You can use either */}
            <BsSpeedometer2 className="me-2" /> {/* Bootstrap icon */}
            {/* or <BiTachometer className="me-2" /> */}
            Dashboard
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/profile" className="text-white text-decoration-none d-flex align-items-center">
            <BiUser className="me-2" />
            Profile
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/settings" className="text-white text-decoration-none d-flex align-items-center">
            <BiCog className="me-2" />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" className="text-white text-decoration-none d-flex align-items-center">
            <BiLogOut className="me-2" />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
