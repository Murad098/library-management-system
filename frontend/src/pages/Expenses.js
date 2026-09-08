import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/api";
import { CircleDollarSign, Trash2 } from "lucide-react";

const API_URL = `${BASE_URL}/expenses`;

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);

      setExpenses(response.data);
    } catch (err) {
      console.error("Fetch expenses error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch expenses"
      );
    }
  };

  // Fetch expenses when page loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_URL}/add`, {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
      });

      // Clear form
      setForm({
        title: "",
        amount: "",
        category: "Other",
      });

      // Refresh list
      await fetchExpenses();
    } catch (err) {
      console.error("Add expense error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchExpenses();
    } catch (err) {
      console.error("Delete expense error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete expense"
      );
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading"><div><p className="eyebrow accent">Finance</p><h2 className="section-title">Expenses</h2><p className="section-subtitle">Track the operating costs of your library.</p></div></div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <form className="expense-form panel" onSubmit={handleSubmit}>
        <div className="form-intro"><span className="form-icon purple-icon"><CircleDollarSign size={21} /></span><div><h3>Log an expense</h3><p>Keep your records accurate and up to date.</p></div></div>
        {/* Title */}
        <input className="control"
          type="text"
          placeholder="Expense Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          required
        />

        {/* Amount */}
        <input className="control"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          min="1"
          required
        />

        {/* Category */}
        <select className="control"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">
            Entertainment
          </option>
          <option value="Other">Other</option>
        </select>

        {/* Add button */}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      <div className="panel expense-list"><div className="panel-heading"><div><p className="eyebrow accent">Recent activity</p><h3>All expenses</h3></div><span>{expenses.length} records</span></div>

      {expenses.length === 0 ? (
        <div className="state-card compact"><CircleDollarSign size={28} /><span>No expenses found.</span></div>
      ) : (
        <div className="expense-items">{expenses.map((expense) => (
          <div className="expense-item" key={expense._id}><div className="expense-main"><span className="expense-icon"><CircleDollarSign size={18} /></span><div><strong>{expense.title}</strong><small>{expense.category || "Other"}</small></div></div><div className="expense-end"><strong>PKR {expense.amount}</strong><button className="delete-button" type="button" aria-label={`Delete ${expense.title}`} onClick={() => handleDelete(expense._id)}><Trash2 size={17} /></button></div></div>
        ))}</div>
      )}</div>
    </section>
  );
}

export default Expenses;