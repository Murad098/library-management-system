import { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Loader2,
  Library,
} from "lucide-react";
import BASE_URL from "../config/api";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, form);

      localStorage.setItem("token", res.data.token);

      onLogin();
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT VISUAL PANEL */}
      <div className="login-visual">
        <div className="login-visual-overlay"></div>

        <div className="login-visual-content">
          <div className="login-logo-mark">
            <Library size={24} strokeWidth={1.8} />
          </div>

          <h1 className="login-brand">LibraryHQ</h1>

          <p className="login-quote">
            Make every member count.
          </p>

          <div className="login-visual-line"></div>

          <p className="login-kicker">
            LIBRARY MANAGEMENT SYSTEM
            <span> • </span>
            2026
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="login-form-wrap">
        <div className="login-form-inner">
          <div className="login-mobile-brand">
            <div className="login-logo-mark">
              <Library size={21} strokeWidth={1.8} />
            </div>

            <span>LibraryHQ</span>
          </div>

          <form onSubmit={submit} className="login-card">
            <div className="login-heading">
              <p className="eyebrow accent">Welcome back</p>

              <h2>Sign in to LibraryHQ</h2>

              <p className="login-form-copy">
                Enter your credentials to continue to your dashboard.
              </p>
            </div>

            <div className="login-fields">
              {/* EMAIL */}
              <div className="login-input-group">
                <label htmlFor="email">Email address</label>

                <div className="login-field">
                  <Mail size={17} strokeWidth={1.8} />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    autoComplete="email"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="login-input-group">
                <label htmlFor="password">Password</label>

                <div className="login-field">
                  <LockKeyhole size={17} strokeWidth={1.8} />

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {/* SECURITY NOTE */}
            <div className="secure-note">
              <LockKeyhole size={14} strokeWidth={1.8} />
              <span>Your connection is secure</span>
            </div>
          </form>

          <p className="login-footer">
            LibraryHQ · Library Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;