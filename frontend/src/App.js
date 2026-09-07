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
    <div className="min-h-screen bg-gray-100">

      <Sidebar
        onLogout={onLogout}
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="lg:ml-64">

        {/* Topbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu />
            </button>
            <h1 className="font-semibold text-lg">{title}</h1>
          </div>

          <button
            onClick={onLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </header>

        {/* Pages */}
        <div className="p-4">
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