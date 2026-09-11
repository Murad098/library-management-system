import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import Backdrop from "../components/Backdrop";
import { BRAND_LOGO } from "../config/brand";
import api, { getErrorMessage, TOKEN_KEY } from "../services/api";

function LoginPage({ onSignInSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showResetHint, setShowResetHint] = useState(false);
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

  return (
    <main className="login-screen">
      <Backdrop />

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
              onClick={() => setShowResetHint((shown) => !shown)}
            >
              Forgot Password?
            </button>
          </div>

          {showResetHint && (
            <p className="login-hint">
              Ask your administrator to reset your password.
            </p>
          )}
        </form>
      </div>

      <footer className="login-foot">
        © {new Date().getFullYear()} Library Management System
      </footer>
    </main>
  );
}

export default LoginPage;
