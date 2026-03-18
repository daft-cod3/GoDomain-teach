"use client";

import { useEffect, useState } from "react";

export default function SettingPanel() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const preferred =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(preferred);
    document.documentElement.dataset.theme = preferred;
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
              Settings
            </p>
            <h1 className="font-display text-3xl font-semibold">Preferences</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="btn btn-ghost">
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
            <span className="chip bg-[var(--green)] text-[var(--fg)]">
              Saved
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-6">
          <h2 className="font-display text-2xl font-semibold">Account</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
              Name
              <input
                type="text"
                defaultValue="Jane Wambui"
                className="w-1/2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
              Email
              <input
                type="email"
                defaultValue="jane@godomain.africa"
                className="w-1/2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-2xl font-semibold">Notifications</h2>
          <div className="mt-4 space-y-3 text-sm font-medium text-[var(--fg)]/80">
            {[
              "New student signup",
              "Overdue fee alerts",
              "Quiz completion",
              "Lesson feedback",
            ].map((item, index) => (
              <label
                key={item}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3"
              >
                <span>{item}</span>
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className="h-4 w-4 accent-[var(--blue)]"
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-2xl font-semibold">Security</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
            New password
            <input
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
            Confirm password
            <input
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
          <button type="button" className="btn btn-ghost">
            Reset
          </button>
        </div>
      </section>
    </div>
  );
}
