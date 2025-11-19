"use client";

import { useState } from "react";

const notificationOptions = [
  { id: "email", label: "Email alerts" },
  { id: "sms", label: "SMS alerts" },
  { id: "push", label: "Push notifications" },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const toggleNotification = (id) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your profile preferences and notification alerts.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500">
          Update information that is visible across the dashboard.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            First name
            <input
              type="text"
              placeholder="Aisha"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Last name
            <input
              type="text"
              placeholder="Khan"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Email address
            <input
              type="email"
              placeholder="aisha.khan@maktab.com"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Phone number
            <input
              type="tel"
              placeholder="+971 50 123 4567"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </label>
        </div>
        <button className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
          Save profile
        </button>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500">
          Choose how you want to receive alerts about important updates.
        </p>
        <div className="mt-6 space-y-4">
          {notificationOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
            >
              <span>{option.label}</span>
              <input
                type="checkbox"
                checked={notifications[option.id]}
                onChange={() => toggleNotification(option.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
          ))}
        </div>
        <button className="mt-6 rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
          Update preferences
        </button>
      </section>

      <section className="rounded-2xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-700">Danger zone</h2>
        <p className="text-sm text-rose-500">
          Temporarily suspend access or disconnect your account from the
          workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button className="rounded-xl border border-rose-200 px-6 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-400">
            Pause account
          </button>
          <button className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500">
            Deactivate account
          </button>
        </div>
      </section>
    </div>
  );
}


