import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { AlertCircle, Bell, LogOut, Menu, User } from "lucide-react";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddMemberPage from "./pages/AddMemberPage";
import MembersPage from "./pages/MembersPage";
import Expenses from "./pages/Expenses";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

// Components
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import NavDrawer from "./components/NavDrawer";
import BrandMark from "./components/BrandMark";
import Backdrop from "./components/Backdrop";

// Services
import { clearTokens, getErrorMessage, readToken, UNAUTHORIZED_EVENT } from "./services/api";
import { getMembers, addMember, deleteMember } from "./services/memberService";
import { getExpenses, addExpense, deleteExpense } from "./services/expenseService";
import {
  addNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./services/notificationService";

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

const TITLES = {
  "/": "Dashboard",
  "/members": "Members",
  "/add": "Add member",
  "/expenses": "Expenses",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

function AppShell({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleDesktop = (event) => {
      if (event.matches) setNavOpen(false);
    };

    desktop.addEventListener("change", handleDesktop);

    return () => desktop.removeEventListener("change", handleDesktop);
  }, []);

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

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);

    try {
      const response = await getNotifications();

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread || 0);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications().catch(() => {});
  }, [loadNotifications]);

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

  const handleAddNotification = async (notification) => {
    await addNotification(notification);
    await loadNotifications();
  };

  const handleToggleNotificationRead = async (id, read) => {
    await markNotificationRead(id, read);
    await loadNotifications();
  };

  const handleMarkAllNotificationsRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  const handleDeleteNotification = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
  };

  const title = TITLES[location.pathname] || "Dashboard";

  return (
    <div className="app-shell">
      <Backdrop />

      <Sidebar onLogout={onLogout} />
      <NavDrawer open={navOpen} onClose={closeNav} onLogout={onLogout} />
      <BottomNav />

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-brand">
            <button
              type="button"
              className="icon-button topbar-menu"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={navOpen}
            >
              <Menu size={18} />
            </button>

            <BrandMark size={32} />
            <span className="brand-word">
              Libre<strong>Desk</strong>
            </span>
          </div>

          <div className="topbar-heading">
            <p className="eyebrow">Library operations</p>
            <h1 className="page-title">{title}</h1>
          </div>

          <div className="topbar-actions">
            <span className="topbar-status">
              <span className="online-dot" />
              System online
            </span>

            <Link
              to="/notifications"
              className="icon-button relative"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-slate-950">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="icon-button lg:hidden"
              aria-label="Profile"
            >
              <User size={18} />
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="icon-button lg:hidden"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="mx-auto mb-5 flex max-w-7xl flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
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
            <Route
              path="/notifications"
              element={
                <NotificationsPage
                  notifications={notifications}
                  unreadCount={unreadCount}
                  loading={notificationsLoading}
                  onRefresh={loadNotifications}
                  onAdd={handleAddNotification}
                  onToggleRead={handleToggleNotificationRead}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onDelete={handleDeleteNotification}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage onLogout={onLogout} unreadCount={unreadCount} />
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
