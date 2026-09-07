import { useState } from 'react';
import axios from 'axios';
import { ArrowRight, LockKeyhole, Mail, Loader2 } from 'lucide-react';

const API_URL = "https://library-management-system-pink-eight.vercel.app/api";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      return setError('Enter your email and password to continue.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Enter a valid email address.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="hidden w-[42%] flex-col justify-between bg-[#17243a] p-12 text-white lg:flex">
        <div className="flex items-center gap-3 font-display text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-xl">L</span>
          Library<span className="font-normal text-slate-500">HQ</span>
        </div>
        <div>
          <p className="max-w-md font-display text-5xl font-semibold leading-tight">
            Make every member count.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            A clear, focused workspace for running your library day to day.
          </p>
        </div>
        <p className="text-xs text-slate-500">LIBRARYHQ ADMIN PORTAL</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3 font-display text-xl font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">L</span>
              Library<span className="font-normal text-slate-400">HQ</span>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Admin portal</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-900">Welcome back.</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your library members.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <Mail size={17} className="text-slate-400" />
                <input
                  className="w-full text-sm outline-none"
                  type="email"
                  placeholder="admin@libraryhq.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </span>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <LockKeyhole size={17} className="text-slate-400" />
                <input
                  className="w-full text-sm outline-none"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
              </span>
            </label>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            Protected admin access · LibraryHQ
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;