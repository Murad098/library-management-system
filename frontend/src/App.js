import React, { useEffect, useState } from "react";
import axios from "axios";
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
import BASE_URL from "./config/api";
import { getMembers, addMember, deleteMember } from "./services/memberService";

const expensesApi = axios.create({ baseURL: `${BASE_URL}/expenses` });

const normalizeMember = (member) => ({
  id: member._id || member.id,
  name: member.name,
  email: member.email,
  phone: member.phone || "",
  seatNumber: "",
  hall: "",
  shift: "",
  admissionDate: member.createdAt
    ? new Date(member.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "",
  feeStatus: member.status || "unpaid",
  monthlyFee: Number(member.fee) || 0,
});

const normalizeExpense = (expense) => ({
  ...expense,
  id: expense._id || expense.id,
  subtitle: expense.subtitle || expense.category,
  paymentType: expense.paymentType || "Operational",
  iconType: expense.iconType || "tag",
  date: expense.date
    ? new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "",
});

function AppShell({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    Promise.all([getMembers(), expensesApi.get("/")])
      .then(([membersResponse, expensesResponse]) => {
        if (!active) return;
        setMembers(membersResponse.data.map(normalizeMember));
        setExpenses(expensesResponse.data.map(normalizeExpense));
      })
      .catch((error) => {
        console.error("Unable to load library data:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAddStudent = async (member) => {
    const response = await addMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      fee: member.monthlyFee,
      status: member.feeStatus.toLowerCase(),
    });
    setMembers((current) => [...current, normalizeMember(response.data)]);
  };

  const handleDeleteMember = async (id) => {
    await deleteMember(id);
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const handleAddExpense = async (expense) => {
    const response = await expensesApi.post("/add", {
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
    setExpenses((current) => [...current, normalizeExpense(response.data)]);
  };

  const handleDeleteExpense = async (id) => {
    await expensesApi.delete(`/${id}`);
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
            <Route
              path="/members"
              element={<MembersPage students={members} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteMember} />}
            />
            <Route path="/add" element={<AddMemberPage />} />
            <Route
              path="/expenses"
              element={<Expenses expenses={expenses} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} />}
            />
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
          onSignInSuccess={() => setIsLoggedIn(true)}
        />
      ) : (
        <AppShell onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;