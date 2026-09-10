import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Plus,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ onLogout, menuOpen, closeMenu }) {
  const links = [
    ["/", "Dashboard", LayoutDashboard],
    ["/members", "Members", Users],
    ["/add", "Add member", Plus],
    ["/expenses", "Expenses", Receipt],
  ];

  return (
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="brand-row">
        <div className="brand">
          <span className="brand-mark">
            <BookOpen size={19} />
          </span>

          <span>
            Libra<strong>HQ</strong>
          </span>
        </div>

        <button
          className="icon-button close-sidebar"
          onClick={closeMenu}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      <p className="nav-label">Workspace</p>

      <nav className="nav-list">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={closeMenu}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-note">
          <span className="online-dot" />
          System online
        </div>

        <button
          onClick={onLogout}
          className="nav-link logout-link"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;