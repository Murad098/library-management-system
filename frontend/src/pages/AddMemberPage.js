import React, { useState } from "react";
import axios from "axios";
import "../styles/theme.css";
import { UserPlus } from "lucide-react";

const AddMember = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fee: "",
    status: "unpaid",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      setError(error.response?.data?.message || "Error adding member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading"><div><p className="eyebrow accent">Directory</p><h2 className="section-title">Add member</h2><p className="section-subtitle">Create a new profile for your library community.</p></div></div>

      <form className="form-card member-form" onSubmit={handleSubmit}>
        <div className="form-intro"><span className="form-icon"><UserPlus size={21} /></span><div><h3>Member details</h3><p>Enter the information below to get started.</p></div></div>
        <label>Name<input type="text" name="name" placeholder="e.g. Aisha Khan" value={form.name} onChange={handleChange} required /></label>
        <label>Phone<input type="text" name="phone" placeholder="e.g. +92 300 1234567" value={form.phone} onChange={handleChange} required /></label>
        <label>Fee<input type="number" name="fee" placeholder="Enter membership fee" value={form.fee} onChange={handleChange} required /></label>
        <label>Status<select name="status" value={form.status} onChange={handleChange}><option value="paid">Paid</option><option value="unpaid">Unpaid</option></select></label>
        {error && <div className="alert error-alert">{error}</div>}
        <button type="submit" className="primary-button" disabled={loading}><UserPlus size={17} />{loading ? "Adding member..." : "Add member"}</button>
      </form>
    </section>
  );
};

export default AddMember;