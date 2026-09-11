import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  LifeBuoy,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { getErrorMessage, readSessionUser } from "../services/api";
import { changePassword } from "../services/authService";
import { initials } from "../utils/format";

const EMPTY_FORM = { current: "", next: "", confirm: "" };

const HELP_TIPS = [
  "Add members from Members → Add member and set their monthly fee.",
  "Keep the Paid / Unpaid status current so collection totals stay accurate.",
  "Record every library expense so the dashboard net figure stays correct.",
  "Change the admin password here whenever it may have been shared.",
];

function ProfilePage({ onLogout, unreadCount = 0 }) {
  const { name, email, role, expiresAt } = readSessionUser();
  const hasSession = expiresAt && !Number.isNaN(expiresAt.getTime());

  const [openPanel, setOpenPanel] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });

  const togglePanel = (panel) => {
    setStatus({ tone: "", message: "" });
    setOpenPanel((current) => (current === panel ? "" : panel));
  };

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (form.next.length < 6) {
      setStatus({
        tone: "error",
        message: "New password must be at least 6 characters.",
      });
      return;
    }

    if (form.next !== form.confirm) {
      setStatus({
        tone: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setSaving(true);
    setStatus({ tone: "", message: "" });

    try {
      await changePassword(form.current, form.next);
      setForm(EMPTY_FORM);
      setStatus({ tone: "success", message: "Password updated successfully." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: getErrorMessage(error, "Unable to update password."),
      });
    } finally {
      setSaving(false);
    }
  };

  const passwordType = showPasswords ? "text" : "password";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-5">
      <header className="min-w-0">
        <span className="eyebrow-tag">Account</span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your administrator account
        </p>
      </header>

      <section className="profile-identity" aria-label="Account details">
        <span className="profile-avatar" aria-hidden="true">
          {initials(name)}
        </span>

        <div className="profile-identity__text">
          <p className="profile-name">{name}</p>
          <p className="profile-email">{email || "Signed in"}</p>

          <span className="profile-role">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {role}
          </span>
        </div>
      </section>

      <section className="profile-menu" aria-label="Account settings">
        <button
          type="button"
          onClick={() => togglePanel("password")}
          className="profile-row"
          aria-expanded={openPanel === "password"}
          aria-controls="change-password-form"
        >
          <span className="profile-row__icon" aria-hidden="true">
            <Lock className="h-4 w-4" />
          </span>

          <span className="profile-row__text">
            <span className="profile-row__title">Change Password</span>
            <span className="profile-row__desc">Update your account password</span>
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              openPanel === "password" ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {openPanel === "password" && (
          <form
            id="change-password-form"
            onSubmit={handlePasswordSubmit}
            className="space-y-3 px-4 py-4 sm:px-[18px] sm:py-5"
          >
            <div>
              <label className="field-label" htmlFor="current-password">
                Current password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  className="input pr-12"
                  type={passwordType}
                  autoComplete="current-password"
                  value={form.current}
                  onChange={updateField("current")}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((visible) => !visible)}
                  aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                  className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:text-white"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="new-password">
                New password
              </label>
              <input
                id="new-password"
                className="input"
                type={passwordType}
                autoComplete="new-password"
                value={form.next}
                onChange={updateField("next")}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="confirm-password">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                className="input"
                type={passwordType}
                autoComplete="new-password"
                value={form.confirm}
                onChange={updateField("confirm")}
                placeholder="Re-enter new password"
                required
              />
            </div>

            {status.message && (
              <p
                role="status"
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                  status.tone === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {status.tone === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                {status.message}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setStatus({ tone: "", message: "" });
                  setOpenPanel("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Update password"}
              </button>
            </div>
          </form>
        )}

        <Link to="/notifications" className="profile-row">
          <span className="profile-row__icon" aria-hidden="true">
            <Bell className="h-4 w-4" />
          </span>

          <span className="profile-row__text">
            <span className="profile-row__title">Notifications</span>
            <span className="profile-row__desc">Alerts and reminders</span>
          </span>

          {unreadCount > 0 ? (
            <span className="badge shrink-0 border border-brand/30 bg-brand/15 text-brand">
              {unreadCount} new
            </span>
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          )}
        </Link>

        <button
          type="button"
          onClick={() => togglePanel("support")}
          className="profile-row"
          aria-expanded={openPanel === "support"}
          aria-controls="help-support-panel"
        >
          <span className="profile-row__icon" aria-hidden="true">
            <LifeBuoy className="h-4 w-4" />
          </span>

          <span className="profile-row__text">
            <span className="profile-row__title">Help &amp; Support</span>
            <span className="profile-row__desc">Get help with the system</span>
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              openPanel === "support" ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {openPanel === "support" && (
          <div id="help-support-panel" className="px-4 py-4 sm:px-[18px] sm:py-5">
            <ul className="space-y-2">
              {HELP_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="profile-menu" aria-label="Session">
        <button type="button" onClick={onLogout} className="profile-row profile-row--danger">
          <span className="profile-row__icon" aria-hidden="true">
            <LogOut className="h-4 w-4" />
          </span>

          <span className="profile-row__text">
            <span className="profile-row__title">Logout</span>
            <span className="profile-row__desc">End this session</span>
          </span>
        </button>
      </section>

      {hasSession && (
        <p className="profile-session">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Session active until{" "}
          {expiresAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
