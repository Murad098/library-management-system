import React from "react";
import {
  Bell,
  Clock,
  LifeBuoy,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { readSessionUser } from "../services/api";
import { initials } from "../utils/format";

const SETTINGS = [
  {
    key: "password",
    label: "Change Password",
    description: "Update your account password",
    icon: Lock,
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Alerts and reminders",
    icon: Bell,
  },
  {
    key: "support",
    label: "Help & Support",
    description: "Get help with the system",
    icon: LifeBuoy,
  },
];

function ProfilePage({ onLogout }) {
  const { name, email, role, expiresAt } = readSessionUser();
  const hasSession = expiresAt && !Number.isNaN(expiresAt.getTime());

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-5">
      <header className="min-w-0">
        <span className="eyebrow-tag">Account</span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your administrator account
        </p>
      </header>

      <section className="profile-identity" aria-label="Account details">
        <span className="profile-avatar" aria-hidden="true">
          {initials(name)}
        </span>

        <div className="profile-identity__text">
          <p className="profile-name">{name}</p>
          <p className="profile-email">{email || "Signed in"}</p>

          <span className="profile-role">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {role}
          </span>
        </div>
      </section>

      <section className="profile-menu" aria-label="Account settings">
        {SETTINGS.map(({ key, label, description, icon: Icon }) => (
          <div key={key} className="profile-row profile-row--soon" aria-disabled="true">
            <span className="profile-row__icon" aria-hidden="true">
              <Icon className="h-4 w-4" />
            </span>

            <span className="profile-row__text">
              <span className="profile-row__title">{label}</span>
              <span className="profile-row__desc">{description}</span>
            </span>

            <span className="profile-soon">Soon</span>
          </div>
        ))}
      </section>

      <section className="profile-menu" aria-label="Session">
        <button type="button" onClick={onLogout} className="profile-row profile-row--danger">
          <span className="profile-row__icon" aria-hidden="true">
            <LogOut className="h-4 w-4" />
          </span>

          <span className="profile-row__text">
            <span className="profile-row__title">Logout</span>
            <span className="profile-row__desc">End this session</span>
          </span>
        </button>
      </section>

      {hasSession && (
        <p className="profile-session">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Session active until{" "}
          {expiresAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
