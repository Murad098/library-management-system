import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/ToastCenter";
import { BRAND_LOGO } from "../config/brand";
import api, { getErrorMessage, TOKEN_KEY } from "../services/api";
import {
  requestPasswordResetOtp,
  resetPassword,
  verifyPasswordResetOtp,
} from "../services/authService";

function LoginPage({ onSignInSuccess }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState("request");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetStatus, setResetStatus] = useState({ tone: "", message: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      storage.setItem(TOKEN_KEY, response.data.token);

      showToast("Welcome back! Login successful.", "success");
      navigate("/", { replace: true });
      onSignInSuccess();
    } catch (error) {
      showToast(
        getErrorMessage(error, "Unable to sign in. Please try again."),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openReset = () => {
    setResetEmail(email.trim());
    setResetStep("request");
    setResetOtp("");
    setResetNewPassword("");
    setResetConfirm("");
    setResetStatus({ tone: "", message: "" });
    setShowReset(true);
  };

  const handleSendResetCode = async (event) => {
    event.preventDefault();
    setResetStatus({ tone: "", message: "" });

    if (!resetEmail.trim()) {
      setResetStatus({
        tone: "error",
        message: "Enter the administrator email address.",
      });
      return;
    }

    setResetLoading(true);

    try {
      const response = await requestPasswordResetOtp(resetEmail.trim());

      setResetStep("verify");
      setResetStatus({
        tone: "success",
        message:
          response.data.message || `A 6-digit code was sent to ${resetEmail.trim()}.`,
      });
    } catch (error) {
      setResetStatus({
        tone: "error",
        message: getErrorMessage(error, "Unable to send the reset code."),
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setResetStatus({ tone: "", message: "" });

    if (!resetOtp.trim()) {
      setResetStatus({
        tone: "error",
        message: "Enter the code from your email.",
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
      const verified = await verifyPasswordResetOtp(
        resetEmail.trim(),
        resetOtp.trim()
      );

      await resetPassword(verified.data.resetToken, resetNewPassword);

      setResetOtp("");
      setResetNewPassword("");
      setResetConfirm("");
      setResetStep("done");
      setResetStatus({
        tone: "success",
        message: "Password reset. You can sign in now.",
      });
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
    setResetStep("request");
    setResetOtp("");
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
              onClick={() => (showReset ? closeReset() : openReset())}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {showReset && (
          <form
            className="login-reset"
            onSubmit={
              resetStep === "request" ? handleSendResetCode : handleResetSubmit
            }
          >
            <p className="login-reset__title">Reset your password</p>

            {resetStep === "request" && (
              <>
                <p className="login-reset__hint">
                  Enter the administrator email address and we will send a
                  6-digit verification code to it.
                </p>
                <input
                  className="login-reset__input"
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="Admin email"
                  autoComplete="email"
                  required
                />
              </>
            )}

            {resetStep === "verify" && (
              <>
                <p className="login-reset__hint">
                  Enter the 6-digit code sent to {resetEmail}, then choose a new
                  password.
                </p>
                <input
                  className="login-reset__input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={resetOtp}
                  onChange={(event) =>
                    setResetOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6-digit code"
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
              </>
            )}

            {resetStep === "done" && (
              <p className="login-reset__hint">
                Your password has been reset. Sign in above with your new
                password.
              </p>
            )}

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
              {resetStep === "request" && (
                <>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={closeReset}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending..." : "Send code"}
                  </button>
                </>
              )}

              {resetStep === "verify" && (
                <>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      setResetStep("request");
                      setResetOtp("");
                      setResetStatus({ tone: "", message: "" });
                    }}
                  >
                    Change email
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Resetting..." : "Reset password"}
                  </button>
                </>
              )}

              {resetStep === "done" && (
                <button type="button" className="btn-primary" onClick={closeReset}>
                  Back to login
                </button>
              )}
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
