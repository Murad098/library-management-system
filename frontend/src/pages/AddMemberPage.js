import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

import { getErrorMessage } from "../services/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  fee: "",
  status: "unpaid",
};

const AddMemberScreen = ({ onAddMember }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const member = await onAddMember({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        fee: Number(form.fee) || 0,
        status: form.status,
      });

      setSuccess(`${member.name} was added to the member directory.`);
      setForm(EMPTY_FORM);

      window.setTimeout(() => navigate("/members"), 900);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to add member."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <div>
        <span className="eyebrow-tag">Member directory</span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Add member
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a new member record for your library.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
            <UserPlus className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-white">
              Member details
            </h2>
            <p className="text-xs text-slate-400">
              All fields except fee status are required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="field-label">Full name</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Aisha Khan"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
            />
          </label>

          <label>
            <span className="field-label">Email</span>
            <input
              type="email"
              name="email"
              placeholder="e.g. aisha@example.com"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
            />
          </label>

          <label>
            <span className="field-label">Phone</span>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +92 300 1234567"
              value={form.phone}
              onChange={handleChange}
              className="input"
              required
            />
          </label>

          <label>
            <span className="field-label">Monthly fee (PKR)</span>
            <input
              type="number"
              name="fee"
              placeholder="e.g. 1200"
              value={form.fee}
              onChange={handleChange}
              className="input"
              min="0"
              step="1"
              required
            />
          </label>

          <label>
            <span className="field-label">Fee status</span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/members")}
            className="btn-ghost order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary order-1 sm:order-2"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Adding member..." : "Add member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberScreen;
