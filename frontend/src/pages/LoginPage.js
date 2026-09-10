import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Zap,
} from "lucide-react";

import api, { getErrorMessage, TOKEN_KEY } from "../services/api";

const HIGHLIGHTS = [
  ["Member records and contact details", CheckCircle2],
  ["Fee and payment status tracking", Zap],
];

const SignInScreen = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <main className="flex min-h-screen w-full flex-col bg-base text-slate-200 lg:flex-row">
      {/* Brand showcase */}
      <section className="hero-glow relative flex w-full flex-col justify-between overflow-hidden border-b border-line p-8 sm:p-12 lg:w-[55%] lg:border-b-0 lg:border-r lg:p-16">
        <div className="library-grid-pattern pointer-events-none absolute inset-0 opacity-40"></div>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand/0 via-brand/50 to-brand/0"></div>

        <header className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand">
              <BookOpen className="h-7 w-7" />
            </span>
            <span>
              Libra<span className="text-brand">HQ</span>
            </span>
          </div>
        </header>

        <div className="relative z-10 my-16 max-w-xl lg:my-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand"></span>
            Library Management System
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Make every{" "}
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-brand-500 bg-clip-text text-transparent">
              member
            </span>{" "}
            count.
          </h1>

          <p className="mb-8 text-base font-normal leading-relaxed text-slate-400 sm:text-lg">
            Keep members, fee collections and library expenses in one place, with
            a clear view of how the library is running.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2 text-sm text-slate-300 sm:grid-cols-2">
            {HIGHLIGHTS.map(([label, Icon]) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-raised/60 px-3.5 py-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-brand" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
          <span>LibraHQ • Library Management System</span>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </section>

      {/* Authentication panel */}
      <section className="flex w-full flex-col items-center justify-center bg-[#090d13] p-6 sm:p-12 lg:w-[45%] lg:p-14">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line-strong bg-raised p-7 shadow-2xl shadow-black/60 sm:p-9">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent"></div>

          <div className="mb-7">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-brand">
              Welcome Back
            </span>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sign in to LibraHQ
            </h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to continue to the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="gold-focus relative rounded-lg border border-line-strong bg-inset transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="block w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
              <div className="gold-focus relative rounded-lg border border-line-strong bg-inset transition">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-brand focus:ring-brand focus:ring-offset-slate-900"
              />
              <label
                htmlFor="remember-me"
                className="ml-2.5 block cursor-pointer select-none text-xs font-medium text-slate-300"
              >
                Keep me signed in on this device
              </label>
            </div>

            {errorMessage && (
              <p
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand/20 transition-all duration-150 hover:bg-brand-400 active:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-75"
            >
              <span>{isLoading ? "Verifying credentials..." : "Sign in"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-4 border-t border-line pt-4 text-center text-xs text-slate-500">
            Administrator access only.
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;
