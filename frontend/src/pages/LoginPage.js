import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, Zap, BookOpen } from 'lucide-react';

const SignInScreen = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('secretpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess();
    }, 450);
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row w-full bg-[#0d1117] text-slate-200">
      {/* BEGIN: HeroBrandShowcase (Left Pane ~55%) */}
      <section className="relative w-full lg:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 hero-glow">
        {/* Decorative background grid */}
        <div className="absolute inset-0 library-grid-pattern pointer-events-none opacity-40"></div>
        {/* Subtle top decorative bar glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>

        {/* Top Header / Logo */}
        <header className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-500">
              <BookOpen className="h-7 w-7" />
            </span>
            <span>Libra<span className="text-amber-500">HQ</span></span>
          </div>
        </header>

        {/* Center Hero Content */}
        <div className="relative z-10 my-16 lg:my-auto max-w-xl">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Enterprise Edition 2026
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Make every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              member
            </span>{' '}
            count.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed mb-8">
            The unified operating system for modern study libraries and reading halls. Manage desks, admissions, fee collections, and expenses seamlessly.
          </p>

          {/* Feature Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-2.5 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg px-3.5 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">Real-Time Desk Allocation</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg px-3.5 py-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">Automated Fee Reminders</span>
            </div>
          </div>
        </div>

        {/* Bottom Panel Status */}
        <footer className="relative z-10 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 tracking-wider uppercase">
          <span>LIBRARY MANAGEMENT SYSTEM • 2026</span>
          <div className="flex items-center gap-2 text-slate-400 normal-case font-normal">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Core Services: Operational</span>
          </div>
        </footer>
      </section>
      {/* END: HeroBrandShowcase */}

      {/* BEGIN: AuthenticationPanel (Right Pane ~45%) */}
      <section className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 bg-[#090d13]">
        {/* Elevated Auth Card Container */}
        <div className="w-full max-w-md bg-[#161b22] border border-[#2d3545] rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

          {/* Form Header */}
          <div className="mb-7">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase inline-block mb-2">
              Welcome Back
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Sign in to LibraHQ
            </h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to continue to your dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2" htmlFor="email">
                Email address
              </label>
              <div className="relative rounded-lg border border-[#2d3545] bg-[#10141d] transition duration-150 gold-focus">
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
                  className="block w-full rounded-lg bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 focus:outline-none border-0"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to administrator email.')}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative rounded-lg border border-[#2d3545] bg-[#10141d] transition duration-150 gold-focus">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg bg-transparent py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password view"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs text-slate-300 font-medium select-none cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>

            {/* Primary Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold text-sm py-3 px-4 shadow-lg shadow-amber-500/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 group disabled:opacity-75 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying credentials...' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-center">
            <button
              type="button"
              onClick={onSignInSuccess}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline decoration-dotted"
            >
              Fast-track: Enter Dashboard directly as Administrator
            </button>
          </div>

          {/* Card Bottom Security Badge */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/90" />
            <span>Your connection is secure (256-bit SSL)</span>
          </div>
        </div>

        {/* Footer Copyright Note */}
        <p className="mt-8 text-center text-xs text-slate-500 font-normal">
          LibraHQ • Library Management System © 2026
        </p>
      </section>
      {/* END: AuthenticationPanel */}
    </main>
  );
};

export default SignInScreen;
