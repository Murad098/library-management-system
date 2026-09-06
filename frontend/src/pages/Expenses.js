import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

const API_URL = "https://library-management-system-9stqk8hig.vercel.app/api/expenses";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "Other" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      setError("Could not load expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) {
      return setError("Enter a title and amount.");
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/add`, {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
      });
      setForm({ title: "", amount: "", category: "Other" });
      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (err) {
      setError("Failed to delete expense.");
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 max-w-md">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title (e.g. Rent)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Rent</option>
            <option>Electricity</option>
            <option>Internet</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus size={16} /> {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">All Expenses</h3>
          <span className="text-sm font-semibold text-slate-900">Total: PKR {total}</span>
        </div>

        {expenses.length === 0 ? (
          <p className="text-sm text-slate-400 px-5 py-6">No expenses added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-2">Title</th>
                <th className="px-5 py-2">Category</th>
                <th className="px-5 py-2">Amount</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3">{exp.title}</td>
                  <td className="px-5 py-3 text-slate-500">{exp.category}</td>
                  <td className="px-5 py-3">PKR {exp.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Expenses;