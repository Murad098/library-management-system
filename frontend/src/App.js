import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddMemberPage from "./pages/AddMemberPage";
import MembersPage from "./pages/MembersPage";
import Sidebar from "./components/Sidebar";

function AppShell({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const title = location.pathname === "/members" || location.pathname === "/add" ? "Members" : "Overview";

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-slate-900">
      <Sidebar onLogout={onLogout} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
      {menuOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMenuOpen(false)} />}
      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
            <div><p className="text-xs font-medium text-slate-400">LibraryHQ / Workspace</p><h1 className="font-display text-xl font-semibold text-slate-900">{title}</h1></div>
          </div>
          <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /> System operational</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">AD</span></div>
        </header>
        <div className="mx-auto max-w-[1400px] p-4 sm:p-8"><Routes><Route path="/" element={<DashboardPage />} /><Route path="/members" element={<MembersPage />} /><Route path="/add" element={<><MembersPage /><AddMemberPage /></>} /><Route path="*" element={<Navigate to="/" />} /></Routes></div>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <Router>{!isLoggedIn ? <LoginPage onLogin={() => setIsLoggedIn(true)} /> : <AppShell onLogout={() => setIsLoggedIn(false)} />}</Router>;
}

export default App;