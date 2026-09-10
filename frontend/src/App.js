import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AlertCircle, Menu } from "lucide-react";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddMemberPage from "./pages/AddMemberPage";
import MembersPage from "./pages/MembersPage";
import Expenses from "./pages/Expenses";

// Components
import Sidebar from "./components/Sidebar";

// Services
import { clearTokens, getErrorMessage, readToken, UNAUTHORIZED_EVENT } from "./services/api";
import { getMembers, addMember, deleteMember } from "./services/memberService";
import { getExpenses, addExpense, deleteExpense } from "./services/expenseService";

const normalizeMember = (member) => ({
  id: member._id || member.id,
  name: member.name || "",
  email: member.email || "",
  phone: member.phone || "",
  fee: Number(member.fee) || 0,
  status: member.status === "paid" ? "paid" : "unpaid",
  createdAt: member.createdAt || null,
});

const normalizeExpense = (expense) => ({
  id: expense._id || expense.id,
  title: expense.title || "",
  amount: Number(expense.amount) || 0,
  category: expense.category || "Other",
  date: expense.date || null,
});

function AppShell({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [membersResponse, expensesResponse] = await Promise.all([
        getMembers(),
        getExpenses(),
      ]);

      setMembers(membersResponse.data.map(normalizeMember));
      setExpenses(expensesResponse.data.map(normalizeExpense));
    } catch (err) {
      if (err?.response?.status !== 401) {
        setError(getErrorMessage(err, "Unable to load library data."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddMember = async (member) => {
    const response = await addMember(member);
    const created = normalizeMember(response.data);

    setMembers((current) => [created, ...current]);

    return created;
  };

  const handleDeleteMember = async (id) => {
    await deleteMember(id);
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const handleAddExpense = async (expense) => {
    const response = await addExpense(expense);
    const created = normalizeExpense(response.data);

    setExpenses((current) => [created, ...current]);

    return created;
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

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
          aria-hidden="true"
        />
      )}

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="icon-button menu-toggle"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
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
          {error && (
            <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </span>
              <button
                onClick={loadData}
                className="self-start rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/10 sm:self-auto"
              >
                Retry
              </button>
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  members={members}
                  expenses={expenses}
                  loading={loading}
                />
              }
            />
            <Route
              path="/members"
              element={
                <MembersPage
                  members={members}
                  loading={loading}
                  onDeleteMember={handleDeleteMember}
                />
              }
            />
            <Route
              path="/add"
              element={<AddMemberPage onAddMember={handleAddMember} />}
            />
            <Route
              path="/expenses"
              element={
                <Expenses
                  expenses={expenses}
                  loading={loading}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(readToken()));

  useEffect(() => {
    const handleUnauthorized = () => setIsLoggedIn(false);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <LoginPage onSignInSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <AppShell onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;
