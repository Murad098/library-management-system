import { useEffect, useRef } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Plus,
  Receipt,
  User,
  Users,
  X,
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

function NavDrawer({ open, onClose, onLogout }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className={`nav-drawer ${open ? "nav-drawer--open" : ""}`}>
      <div className="nav-drawer__scrim" onClick={onClose} aria-hidden="true" />

      <div
        className="nav-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="nav-drawer__head">
          <button
            ref={closeRef}
            type="button"
            className="icon-button nav-drawer__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          <div className="nav-drawer__brand">
            <BrandMark size={52} />
            <span className="brand-word">
              Libre<strong>Desk</strong>
            </span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {LINKS.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
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
          <button type="button" onClick={onLogout} className="nav-link logout-link">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavDrawer;
