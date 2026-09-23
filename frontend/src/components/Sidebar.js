import {
  Bell,
  LayoutDashboard,
  LogOut,
  Plus,
  Receipt,
  User,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import BrandMark from "./BrandMark";

const LINKS = [
  ["/", "Dashboard", LayoutDashboard],
  ["/members", "Members", Users],
  ["/add", "Add member", Plus],
  ["/expenses", "Expenses", Receipt],
  ["/notifications", "Notifications", Bell],
  ["/profile", "Profile", User],
];

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand">
          <BrandMark size={36} />
          <span className="brand-word">Library Management</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {LINKS.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" onClick={onLogout} className="nav-link logout-link">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
