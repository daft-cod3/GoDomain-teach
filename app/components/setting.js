"use client";

import { useEffect, useState } from "react";

export default function SettingPanel() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const preferred = ["light", "dark", "system"].includes(stored)
      ? stored
      : "system";
    setTheme(preferred);
    document.documentElement.dataset.theme = preferred;
  }, []);

  const setThemeMode = (value) => {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    localStorage.setItem("theme", value);
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
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--panel-2)] p-1 text-xs font-semibold uppercase tracking-[0.12em]">
              {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setThemeMode(option.value)}
                  aria-pressed={theme === option.value}
                  className={`rounded-full px-3 py-1 transition ${
                    theme === option.value
                      ? "bg-[var(--blue)] text-white shadow-[var(--shadow-tight)]"
                      : "text-[var(--fg)]/70 hover:bg-[var(--panel)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
                className="w-1/2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/50"
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
              Email
              <input
                type="email"
                defaultValue="jane@godomain.africa"
                className="w-1/2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/50"
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
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/50"
            />
          </label>
          <label className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium">
            Confirm password
            <input
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/50"
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
