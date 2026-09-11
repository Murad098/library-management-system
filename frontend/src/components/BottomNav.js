import { LayoutDashboard, Plus, Receipt, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const LINKS = [
  ["/", "Dashboard", LayoutDashboard],
  ["/members", "Members", Users],
  ["/add", "Add member", Plus],
  ["/expenses", "Expenses", Receipt],
];

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {LINKS.map(([to, label, Icon]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `bottom-nav-link ${isActive ? "active" : ""}`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
