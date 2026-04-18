"use client";

import { useEffect, useState } from "react";

function SunIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M18.25 14.5a7.25 7.25 0 1 1-8.75-8.75 6 6 0 0 0 8.75 8.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MonitorIcon(props) {
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
        y="4.5"
        width="16.5"
        height="11.5"
        rx="2.5"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 19.5h7M12 16.25v3.25"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon(props) {
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
        d="M5.5 18.5a7 7 0 0 1 13 0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M6.75 15.5v-4a5.25 5.25 0 0 1 10.5 0v4l1.25 2H5.5l1.25-2Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 19.25a2.25 2.25 0 0 0 4 0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M12 3.75 18 6v5.25c0 4.15-2.57 7.67-6 9-3.43-1.33-6-4.85-6-9V6l6-2.25Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.75 12.25 1.5 1.5 3.25-3.5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaletteIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M12 4a8 8 0 1 0 0 16h1.25A2.75 2.75 0 0 0 16 17.25a1.75 1.75 0 0 1 1.75-1.75H19A3 3 0 0 0 22 12c0-4.42-4.48-8-10-8Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="7.75" cy="11" r="1" strokeWidth="1.8" />
      <circle cx="10.5" cy="7.75" r="1" strokeWidth="1.8" />
      <circle cx="14.75" cy="7.75" r="1" strokeWidth="1.8" />
      <circle cx="16.5" cy="11.75" r="1" strokeWidth="1.8" />
    </svg>
  );
}

const themeOptions = [
  {
    value: "light",
    label: "Light",
    note: "Bright workspace",
    Icon: SunIcon,
    toneClass: "text-[var(--amber)]",
  },
  {
    value: "dark",
    label: "Dark",
    note: "Focused contrast",
    Icon: MoonIcon,
    toneClass: "text-[var(--blue)]",
  },
  {
    value: "system",
    label: "System",
    note: "Follow device",
    Icon: MonitorIcon,
    toneClass: "text-[var(--green)]",
  },
];

const initialNotifications = [
  {
    id: "signup",
    title: "New student signup",
    detail: "Alert the team when a learner joins a class pipeline.",
    enabled: true,
  },
  {
    id: "fees",
    title: "Overdue fee alerts",
    detail: "Surface payment follow-ups before class scheduling slips.",
    enabled: true,
  },
  {
    id: "quiz",
    title: "Quiz completion",
    detail: "Track who finishes a theory set and review weak areas quickly.",
    enabled: true,
  },
  {
    id: "feedback",
    title: "Lesson feedback",
    detail: "Receive student comments after each practical or live lesson.",
    enabled: false,
  },
];

const accountHighlights = [
  "Instructor profile synced",
  "Student-facing card updated",
  "Theme preference saved locally",
];

const previewPills = [
  "Glass panels",
  "Smooth transitions",
  "Readable contrast",
  "Adaptive surfaces",
];

const themeOrder = themeOptions.map((option) => option.value);

function getThemeLabel(theme) {
  if (theme === "system") {
    return "System sync";
  }

  return `${theme.charAt(0).toUpperCase()}${theme.slice(1)} mode`;
}

function getNextTheme(theme) {
  const currentIndex = themeOrder.indexOf(theme);
  return themeOrder[(currentIndex + 1) % themeOrder.length] ?? "system";
}

export default function SettingPanel() {
  const [theme, setTheme] = useState("system");
  const [notificationSettings, setNotificationSettings] =
    useState(initialNotifications);

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

  const toggleNotification = (id) => {
    setNotificationSettings((currentSettings) =>
      currentSettings.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const enabledNotifications = notificationSettings.filter(
    (item) => item.enabled,
  ).length;
  const activeTheme =
    themeOptions.find((option) => option.value === theme) ?? themeOptions[2];
  const nextTheme =
    themeOptions.find((option) => option.value === getNextTheme(theme)) ??
    themeOptions[0];
  const ActiveThemeIcon = activeTheme.Icon;

  const toggleThemeMode = () => {
    setThemeMode(nextTheme.value);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="dashboard-section enter rounded-[34px] p-6 sm:p-7">
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-(--aura-blue) blur-3xl" />
        <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-(--aura-green) blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_320px]">
          <div className="space-y-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex max-w-3xl items-start gap-4">
                <span className="icon-shell h-12 w-12 shrink-0 text-[var(--blue)] shadow-[var(--shadow-tight)]">
                  <PaletteIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Settings
                  </p>
                  <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                    Preferences
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-[var(--muted)]">
                    Tune the dashboard atmosphere, account identity, alerts, and
                    security details from one polished control panel.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-[var(--green)] text-[var(--fg)]">
                  Saved
                </span>
                <span className="chip bg-[var(--panel-strong)] text-[var(--fg)]">
                  {getThemeLabel(theme)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {accountHighlights.map((item) => (
                <span
                  key={item}
                  className="chip bg-[var(--panel-strong)] text-[var(--fg)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleThemeMode}
            className="interactive-tile rounded-[30px] border border-[rgba(37,99,235,0.18)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] p-5 text-left shadow-[var(--shadow-tight)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`icon-shell h-12 w-12 shadow-[var(--shadow-tight)] ${activeTheme.toneClass}`}
              >
                <ActiveThemeIcon className="h-5 w-5" />
              </span>
              <span className="chip bg-[var(--blue)] text-white">
                {activeTheme.label}
              </span>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/56">
              Theme toggle
            </p>
            <p className="mt-2 text-2xl font-semibold">Cycle interface theme</p>
            <p className="mt-3 text-sm font-medium leading-6 text-[var(--muted)]">
              Replace the old multi-card selector with one SVG control that
              cycles light, dark, and system modes while keeping the current
              theme label visible.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {themeOptions.map((option) => {
                const Icon = option.Icon;
                const isActive = option.value === activeTheme.value;

                return (
                  <span
                    key={option.value}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${
                      isActive
                        ? "border-transparent bg-[linear-gradient(135deg,var(--blue),var(--blue-2))] text-white"
                        : "border-[var(--border)] bg-[var(--panel)] text-[var(--fg)]/66"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })}
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/56">
              Click to switch to {nextTheme.label}
            </p>
          </button>

          <div className="grid gap-3 md:grid-cols-3 xl:col-span-2">
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/58">
                Active theme
              </p>
              <p className="mt-2 text-2xl font-semibold">{activeTheme.label}</p>
            </div>
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/58">
                Alerts live
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {enabledNotifications}/{notificationSettings.length}
              </p>
            </div>
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/58">
                Security
              </p>
              <p className="mt-2 text-2xl font-semibold">Protected</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dashboard-section enter rounded-4xl p-6">
          <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-(--aura-blue) blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <span className="icon-shell h-12 w-12 text-[var(--blue)] shadow-[var(--shadow-tight)]">
                  <UserIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Account
                  </h2>
                  <p className="mt-1 text-sm font-medium text-(--muted)">
                    Keep your profile polished and ready for students.
                  </p>
                </div>
              </div>
              <span className="chip bg-[var(--panel-strong)] text-[var(--fg)]">
                Updated
              </span>
            </div>

            <div className="mt-5 rounded-[30px] bg-[linear-gradient(135deg,var(--blue),rgba(16,34,85,0.92))] p-5 text-white shadow-[0_24px_48px_rgba(29,78,216,0.24)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/16 bg-white/12 text-lg font-bold shadow-[var(--shadow-tight)]">
                    JW
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Jane Wambui</p>
                    <p className="text-sm font-medium text-white/72">
                      Senior instructor and content lead
                    </p>
                  </div>
                </div>
                <span className="chip border-white/20 bg-white/12 text-white">
                  Teacher profile
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {accountHighlights.map((item) => (
                  <span
                    key={item}
                    className="chip border-white/18 bg-white/10 text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
                Full name
                <input
                  type="text"
                  defaultValue="Jane Wambui"
                  className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)]"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
                Email
                <input
                  type="email"
                  defaultValue="jane@godomain.africa"
                  className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)]"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--muted) md:col-span-2">
                Active class track
                <input
                  type="text"
                  defaultValue="Westlands circuit and mock test group"
                  className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)]"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="dashboard-section enter rounded-4xl p-6">
          <div className="absolute -right-6 top-8 h-24 w-24 rounded-full bg-(--aura-green) blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <span className="icon-shell h-12 w-12 text-[var(--green)] shadow-[var(--shadow-tight)]">
                  <BellIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm font-medium text-(--muted)">
                    Choose the alerts that deserve your attention first.
                  </p>
                </div>
              </div>
              <span className="chip bg-[var(--green)] text-[var(--fg)]">
                {enabledNotifications} live
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {notificationSettings.map((item) => (
                <div
                  key={item.id}
                  className={`interactive-tile rounded-[26px] border px-4 py-4 ${
                    item.enabled
                      ? "border-[rgba(37,99,235,0.24)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))]"
                      : "border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`icon-shell h-10 w-10 shrink-0 ${
                          item.enabled
                            ? "text-[var(--blue)]"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        <BellIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-(--muted)">
                          {item.detail}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleNotification(item.id)}
                      aria-pressed={item.enabled}
                      className={`relative h-8 w-14 shrink-0 rounded-full border ${
                        item.enabled
                          ? "border-transparent bg-[linear-gradient(135deg,var(--blue),var(--blue-2))]"
                          : "border-(--border) bg-[var(--panel-strong)]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_8px_16px_rgba(15,23,42,0.18)] ${
                          item.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dashboard-section enter rounded-4xl p-6">
          <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-(--aura-rose) blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <span className="icon-shell h-12 w-12 text-[var(--rose)] shadow-[var(--shadow-tight)]">
                  <ShieldIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Security
                  </h2>
                  <p className="mt-1 text-sm font-medium text-(--muted)">
                    Refresh access details and keep account protection current.
                  </p>
                </div>
              </div>
              <span className="chip bg-[var(--panel-strong)] text-[var(--fg)]">
                Protected
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
                New password
                <input
                  type="password"
                  placeholder="********"
                  className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/50"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
                Confirm password
                <input
                  type="password"
                  placeholder="********"
                  className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/50"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                "Strong password",
                "Recovery contact ready",
                "Session review weekly",
              ].map((item) => (
                <div
                  key={item}
                  className="interactive-tile rounded-[22px] border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
              <button type="button" className="btn btn-ghost">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section enter rounded-4xl p-6">
          <div className="absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-(--aura-blue) blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <span className="icon-shell h-12 w-12 text-[var(--amber)] shadow-[var(--shadow-tight)]">
                  <PaletteIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Interface preview
                  </h2>
                  <p className="mt-1 text-sm font-medium text-(--muted)">
                    A quick read on how the current surface language feels.
                  </p>
                </div>
              </div>
              <span className="chip bg-[var(--panel-strong)] text-[var(--fg)]">
                {activeTheme.label}
              </span>
            </div>

            <div className="glass-soft mt-5 rounded-[30px] p-4">
              <div className="rounded-[28px] border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted-2)">
                      Live preview
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {getThemeLabel(theme)}
                    </p>
                  </div>
                  <span className="chip bg-[var(--blue)] text-white">
                    Synced
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="interactive-tile rounded-[22px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] px-4 py-3">
                    <p className="text-sm font-semibold">Backdrops stay soft</p>
                    <p className="mt-1 text-sm font-medium text-(--muted)">
                      Blurred surfaces keep depth without flattening content.
                    </p>
                  </div>
                  <div className="interactive-tile rounded-[22px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] px-4 py-3">
                    <p className="text-sm font-semibold">Motion stays subtle</p>
                    <p className="mt-1 text-sm font-medium text-(--muted)">
                      Hover lift and card scaling remain smooth and restrained.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {previewPills.map((item) => (
                <span
                  key={item}
                  className="chip bg-[var(--panel-strong)] text-[var(--fg)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
