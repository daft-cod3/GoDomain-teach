"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Overview", href: "/", badge: "Live" },
  { label: "Students", href: "/students" },
  { label: "Content", href: "/content" },
  { label: "Messages", href: "/#messages" },
  { label: "Reports", href: "/#reports" },
  { label: "Settings", href: "/settings" },
];

export default function SideFoot({ active = "Dashboard" }) {
  const [open, setOpen] = useState(false);
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
    <>
      <div className="panel flex items-center justify-between px-4 py-3 md:hidden">
        <div>
          <p className="text-lg font-semibold">GoDomain</p>
          <p className="text-xs font-medium text-[var(--fg)]/60">
            Teacher dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="btn btn-primary"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div className="relative">
        {open ? (
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-[rgba(6,12,28,0.5)] md:hidden"
          />
        ) : null}

        <aside
          className={`${
            open ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-0 z-20 h-full w-[280px] border-r border-[var(--border)] bg-[var(--panel)] px-6 py-6 transition-transform duration-300 md:static md:h-auto md:w-full md:translate-x-0 md:rounded-3xl md:border md:shadow-[var(--shadow-tight)] md:sticky md:top-6`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold">GoDomain</p>
              <p className="text-xs font-medium text-[var(--fg)]/60">
                Teacher dashboard
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-ghost"
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel-2)] text-xs font-semibold">
                GT
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = item.label === active;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--blue)] text-white shadow-[var(--shadow-tight)]"
                      : "bg-[var(--panel)] text-[var(--fg)] hover:bg-[var(--panel-2)] hover:-translate-y-0.5"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="chip bg-[var(--green)] text-[var(--fg)]">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--blue)] p-5 text-white shadow-[var(--shadow-tight)]">
            <p className="text-lg font-semibold">Office Pulse</p>
            <p className="mt-2 text-sm font-medium text-white/80">
              18 lessons today, 6 new signups, 2 overdue fee plans.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
              <span>Live line</span>
              <span className="chip border-white text-white">
                24/7
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-5 text-[var(--fg)] shadow-[var(--shadow-tight)]">
            <p className="text-lg font-semibold">Jane Wambui</p>
            <p className="mt-1 text-xs font-medium text-[var(--fg)]/60">
              Senior instructor
            </p>
            <button
              type="button"
              className="mt-4 w-full btn btn-ghost"
            >
              Switch class
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
