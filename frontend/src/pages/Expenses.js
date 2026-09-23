import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Bus,
  CheckCircle2,
  Plus,
  Receipt,
  ShoppingBag,
  Tag,
  Edit3,
  Trash2,
  TrendingUp,
  Utensils,
} from "lucide-react";

import { getErrorMessage, readSessionUser } from "../services/api";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatDate,
  formatMonthYear,
  isSameMonth,
  toDateInputValue,
} from "../utils/format";

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Bus,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: BookOpen,
  Other: Tag,
};

const CATEGORY_BADGE = "border border-line-strong bg-raised text-slate-300";

const CATEGORIES = Object.keys(CATEGORY_ICONS);
const FILTERS = ["All", "This month", ...CATEGORIES];

const ExpensesScreen = ({
  expenses = [],
  loading = false,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => toDateInputValue());
  const [category, setCategory] = useState("Other");
  const [filter, setFilter] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { role } = readSessionUser();

  const totalAll = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const totalThisMonth = useMemo(
    () =>
      expenses
        .filter((expense) => isSameMonth(expense.date))
        .reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const filtered = useMemo(
    () =>
      expenses.filter((expense) => {
        if (filter === "All") return true;
        if (filter === "This month") return isSameMonth(expense.date);
        return expense.category === filter;
      }),
    [expenses, filter]
  );

  const filteredTotal = filtered.reduce((sum, expense) => sum + expense.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const expense = await onAddExpense({
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
      });

      setSuccess(
        `Recorded "${expense.title}" for ${formatCurrency(expense.amount)}.`
      );
      setTitle("");
      setAmount("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to record expense."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `Delete expense "${expense.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(expense.id);
    setError("");

    try {
      await onDeleteExpense(expense.id);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete expense."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (expense) => {
    const title = window.prompt("Expense title", expense.title);
    if (title === null) return;
    const amount = window.prompt("Amount", String(expense.amount));
    if (amount === null) return;
    const category = window.prompt(`Category (${CATEGORIES.join(", ")})`, expense.category);
    if (category === null) return;
    const date = window.prompt("Date (YYYY-MM-DD)", String(expense.date).slice(0, 10));
    if (date === null) return;

    try {
      await onUpdateExpense(expense.id, {
        title: title.trim(), amount: Number(amount),
        category: CATEGORIES.includes(category) ? category : "Other", date,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update expense."));
    }
  };

  return (
    <div className="feature-page expenses-page mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Expenses
          </h1>
        </div>

        <div className="card flex w-full items-center justify-between gap-4 p-4 lg:w-auto lg:min-w-[260px]">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {formatMonthYear()}
            </div>
            <div className="mt-1 truncate font-display text-2xl font-bold text-white tabular-nums">
              {formatCurrency(totalThisMonth)}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-400">
              {formatCurrency(totalAll)} recorded in total
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {(error || success) && (
        <div
          className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {error ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{error || success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5">
        <h2 className="mb-5 font-display text-sm font-bold text-white">
          Log an expense
        </h2>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="field-label" htmlFor="expense-title">
              Expense title
            </label>
            <input
              id="expense-title"
              type="text"
              className="input"
              placeholder="e.g. Electricity bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="expense-amount">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-400">
                PKR
              </span>
              <input
                id="expense-amount"
                type="number"
                className="input pl-12"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="expense-date">
              Date
            </label>
            <input
              id="expense-date"
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="field-label" htmlFor="expense-category">
              Category
            </label>
            <select
              id="expense-category"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              {submitting ? "Recording..." : "Record expense"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                All expenses
              </h2>
              <span className="rounded-full border border-line-strong bg-raised px-2.5 py-1 text-xs font-medium text-slate-300">
                {expenses.length} total
              </span>
            </div>
          </div>

          <div className="flex w-full gap-1 overflow-x-auto rounded-xl border border-line-strong bg-raised p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto sm:flex-wrap sm:overflow-visible">
            {FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`h-11 shrink-0 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-colors lg:h-9 ${
                  filter === option
                    ? "bg-brand text-slate-950"
                    : "text-slate-400 hover:bg-line hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
              <p className="text-sm">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line-strong bg-raised text-slate-400">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  No expenses recorded
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Log your first expense using the form above.
                </p>
              </div>
            </div>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-400">
                  No expenses match the "{filter}" filter.
                </div>
              ) : (
                <>
                  {/* Mobile: card list */}
                  <ul className="divide-y divide-line/70 md:hidden">
                    {filtered.map((expense) => {
                      const Icon =
                        CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;

                      return (
                        <li key={expense.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-raised">
                              <Icon className="h-4 w-4 text-slate-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-3">
                                <p className="truncate text-sm font-semibold text-white">
                                  {expense.title}
                                </p>
                                <span className="shrink-0 text-sm font-bold text-white tabular-nums">
                                  {formatCurrencyPrecise(expense.amount)}
                                </span>
                              </div>

                              <div className="mt-2.5 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className={`badge shrink-0 ${CATEGORY_BADGE}`}>
                                    {expense.category}
                                  </span>
                                  <span className="truncate text-xs text-slate-400">
                                    {formatDate(expense.date)}
                                  </span>
                                </div>

                                {role === "owner" && <button
                                  type="button"
                                  onClick={() => handleEdit(expense)}
                                  aria-label={`Edit ${expense.title}`}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-brand/10 hover:text-brand"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>}
                                {role === "owner" && <button
                                  type="button"
                                  onClick={() => handleDelete(expense)}
                                  disabled={deletingId === expense.id}
                                  aria-label={`Delete ${expense.title}`}
                                  className="-mb-2 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Tablet and up: table */}
                  <div className="hidden w-full overflow-x-auto md:block">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-line bg-inset/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-5 py-3.5">Expense</th>
                          <th className="px-4 py-3.5">Category</th>
                          <th className="px-4 py-3.5">Date</th>
                          <th className="px-5 py-3.5 text-right">Amount</th>
                          <th className="px-4 py-3.5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/70 text-sm">
                        {filtered.map((expense) => {
                          const Icon =
                            CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;

                          return (
                            <tr
                              key={expense.id}
                              className="transition-colors hover:bg-raised/40"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-raised">
                                    <Icon className="h-4 w-4 text-slate-400" />
                                  </div>
                                  <div className="font-semibold text-white">
                                    {expense.title}
                                  </div>
                                </div>
                              </td>

                              <td className="whitespace-nowrap px-4 py-4">
                                <span className={`badge ${CATEGORY_BADGE}`}>
                                  {expense.category}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">
                                {formatDate(expense.date)}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-white tabular-nums">
                                {formatCurrencyPrecise(expense.amount)}
                              </td>

                              <td className="whitespace-nowrap px-4 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(expense)}
                                  aria-label={`Edit ${expense.title}`}
                                  title="Edit expense"
                                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-brand/10 hover:text-brand"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(expense)}
                                  disabled={deletingId === expense.id}
                                  aria-label={`Delete ${expense.title}`}
                                  title="Delete expense"
                                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1 border-t border-line p-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-white">{filtered.length}</span>{" "}
                  of <span className="font-semibold text-white">{expenses.length}</span>{" "}
                  expenses
                </span>
                <span>
                  Filtered total:{" "}
                  <span className="font-semibold text-white tabular-nums">
                    {formatCurrencyPrecise(filteredTotal)}
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesScreen;
