import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Bell, Menu, Search } from "lucide-react";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddMemberPage from "./pages/AddMemberPage";
import MembersPage from "./pages/MembersPage";
import Expenses from "./pages/Expenses";

// Components
import Sidebar from "./components/Sidebar";

function AppShell({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const title =
    location.pathname === "/members" || location.pathname === "/add"
      ? "Members"
      : location.pathname === "/expenses"
      ? "Expenses"
      : "Overview";

  return (
    <div className="app-shell">

      <Sidebar
        onLogout={onLogout}
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      {/* Mobile overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="app-main">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-start">
            <button onClick={() => setMenuOpen(true)} className="icon-button menu-toggle" aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <div><p className="eyebrow">Library operations</p><h1 className="page-title">{title}</h1></div>
          </div>

          <div className="topbar-actions"><label className="search-box"><Search size={17} /><input type="search" placeholder="Search library..." aria-label="Search library" /></label><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button><div className="profile"><span className="avatar">AD</span><span className="profile-copy"><strong>Admin</strong><small>Administrator</small></span></div></div>
        </header>

        {/* Pages */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/add" element={<AddMemberPage />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AppShell onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;