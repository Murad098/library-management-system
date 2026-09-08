import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/api";

const API_URL = `${BASE_URL}/expenses`;

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
  });

  const fetchExpenses = async () => {
    const res = await axios.get(`${API_URL}/all`);
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${API_URL}/add`, {
      ...form,
      amount: Number(form.amount),
    });

    setForm({ title: "", amount: "", category: "Other" });
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchExpenses();
  };

  return (
    <div>
      <h2>Expenses</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />
        <button>Add</button>
      </form>

      {expenses.map((e) => (
        <div key={e._id}>
          {e.title} - {e.amount}
          <button onClick={() => handleDelete(e._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Expenses;