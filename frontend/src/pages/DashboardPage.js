import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Receipt,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { formatCurrency, formatDate, formatMonthYear, initials } from "../utils/format";

const StatCard = ({ label, value, hint, icon: Icon, tone = "default" }) => {
  const tones = {
    default: "text-slate-300 bg-raised border-line-strong",
    brand: "text-brand bg-brand/10 border-brand/25",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    red: "text-red-400 bg-red-500/10 border-red-500/25",
  };

  return (
    <div className="card relative flex flex-col gap-1.5 p-3.5 pr-12 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:p-5 sm:pr-5">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-slate-400">
          {label}
        </div>
        <div className="mt-1 break-words font-display text-base font-bold text-white tabular-nums sm:mt-1.5 sm:text-2xl">
          {value}
        </div>
        <div className="mt-0.5 break-words text-[11px] leading-tight text-slate-400 sm:mt-1 sm:text-xs">
          {hint}
        </div>
      </div>

      <span
        className={`absolute right-3.5 top-3.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:static sm:h-10 sm:w-10 sm:rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
    </div>
  );
};

const Panel = ({ title, subtitle, action, children }) => (
  <div className="card flex flex-col p-4 sm:p-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const EmptyNote = ({ children }) => (
  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line-strong px-4 py-8 text-center text-xs text-slate-400">
    {children}
  </div>
);

const DashboardScreen = ({ members = [], expenses = [], loading = false }) => {
  const navigate = useNavigate();

  const paidMembers = members.filter((member) => member.status === "paid");
  const unpaidMembers = members.filter((member) => member.status !== "paid");

  const expected = members.reduce((sum, member) => sum + member.fee, 0);
  const collected = paidMembers.reduce((sum, member) => sum + member.fee, 0);
  const outstanding = expected - collected;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const net = collected - totalExpenses;
  const collectionRate = expected > 0 ? Math.round((collected / expected) * 100) : 0;

  const comparisonMax = Math.max(collected, totalExpenses, 1);
  const collectedWidth = Math.round((collected / comparisonMax) * 100);
  const expensesWidth = Math.round((totalExpenses / comparisonMax) * 100);

  const recentMembers = members.slice(0, 4);
  const recentExpenses = expenses.slice(0, 4);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 py-28 text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
        <p className="text-sm">Loading library data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="eyebrow-tag">Overview</span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Library performance for {formatMonthYear()}
          </p>
        </div>
        <button
          onClick={() => navigate("/add")}
          className="btn-primary w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Add member
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Members"
          value={members.length}
          hint={`${paidMembers.length} paid • ${unpaidMembers.length} unpaid`}
          icon={Users}
        />
        <StatCard
          label="Fees collected"
          value={formatCurrency(collected)}
          hint={`of ${formatCurrency(expected)} expected`}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          hint={`${unpaidMembers.length} member${
            unpaidMembers.length === 1 ? "" : "s"
          } unpaid`}
          icon={AlertCircle}
          tone={outstanding > 0 ? "red" : "green"}
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(totalExpenses)}
          hint={`${expenses.length} record${expenses.length === 1 ? "" : "s"}`}
          icon={Receipt}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Fee collection"
          subtitle="Paid members against expected monthly fees"
        >
          <div className="mt-auto space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-white tabular-nums">
                {collectionRate}%
              </span>
              <span className="text-xs text-slate-400">
                {formatCurrency(collected)} / {formatCurrency(expected)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {members.length === 0
                ? "No members yet — add a member to start tracking fees."
                : `${paidMembers.length} of ${members.length} members have paid.`}
            </p>
          </div>
        </Panel>

        <Panel
          title="Collected vs expenses"
          subtitle="Fees collected compared with recorded spending"
        >
          <div className="mt-auto space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  Collected
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(collected)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${collectedWidth}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                  Expenses
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-slate-600"
                  style={{ width: `${expensesWidth}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="flex items-center gap-1.5 text-slate-300">
                <TrendingUp className="h-4 w-4 text-brand" />
                Net
              </span>
              <span
                className={`font-bold tabular-nums ${
                  net >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatCurrency(net)}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Recent members"
          subtitle="Most recently added records"
          action={
            <button
              onClick={() => navigate("/members")}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1 px-1 text-xs font-semibold text-slate-400 transition-colors hover:text-brand"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          {recentMembers.length === 0 ? (
            <EmptyNote>No members yet.</EmptyNote>
          ) : (
            <div className="space-y-2">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-inset/60 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/15 text-xs font-bold text-brand">
                      {initials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white">
                        {member.name}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge shrink-0 ${
                      member.status === "paid"
                        ? "border border-emerald-800/60 bg-emerald-950/70 text-emerald-400"
                        : "border border-red-800/60 bg-red-950/70 text-red-400"
                    }`}
                  >
                    {member.status === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent expenses"
          subtitle="Latest spending recorded"
          action={
            <button
              onClick={() => navigate("/expenses")}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1 px-1 text-xs font-semibold text-slate-400 transition-colors hover:text-brand"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          {recentExpenses.length === 0 ? (
            <EmptyNote>No expenses recorded yet.</EmptyNote>
          ) : (
            <div className="space-y-2">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-inset/60 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-raised text-slate-400">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white">
                        {expense.title}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {expense.category} • {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-white tabular-nums">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {members.length > 0 && outstanding === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          All member fees are fully collected.
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
