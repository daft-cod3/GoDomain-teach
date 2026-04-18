"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function OverviewIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <rect
        x="3.75"
        y="3.75"
        width="7.5"
        height="7.5"
        rx="2"
        strokeWidth="1.8"
      />
      <rect
        x="12.75"
        y="3.75"
        width="7.5"
        height="4.5"
        rx="2"
        strokeWidth="1.8"
      />
      <rect
        x="12.75"
        y="9.75"
        width="7.5"
        height="10.5"
        rx="2"
        strokeWidth="1.8"
      />
      <rect
        x="3.75"
        y="12.75"
        width="7.5"
        height="7.5"
        rx="2"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StudentsIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M15 19.5v-1.2a3.3 3.3 0 0 0-3.3-3.3H7.8a3.3 3.3 0 0 0-3.3 3.3v1.2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="9.75" cy="8.25" r="3" strokeWidth="1.8" />
      <path
        d="M18.75 19.5v-1.2a3.3 3.3 0 0 0-2.55-3.21"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.45 5.43a2.85 2.85 0 0 1 0 5.64"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LiveLessonsIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="14" rx="3" strokeWidth="1.8" />
      <path
        d="M10 9.25 15 12l-5 2.75V9.25Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 3.75v2.5M16.5 3.75v2.5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContentIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M5 7.25a2.75 2.75 0 0 1 2.75-2.75H11l2 2.5h3.25A2.75 2.75 0 0 1 19 9.75v6.5A2.75 2.75 0 0 1 16.25 19H7.75A2.75 2.75 0 0 1 5 16.25v-9Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 12h7M8.5 15h5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="8" r="3.25" strokeWidth="1.8" />
      <path
        d="M5 18.75a7.25 7.25 0 0 1 14 0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.5 4.5h15v15h-15z"
        strokeWidth="1.2"
        strokeOpacity="0.55"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="m12 3.75 1.2 2.42 2.66.39-1.93 1.88.46 2.65L12 9.82 9.61 11.1l.46-2.65-1.93-1.88 2.66-.39L12 3.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.25" r="3.5" strokeWidth="1.8" />
      <path d="M5.5 18.75h13" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M4 7.5h16M4 12h16M4 16.5h16"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="m6 6 12 12M18 6 6 18" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M8.25 15.75 15.75 8.25M9.75 8.25h6v6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navItems = [
  {
    label: "Overview",
    href: "/",
    badge: "Live",
    hint: "Summary",
    Icon: OverviewIcon,
  },
  {
    label: "Students",
    href: "/students",
    hint: "Learners",
    Icon: StudentsIcon,
  },
  {
    label: "Live Lessons",
    href: "/live-lessons",
    hint: "Sessions",
    Icon: LiveLessonsIcon,
  },
  {
    label: "Content",
    href: "/content",
    hint: "Studio",
    Icon: ContentIcon,
  },
  {
    label: "Profile",
    href: "/teacher",
    hint: "Instructor",
    Icon: ProfileIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    hint: "Preferences",
    Icon: SettingsIcon,
  },
];

export default function SideFoot({ active = "Overview" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const preferred = ["light", "dark", "system"].includes(stored)
      ? stored
      : "system";
    document.documentElement.dataset.theme = preferred;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <div className="nav-shell flex items-center justify-between gap-3 rounded-[24px] px-4 py-3 md:hidden">
        <div className="min-w-0">
          <p className="text-lg font-semibold">GoDomain</p>
          <p className="text-xs font-medium text-[var(--muted)]">
            Teacher dashboard
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="btn btn-primary px-4 py-2"
        >
          <MenuIcon className="h-4 w-4" />
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className="relative">
        {open
          ? <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-10 bg-[rgba(6,12,28,0.44)] backdrop-blur-sm md:hidden"
            />
          : null}

        <aside
          className={`nav-shell ${
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          } fixed inset-y-0 left-0 z-20 flex h-full w-[min(84vw,21rem)] flex-col overflow-y-auto rounded-none px-4 py-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-full md:translate-x-0 md:rounded-[30px] md:px-3 md:py-3 md:opacity-100 xl:top-8 xl:h-[calc(100vh-4rem)] xl:rounded-[32px] xl:px-5 xl:py-5`}
        >
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(150deg,var(--panel-strong),var(--panel-2))] p-4 shadow-[var(--shadow-tight)] backdrop-blur-xl xl:p-5">
              <div className="flex items-start justify-between gap-3 md:flex-col md:items-center md:text-center xl:flex-row xl:items-start xl:text-left">
                <div className="space-y-2">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[16px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--blue),rgba(34,197,94,0.82))] text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[var(--shadow-tight)] xl:mx-0">
                    GT
                  </div>
                  <div>
                    <p className="text-xl font-semibold xl:text-2xl">
                      GoDomain
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--muted-2)]">
                      Teacher dashboard
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="icon-shell flex h-10 w-10 items-center justify-center text-[var(--fg)] md:hidden"
                  aria-label="Close sidebar"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:justify-items-center xl:grid-cols-2 xl:justify-items-stretch">
                <div className="w-full rounded-[22px] border border-[var(--border)] bg-[var(--panel)]/82 px-4 py-3 md:px-3 md:py-3 md:text-center xl:px-4 xl:text-left">
                  <div className="flex items-center gap-3 md:justify-center xl:justify-start">
                    <div className="h-2.5 w-2.5 rounded-full bg-[var(--green)] shadow-[0_0_0_6px_rgba(34,197,94,0.12)]" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-2)]">
                      Status
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[var(--fg)]">
                    Classes running smoothly
                  </p>
                </div>

                <div className="hidden rounded-[22px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(34,197,94,0.14))] px-4 py-3 xl:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-2)]">
                    Today
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--fg)]">
                    18 lessons, 6 open slots
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => {
                const isActive = item.label === active;
                const Icon = item.Icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`nav-item group flex items-center gap-3 rounded-[24px] px-4 py-3.5 text-sm font-medium md:flex-col md:justify-center md:px-2 md:py-3 xl:flex-row xl:justify-between xl:px-4 xl:py-3.5 ${
                      isActive ? "nav-item-active" : "text-[var(--fg)]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex min-w-0 items-center gap-3 md:flex-col md:text-center xl:flex-row xl:text-left">
                      <span
                        className={`icon-shell h-11 w-11 shrink-0 md:h-12 md:w-12 xl:h-11 xl:w-11 ${
                          isActive
                            ? "border-white/20 bg-white/14 text-white"
                            : "text-[var(--blue)] group-hover:-rotate-3 group-hover:scale-110"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {item.label}
                        </span>
                        <span
                          className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] md:hidden xl:block ${
                            isActive ? "text-white/72" : "text-[var(--muted-2)]"
                          }`}
                        >
                          {item.hint}
                        </span>
                      </span>
                    </span>

                    <span className="ml-3 hidden shrink-0 items-center gap-2 xl:flex">
                      {item.badge
                        ? <span
                            className={`chip ${
                              isActive
                                ? "border-white/18 bg-white/14 text-white"
                                : "bg-[var(--green)] text-[var(--fg)]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        : null}

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                          isActive
                            ? "border-white/18 bg-white/12 text-white"
                            : "border-[var(--border)] bg-[var(--panel)]/70 text-[var(--muted)]"
                        }`}
                      >
                        <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden rounded-[28px] bg-[linear-gradient(145deg,var(--blue),rgba(14,35,92,0.92))] p-5 text-white shadow-[0_24px_48px_rgba(29,78,216,0.28)] xl:block">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">Office Pulse</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/78">
                    18 lessons today, 6 new signups, and 2 overdue fee plans
                    still need follow-up.
                  </p>
                </div>
                <div className="rounded-full border border-white/16 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/78">
                  Live
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Attendance", value: "94%" },
                  { label: "Open slots", value: "6" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-md"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/64">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto rounded-[28px] border border-[var(--border)] bg-[linear-gradient(160deg,var(--panel-strong),var(--panel-deep))] p-4 shadow-[var(--shadow-tight)] backdrop-blur-xl xl:p-5">
              <div className="flex items-center gap-3 md:flex-col md:text-center xl:flex-row xl:text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--green),rgba(37,99,235,0.82))] text-sm font-bold text-white shadow-[var(--shadow-tight)]">
                  JW
                </div>
                <div>
                  <p className="text-base font-semibold xl:text-lg">
                    Jane Wambui
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted-2)]">
                    Senior instructor
                  </p>
                </div>
              </div>

              <div className="mt-4 hidden rounded-[22px] border border-[var(--border)] bg-[var(--panel)]/74 px-4 py-3 xl:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
                  Current route
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Westlands circuit and mock test group
                </p>
              </div>

              <button
                type="button"
                className="btn btn-ghost mt-4 hidden w-full xl:inline-flex"
              >
                Switch class
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
