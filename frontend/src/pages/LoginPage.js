import { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api"; // ✅ LOCAL

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Enter email & password");
    }

    // ✅ FIXED REGEX
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError("Invalid email format");
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      onLogin();

    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-80 space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">
          Login
        </h2>

        <div className="flex items-center border p-2 rounded">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Email"
            className="ml-2 w-full outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="flex items-center border p-2 rounded">
          <LockKeyhole size={18} />
          <input
            type="password"
            placeholder="Password"
            className="ml-2 w-full outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded flex justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Loading...
            </>
          ) : (
            <>
              <ArrowRight size={16} />
              Login
            </>
          )}
        </button>
      </form>

    </div>
  );
}

export default LoginPage;