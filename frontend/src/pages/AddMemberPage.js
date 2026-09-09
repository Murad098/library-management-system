import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../config/api";
import { UserPlus } from "lucide-react";

const API_URL = `${BASE_URL}/members`;

const AddMember = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fee: "",
    status: "unpaid",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_URL}/add`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        fee: Number(form.fee),
        status: form.status,
      });

      setSuccess("Member added successfully.");

      setForm({
        name: "",
        phone: "",
        fee: "",
        status: "unpaid",
      });
    } catch (error) {
      console.error("Add member error:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to add member."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Directory</p>

          <h2 className="section-title">Add member</h2>

          <p className="section-subtitle">
            Create a new member record for your library.
          </p>
        </div>
      </div>

      <form
        className="form-card member-form"
        onSubmit={handleSubmit}
      >
        <div className="form-intro">
          <span className="form-icon">
            <UserPlus size={21} />
          </span>

          <div>
            <h3>Member details</h3>

            <p>
              Enter the member information below.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="e.g. Aisha Khan"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              name="phone"
              placeholder="e.g. +92 300 1234567"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Membership fee
            <input
              type="number"
              name="fee"
              placeholder="Enter fee"
              value={form.fee}
              onChange={handleChange}
              min="1"
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>
        </div>

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success-alert">
            {success}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            <UserPlus size={17} />

            {loading ? "Adding member..." : "Add member"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddMember;