import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Menu } from "lucide-react";

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

      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="icon-button menu-toggle"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="eyebrow">Library operations</p>
              <h1 className="page-title">{title}</h1>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/add" element={<AddMemberPage />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route
              path="*"
              element={<Navigate to="/" />}
            />
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
        <LoginPage
          onLogin={() => setIsLoggedIn(true)}
        />
      ) : (
        <AppShell onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;