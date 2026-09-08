import { useState } from "react";
import axios from "axios";
import { ArrowRight, LockKeyhole, Mail, Loader2 } from "lucide-react";
import BASE_URL from "../config/api";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Enter email & password");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, form);

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div
        className="login-visual"
        style={{
          backgroundColor: "#17243a",
        }}
      >
        <h1 className="login-brand">LibraryHQ</h1>

        <p className="login-quote">
          Make every member count.
        </p>

        <p className="login-kicker">LIBRARY MANAGEMENT SYSTEM <span>•</span> 2026</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-wrap">
        <form
          onSubmit={submit}
          className="login-card"
        >
          <p className="eyebrow accent">Welcome back</p><h2>Sign in to LibraryHQ</h2><p className="login-form-copy">Enter your details to continue to your dashboard.</p>

          <div className="login-field">
            <Mail size={16} />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="login-field">
            <LockKeyhole size={16} />
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            className="primary-button login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Login <ArrowRight size={16} />
              </>
            )}
          </button><p className="secure-note"><LockKeyhole size={13} /> Your connection is secure</p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;