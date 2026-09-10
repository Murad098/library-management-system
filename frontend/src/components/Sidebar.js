import { useEffect } from "react";
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

const LINKS = [
  ["/", "Dashboard", LayoutDashboard],
  ["/members", "Members", Users],
  ["/add", "Add member", Plus],
  ["/expenses", "Expenses", Receipt],
];

function Sidebar({ onLogout, menuOpen, closeMenu }) {
  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <aside id="app-sidebar" className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
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
          type="button"
          className="icon-button close-sidebar"
          onClick={closeMenu}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      <p className="nav-label">Workspace</p>

      <nav className="nav-list" aria-label="Main navigation">
        {LINKS.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={closeMenu}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
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

        <button type="button" onClick={onLogout} className="nav-link logout-link">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
