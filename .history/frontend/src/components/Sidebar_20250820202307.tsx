import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/scan/email", label: "Email Scan" },
  { to: "/scan/invoice", label: "Invoice Scan" },
  { to: "/upload/invoice", label: "Upload Invoice" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar d-flex flex-column p-3 position-fixed" style={{ width: 260, background: "#0b1930", minHeight: "100vh" }}>
      <div className="text-white fw-bold mb-4">CyberSaarthi</div>
      <nav className="nav flex-column gap-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              "nav-link px-0 " + (isActive ? "active fw-semibold text-white" : "text-secondary")
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto small text-secondary">© {new Date().getFullYear()}</div>
    </aside>
  );
}
