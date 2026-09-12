import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Search, Trash2, UserPlus, Users } from "lucide-react";

import { getErrorMessage } from "../services/api";
import { formatCurrency, formatDate, initials } from "../utils/format";

const STATUS_FILTERS = ["All", "Paid", "Unpaid"];

const StatusBadge = ({ isPaid }) => (
  <span
    className={`badge ${
      isPaid
        ? "border border-emerald-800/60 bg-emerald-950/70 text-emerald-400"
        : "border border-red-800/60 bg-red-950/70 text-red-400"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-red-400"}`}
    />
    {isPaid ? "Paid" : "Unpaid"}
  </span>
);

const MembersScreen = ({ members = [], loading = false, onDeleteMember }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      if (statusFilter !== "All" && member.status !== statusFilter.toLowerCase()) {
        return false;
      }

      if (!query) return true;

      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query)
      );
    });
  }, [members, search, statusFilter]);

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Delete member "${member.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(member.id);
    setError("");

    try {
      await onDeleteMember(member.id);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete member."));
    } finally {
      setDeletingId(null);
    }
  };

  const paidCount = members.filter((member) => member.status === "paid").length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Members
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {members.length} registered • {paidCount} paid •{" "}
            {members.length - paidCount} unpaid
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

      <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search members"
            className="input h-11 pl-10"
          />
        </div>

        <div className="flex w-full rounded-xl border border-line-strong bg-raised p-1 sm:w-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              aria-pressed={statusFilter === filter}
              className={`h-11 flex-1 rounded-lg px-3 text-xs font-semibold transition-colors lg:h-9 sm:flex-none ${
                statusFilter === filter
                  ? "bg-brand text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
            <p className="text-sm">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line-strong bg-raised text-slate-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No members yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Add your first member to start tracking fees.
              </p>
            </div>
            <button onClick={() => navigate("/add")} className="btn-primary mt-1">
              <UserPlus className="h-4 w-4" />
              Add member
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-400">
            No members match the current search or filter.
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <ul className="divide-y divide-line/70 xl:hidden">
              {filtered.map((member) => {
                const isPaid = member.status === "paid";

                return (
                  <li key={member.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/15 text-xs font-bold text-brand">
                        {initials(member.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {member.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              {member.email}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            disabled={deletingId === member.id}
                            aria-label={`Delete ${member.name}`}
                            className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <StatusBadge isPaid={isPaid} />
                          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-slate-400">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{member.phone || "—"}</span>
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                          <span className="text-xs text-slate-400">
                            Joined {formatDate(member.createdAt)}
                          </span>
                          <span className="shrink-0 text-sm font-bold text-white tabular-nums">
                            {formatCurrency(member.fee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Wide screens: table */}
            <div className="hidden w-full overflow-x-auto xl:block">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-inset/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5">Member</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Joined</th>
                    <th className="px-5 py-3.5 text-right">Monthly fee</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70 text-sm">
                  {filtered.map((member) => {
                    const isPaid = member.status === "paid";

                    return (
                      <tr
                        key={member.id}
                        className="transition-colors hover:bg-raised/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/15 text-xs font-bold text-brand">
                              {initials(member.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-white">
                                {member.name}
                              </div>
                              <div className="truncate text-xs text-slate-400">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">
                          {member.phone || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <StatusBadge isPaid={isPaid} />
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">
                          {formatDate(member.createdAt)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-white tabular-nums">
                          {formatCurrency(member.fee)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            disabled={deletingId === member.id}
                            aria-label={`Delete ${member.name}`}
                            title="Delete member"
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
      </div>
    </div>
  );
};

export default MembersScreen;
