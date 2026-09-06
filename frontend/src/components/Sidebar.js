import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, Users, LogOut, Wallet } from "lucide-react";

const Sidebar = ({ onLogout, menuOpen, closeMenu }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Add Member", path: "/add", icon: UserPlus },
    { name: "Members", path: "/members", icon: Users },
    { name: "Expenses", path: "/expenses", icon: Wallet },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white p-5 flex flex-col transition-transform duration-300
      ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
        📚 Library <span className="text-slate-400 font-normal">HQ</span>
      </h2>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"}`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60"
      >
        <LogOut size={18} />
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;