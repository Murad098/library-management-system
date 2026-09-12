import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { BRAND_LOGO } from "../config/brand";
import api, { getErrorMessage, TOKEN_KEY } from "../services/api";
import { resetPassword } from "../services/authService";

function LoginPage({ onSignInSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetStatus, setResetStatus] = useState({ tone: "", message: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      storage.setItem(TOKEN_KEY, response.data.token);

      onSignInSuccess();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to sign in. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setResetStatus({ tone: "", message: "" });

    if (!email.trim()) {
      setResetStatus({
        tone: "error",
        message: "Enter your email above first.",
      });
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetStatus({
        tone: "error",
        message: "New password must be at least 6 characters.",
      });
      return;
    }

    if (resetNewPassword !== resetConfirm) {
      setResetStatus({
        tone: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setResetLoading(true);

    try {
      await resetPassword(email, resetCode, resetNewPassword);
      setResetStatus({
        tone: "success",
        message: "Password reset. You can sign in now.",
      });
      setResetCode("");
      setResetNewPassword("");
      setResetConfirm("");
    } catch (error) {
      setResetStatus({
        tone: "error",
        message: getErrorMessage(error, "Unable to reset the password."),
      });
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setResetCode("");
    setResetNewPassword("");
    setResetConfirm("");
    setResetStatus({ tone: "", message: "" });
  };

  return (
    <main className="login-screen">
      <div className="login-theme">
        <ThemeToggle />
      </div>

      <div className="login-body">
        <header className="login-head">
          <img className="login-logo" src={BRAND_LOGO} alt="" />
          <h1 className="login-title">Library Management System</h1>
          <p className="login-subtitle">Manage your library account</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <User className="login-field__icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="login-email">
              Username or Email
            </label>
            <input
              id="login-email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Username or Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field login-field--action">
            <Lock className="login-field__icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="login-field__toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="login-submit" disabled={isLoading}>
            <User size={18} strokeWidth={2.5} />
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <div className="login-meta">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="login-forgot"
              onClick={() => (showReset ? closeReset() : setShowReset(true))}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {showReset && (
          <form className="login-reset" onSubmit={handleResetSubmit}>
            <p className="login-reset__title">Reset your password</p>
            <p className="login-reset__hint">
              Enter a recovery code created from your Profile, then choose a new
              password.
            </p>

            <input
              className="login-reset__input"
              type="text"
              value={resetCode}
              onChange={(event) => setResetCode(event.target.value)}
              placeholder="Recovery code"
              autoComplete="one-time-code"
            />
            <input
              className="login-reset__input"
              type="password"
              value={resetNewPassword}
              onChange={(event) => setResetNewPassword(event.target.value)}
              placeholder="New password"
              autoComplete="new-password"
            />
            <input
              className="login-reset__input"
              type="password"
              value={resetConfirm}
              onChange={(event) => setResetConfirm(event.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />

            {resetStatus.message && (
              <p
                role="alert"
                className={`text-xs font-semibold ${
                  resetStatus.tone === "success"
                    ? "text-emerald-400"
                    : "text-red-300"
                }`}
              >
                {resetStatus.message}
              </p>
            )}

            <div className="login-reset__actions">
              <button type="button" className="btn-ghost" onClick={closeReset}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={resetLoading}
              >
                {resetLoading ? "Resetting..." : "Reset password"}
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className="login-foot">
        © {new Date().getFullYear()} Library Management System
      </footer>
    </main>
  );
}

export default LoginPage;
