import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  LifeBuoy,
  Loader2,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";

import { getErrorMessage, readSessionUser } from "../services/api";
import { changePassword, getAvatar, uploadAvatar } from "../services/authService";
import { initials } from "../utils/format";
import { readTheme, applyTheme } from "../utils/theme";

const EMPTY_FORM = { current: "", next: "", confirm: "" };
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

  const [isDark, setIsDark] = useState(() => readTheme() !== "light");
  const [language, setLanguage] = useState(() => {
    return (
      window.localStorage.getItem("language") || "en"
    );
  });

  const avatarInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    const loadAvatar = async () => {
      try {
        const response = await getAvatar();
        objectUrl = URL.createObjectURL(response.data);

        if (!cancelled) setAvatarUrl(objectUrl);
      } catch {
        // No photo is set until the first upload; initials stand in.
      }
    };

    loadAvatar();

    return () => {
      cancelled = true;

      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image must be 2 MB or smaller.");
      return;
    }

    setAvatarError("");
    setAvatarLoading(true);

    try {
      await uploadAvatar(file);

      setAvatarUrl((current) => {
        if (current) URL.revokeObjectURL(current);

        return URL.createObjectURL(file);
      });
    } catch (error) {
      setAvatarError(
        getErrorMessage(error, "Unable to update the profile photo.")
      );
    } finally {
      setAvatarLoading(false);
    }
  };

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

  const handleThemeToggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    applyTheme(next);
    setIsDark(!isDark);
  };

  const handleLanguage = (lang) => {
    setLanguage(lang);
    window.localStorage.setItem("language", lang);
  };

  const passwordType = showPasswords ? "text" : "password";

  return (
    <div className="settings-screen">
      <header className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Settings
        </h1>
      </header>

      {/* ── Account details ── */}
      <section className="settings-section" aria-label="Account details">
        <div className="profile-identity">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleAvatarChange}
          />

          <button
            type="button"
            className="profile-avatar"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarLoading}
            aria-label="Change profile photo"
          >
            {avatarLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : avatarUrl ? (
              <img
                className="profile-avatar__image"
                src={avatarUrl}
                alt=""
              />
            ) : (
              <span aria-hidden="true">{initials(name)}</span>
            )}

            {!avatarLoading && (
              <span className="profile-avatar__overlay" aria-hidden="true">
                <Camera className="h-5 w-5" />
              </span>
            )}
          </button>

          <div className="profile-identity__text">
            <p className="profile-name">{name}</p>
            <p className="profile-email">{email || "Signed in"}</p>

            <span className="profile-role">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {role}
            </span>

            {avatarError && (
              <p className="profile-avatar__error" role="alert">
                {avatarError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Appearance ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">Appearance</h2>
        <p className="settings-section__desc">Customize your theme</p>

        <div className="settings-row settings-appearance-row">
          <div className="settings-row__icon">
            {isDark ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </div>
          <div className="settings-row__text">
            <span className="settings-row__title">Dark mode</span>
            <span className="settings-row__desc">
              {isDark ? "Dark theme active" : "Light theme active"}
            </span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={handleThemeToggle}
              aria-label="Toggle dark mode"
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
        </div>
      </section>

      {/* ── Language ── */}
      <section className="settings-section">
        <h2 className="settings-section__title">Language</h2>
        <p className="settings-section__desc">
          Choose your preferred language
        </p>

        <div className="lang-pills">
          <button
            type="button"
            className={`lang-pill ${
              language === "en" ? "lang-pill--active" : ""
            }`}
            onClick={() => handleLanguage("en")}
          >
            English
          </button>

          <button
            type="button"
            className={`lang-pill ${
              language === "ur" ? "lang-pill--active" : ""
            }`}
            onClick={() => handleLanguage("ur")}
          >
            اردو
          </button>
        </div>
      </section>

      {/* ── Account settings ── */}
      <section className="settings-section" aria-label="Account settings">
        <h2 className="settings-section__title">Account Settings</h2>
        <p className="settings-section__desc">
          Manage your account preferences
        </p>

        <button
          type="button"
          className="settings-row"
          onClick={() => togglePanel("password")}
          aria-expanded={openPanel === "password"}
          aria-controls="change-password-form"
        >
          <div className="settings-row__icon" aria-hidden="true">
            <Lock className="h-4 w-4" />
          </div>

          <div className="settings-row__text">
            <span className="settings-row__title">Change Password</span>
            <span className="settings-row__desc">
              Update your account password
            </span>
          </div>

          <ChevronDown
            className={`settings-row__chevron h-4 w-4 transition-transform ${
              openPanel === "password" ? "settings-row__chevron--rotated" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {openPanel === "password" && (
          <form
            id="change-password-form"
            onSubmit={handlePasswordSubmit}
            className="settings-form"
          >
            <div className="settings-form__field">
              <label className="settings-form__label" htmlFor="current-password">
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
                  {showPasswords ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="settings-form__field">
              <label className="settings-form__label" htmlFor="new-password">
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

            <div className="settings-form__field">
              <label
                className="settings-form__label"
                htmlFor="confirm-password"
              >
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
              <div
                role="status"
                className={`settings-status settings-status--${
                  status.tone === "success" ? "success" : "error"
                }`}
              >
                {status.tone === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                {status.message}
              </div>
            )}

            <div className="settings-form__actions">
              <button
                type="button"
                className="settings-form__text-btn"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setStatus({ tone: "", message: "" });
                  setOpenPanel("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="settings-form__submit-btn"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {saving ? "Saving..." : "Update password"}
              </button>
            </div>
          </form>
        )}

        <Link to="/notifications" className="settings-row">
          <div className="settings-row__icon" aria-hidden="true">
            <Bell className="h-4 w-4" />
          </div>

          <div className="settings-row__text">
            <span className="settings-row__title">Notifications</span>
            <span className="settings-row__desc">Alerts and reminders</span>
          </div>

          {unreadCount > 0 ? (
            <span className="settings-row__badge">
              {unreadCount} new
            </span>
          ) : (
            <ChevronRight
              className="settings-row__chevron h-4 w-4"
              aria-hidden="true"
            />
          )}
        </Link>

        <button
          type="button"
          className="settings-row"
          onClick={() => togglePanel("support")}
          aria-expanded={openPanel === "support"}
          aria-controls="help-support-panel"
        >
          <div className="settings-row__icon" aria-hidden="true">
            <LifeBuoy className="h-4 w-4" />
          </div>

          <div className="settings-row__text">
            <span className="settings-row__title">Help &amp; Support</span>
            <span className="settings-row__desc">
              Get help with the system
            </span>
          </div>

          <ChevronDown
            className={`settings-row__chevron h-4 w-4 transition-transform ${
              openPanel === "support" ? "settings-row__chevron--rotated" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {openPanel === "support" && (
          <div
            id="help-support-panel"
            className="mt-2 px-2 py-2"
          >
            <ul className="space-y-2">
              {HELP_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full tip-dot"
                    aria-hidden="true"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Logout ── */}
      <section
        className="settings-section settings-section--danger"
        aria-label="Session"
      >
        <button
          type="button"
          onClick={onLogout}
          className="logout-btn"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>

      {hasSession && (
        <p className="settings-session">
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
