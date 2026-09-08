import { useState } from "react";
import axios from "axios";
import { ArrowRight, LockKeyhole, Mail, Loader2 } from "lucide-react";
import BASE_URL from "../config/api";
import bg from "../assets/books.jpg";

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
    <div className="flex min-h-screen">

      {/* LEFT SIDE WITH BACKGROUND */}
      <div
        className="hidden lg:flex w-[42%] p-12 text-white flex-col justify-between"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl font-bold">LibraryHQ</h1>

        <p className="text-4xl font-semibold">
          Make every member count.
        </p>

        <p className="text-sm">LIBRARY MANAGEMENT SYSTEM</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={submit}
          className="bg-white p-8 rounded-xl shadow w-[350px]"
        >
          <h2 className="text-xl font-bold mb-6">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-full bg-blue-600 text-white p-2 rounded mt-3"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;