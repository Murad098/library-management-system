import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_URL = "http://localhost:5000/api/expenses"; // ✅ LOCAL

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      return setError("Title and amount required");
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/add`, {
        ...form,
        amount: Number(form.amount),
      });

      setForm({ title: "", amount: "", category: "Other" });
      fetchExpenses();
    } catch {
      setError("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch {
      setError("Delete failed");
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <span className="text-sm font-medium">
          Total: <b>PKR {total}</b>
        </span>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow border p-5 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full border p-2 rounded"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>Rent</option>
            <option>Electricity</option>
            <option>Internet</option>
            <option>Maintenance</option>
            <option>Other</option>
          </select>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        {/* Desktop */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-t">
                  <td className="p-3">{exp.title}</td>
                  <td className="p-3">{exp.category}</td>
                  <td className="p-3">PKR {exp.amount}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(exp._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          {expenses.map((exp) => (
            <div key={exp._id} className="p-4 border-b flex justify-between">
              <div>
                <p>{exp.title}</p>
                <p className="text-sm text-gray-500">{exp.category}</p>
                <p>PKR {exp.amount}</p>
              </div>

              <button onClick={() => handleDelete(exp._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Expenses;