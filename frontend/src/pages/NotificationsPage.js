import React, { useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Info,
  RefreshCw,
  Send,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { getErrorMessage } from "../services/api";
import { formatDate } from "../utils/format";

const TYPE_META = {
  info: {
    label: "Info",
    icon: Info,
    className: "border-sky-500/25 bg-sky-500/10 text-sky-400",
  },
  success: {
    label: "Success",
    icon: CheckCircle2,
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    className: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  },
  alert: {
    label: "Alert",
    icon: AlertCircle,
    className: "border-red-500/25 bg-red-500/10 text-red-400",
  },
};

const TYPES = Object.keys(TYPE_META);

const EMPTY_FORM = { title: "", message: "", type: "info" };

const NotificationsScreen = ({
  notifications = [],
  unreadCount = 0,
  loading = false,
  onRefresh,
  onAdd,
  onToggleRead,
  onMarkAllRead,
  onDelete,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Give the notification a title.");
      setNotice("");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await onAdd({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
      });

      setForm(EMPTY_FORM);
      setNotice("Notification added.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to add notification."));
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");

    try {
      await onRefresh();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to refresh notifications."));
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleRead = async (item) => {
    setBusyId(item._id);
    setError("");

    try {
      await onToggleRead(item._id, !item.read);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update notification."));
    } finally {
      setBusyId("");
    }
  };

  const handleMarkAllRead = async () => {
    setRefreshing(true);
    setError("");

    try {
      await onMarkAllRead();
      setNotice("All notifications marked as read.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update notifications."));
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete notification "${item.title}"?`)) return;

    setBusyId(item._id);
    setError("");

    try {
      await onDelete(item._id);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete notification."));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="eyebrow-tag">Activity feed</span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {notifications.length} total • {unreadCount} unread
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-ghost w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={refreshing || unreadCount === 0}
            className="btn-ghost w-full sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {notice && !error && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-3 p-4 sm:p-5">
        <h2 className="font-display text-sm font-semibold text-white">
          Add a notification
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_160px]">
          <div>
            <label className="field-label" htmlFor="notification-title">
              Title
            </label>
            <input
              id="notification-title"
              className="input"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="e.g. Fee collection due"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="notification-type">
              Type
            </label>
            <select
              id="notification-type"
              className="input"
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value }))
              }
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_META[type].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="notification-message">
            Message
          </label>
          <textarea
            id="notification-message"
            className="input h-auto min-h-[84px] py-3"
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="Add any details the team should know..."
            maxLength={500}
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={saving}>
            <Send className="h-4 w-4" />
            {saving ? "Adding..." : "Add notification"}
          </button>
        </div>
      </form>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line-strong bg-raised text-slate-400">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No notifications yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Add one above to keep reminders in one place.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-line/70">
            {notifications.map((item) => {
              const meta = TYPE_META[item.type] || TYPE_META.info;
              const Icon = meta.icon;

              return (
                <li
                  key={item._id}
                  className={`flex items-start gap-3 p-4 sm:gap-4 sm:p-5 ${
                    item.read ? "" : "bg-brand/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.className}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      {!item.read && (
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    {item.message && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        {item.message}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-[11px] text-slate-400">
                        {meta.label} • {formatDate(item.createdAt)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleRead(item)}
                        disabled={busyId === item._id}
                        className="min-h-[32px] rounded-lg border border-line-strong px-2.5 text-[11px] font-semibold text-slate-300 transition-colors hover:text-white disabled:opacity-50"
                      >
                        {item.read ? "Mark unread" : "Mark read"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={busyId === item._id}
                    aria-label={`Delete ${item.title}`}
                    className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
