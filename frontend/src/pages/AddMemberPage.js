import React, { useState } from "react";
import axios from "axios";
import "../styles/theme.css";

const AddMember = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fee: "",
    status: "unpaid",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://library-management-system-pink-eight.vercel.app/api/members/add", form);

      alert("Member Added Successfully!");

      // Reset form
      setForm({
        name: "",
        phone: "",
        fee: "",
        status: "unpaid",
      });

    } catch (error) {
      console.error(error);
      alert("Error adding member");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Member</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          name="fee"
          placeholder="Fee"
          value={form.fee}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <button type="submit" style={styles.button}>
          Add Member
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  form: {
    maxWidth: "400px",
    background: "var(--card)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "var(--shadow)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};

export default AddMember;