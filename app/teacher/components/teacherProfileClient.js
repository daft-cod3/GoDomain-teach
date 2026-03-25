"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultTeacherProfile } from "../../data/teacher";

const STORAGE_KEY = "goteach.teacher.profile.v1";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(baseDate, offset) {
  const next = new Date(baseDate);
  next.setDate(baseDate.getDate() + offset);
  return next;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatLongDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getUsageSummary(joined) {
  const joinedDate = new Date(`${joined}T00:00:00`);
  if (Number.isNaN(joinedDate.getTime())) {
    return { totalDays: 0, label: "0 days" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.max(
    0,
    Math.floor((today.getTime() - joinedDate.getTime()) / 86400000)
  );
  const years = Math.floor(diff / 365);
  const months = Math.floor((diff % 365) / 30);

  if (years > 0) {
    return {
      totalDays: diff,
      label: `${years}y ${months}m`,
    };
  }

  return {
    totalDays: diff,
    label: `${diff} days`,
  };
}

function normalizeProfile(value) {
  return {
    ...defaultTeacherProfile,
    ...value,
    classes: Array.isArray(value?.classes)
      ? value.classes.filter(Boolean)
      : defaultTeacherProfile.classes,
    activityPattern: defaultTeacherProfile.activityPattern,
    ntsaTemplates: defaultTeacherProfile.ntsaTemplates,
  };
}

function buildCalendarDays(profile) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activityMap = new Map();
  for (const entry of profile.activityPattern) {
    const date = shiftDate(today, entry.offset);
    activityMap.set(toDateKey(date), entry);
  }

  const ntsaMap = new Map();
  for (const entry of profile.ntsaTemplates) {
    const date = shiftDate(today, entry.offset);
    ntsaMap.set(toDateKey(date), { ...entry, date });
  }

  return Array.from({ length: 21 }, (_, index) => {
    const offset = index - 14;
    const date = shiftDate(today, offset);
    const dateKey = toDateKey(date);
    const activity = activityMap.get(dateKey) ?? {
      usedApp: false,
      groupsHandled: 0,
    };
    const ntsaEvent = ntsaMap.get(dateKey) ?? null;

    return {
      key: dateKey,
      date,
      usedApp: activity.usedApp,
      groupsHandled: activity.groupsHandled,
      ntsaEvent,
    };
  });
}

function buildUpcomingNtsa(profile) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return profile.ntsaTemplates
    .map((entry) => ({
      ...entry,
      date: shiftDate(today, entry.offset),
    }))
    .sort((left, right) => left.date.getTime() - right.date.getTime());
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function StatusBanner({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/85 px-4 py-3 text-sm font-medium text-[var(--fg)]/75 shadow-[var(--shadow-tight)]">
      {message}
    </div>
  );
}

export default function TeacherProfileClient() {
  const [profile, setProfile] = useState(defaultTeacherProfile);
  const [draft, setDraft] = useState(defaultTeacherProfile);
  const [classesInput, setClassesInput] = useState(
    defaultTeacherProfile.classes.join(", ")
  );
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Profile ready for updates."
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const nextProfile = normalizeProfile(parsed);
      setProfile(nextProfile);
      setDraft(nextProfile);
      setClassesInput(nextProfile.classes.join(", "));
      setStatusMessage("Loaded your saved teacher profile.");
    } catch {
      setStatusMessage("Using the default teacher profile.");
    }
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(profile), [profile]);
  const upcomingNtsa = useMemo(() => buildUpcomingNtsa(profile), [profile]);
  const usageSummary = useMemo(() => getUsageSummary(profile.joined), [profile]);

  function persistProfile(nextProfile, successMessage) {
    setProfile(nextProfile);
    setDraft(nextProfile);
    setClassesInput(nextProfile.classes.join(", "));

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
      setStatusMessage(successMessage);
    } catch {
      setStatusMessage(
        "Changes are visible now, but the browser could not store them offline."
      );
    }
  }

  function startEditing() {
    setDraft(profile);
    setClassesInput(profile.classes.join(", "));
    setIsEditing(true);
    setStatusMessage("Edit mode enabled.");
  }

  function cancelEditing() {
    setDraft(profile);
    setClassesInput(profile.classes.join(", "));
    setIsEditing(false);
    setStatusMessage("Profile edits were discarded.");
  }

  function saveDetails() {
    const nextProfile = normalizeProfile({
      ...draft,
      groupsHandled: Number(draft.groupsHandled) || 0,
      monthlySessions: Number(draft.monthlySessions) || 0,
      passRate: Number(draft.passRate) || 0,
      classes: classesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    persistProfile(nextProfile, "Teacher details saved successfully.");
    setIsEditing(false);
  }

  async function handleImageUpload(event, field) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageData = await readFileAsDataUrl(file);
      const nextProfile = normalizeProfile({
        ...profile,
        [field]: imageData,
      });
      persistProfile(
        nextProfile,
        field === "profileImage"
          ? "Profile picture updated."
          : "Header image updated."
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The selected image could not be applied."
      );
    } finally {
      event.target.value = "";
    }
  }

  const statCards = [
    {
      label: "Time on app",
      value: usageSummary.label,
      helper: `${usageSummary.totalDays} total days tracked`,
      accent: "bg-[rgba(37,99,235,0.12)] text-[var(--blue)]",
    },
    {
      label: "Groups handled",
      value: String(profile.groupsHandled),
      helper: `${profile.monthlySessions} sessions this month`,
      accent: "bg-[rgba(34,197,94,0.16)] text-[var(--green)]",
    },
    {
      label: "Pass rate",
      value: `${profile.passRate}%`,
      helper: profile.focusArea,
      accent: "bg-[rgba(245,158,11,0.16)] text-[rgb(180,83,9)]",
    },
  ];

  const details = [
    { key: "staffId", label: "Staff ID" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "location", label: "Location" },
    { key: "joined", label: "Joined", readOnly: true },
    { key: "license", label: "License" },
    { key: "experience", label: "Experience" },
    { key: "emergencyContact", label: "Emergency contact" },
  ];

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-[32px] border border-[var(--border)] px-6 py-7 shadow-[var(--shadow)]"
        style={{
          backgroundImage: profile.headerImage
            ? `linear-gradient(135deg, rgba(7, 12, 24, 0.78), rgba(16, 72, 136, 0.55)), url(${profile.headerImage})`
            : "linear-gradient(135deg, rgba(10, 20, 40, 0.96), rgba(37, 99, 235, 0.82)), radial-gradient(circle at top right, rgba(34, 197, 94, 0.35), transparent 40%)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-white/30 bg-white/10 shadow-[var(--shadow-tight)]">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                    Teacher profile
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                    {profile.name}
                  </h1>
                  <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
                    {profile.role}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/72">
                    {profile.bio}
                  </p>
                </div>
              </div>
              <span className="chip border-white/25 bg-white/10 text-white">
                Live profile
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={isEditing ? saveDetails : startEditing}
                className="btn border-white/15 bg-white text-[rgb(7,18,40)]"
              >
                {isEditing ? "Save details" : "Edit details"}
              </button>
              <label
                htmlFor="profile-upload"
                className="btn cursor-pointer border-white/25 bg-white/10 text-white"
              >
                Change profile photo
              </label>
              <label
                htmlFor="header-upload"
                className="btn cursor-pointer border-white/25 bg-white/10 text-white"
              >
                Change header image
              </label>
              {isEditing ? (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="btn border-white/25 bg-transparent text-white"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "profileImage")}
            />
            <input
              id="header-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "headerImage")}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {statCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${item.accent}`}
                  >
                    {item.label}
                  </div>
                  <p className="mt-4 text-2xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm font-medium text-white/72">
                    {item.helper}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Activity streak calendar
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold">
                  Instructor momentum
                </h2>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                  Since
                </p>
                <p className="text-sm font-semibold">
                  {formatLongDate(profile.joined)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-7">
              {calendarDays.map((day) => {
                const stateClasses = day.ntsaEvent
                  ? "border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.14)]"
                  : day.groupsHandled > 0
                    ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.16)]"
                    : day.usedApp
                      ? "border-[rgba(96,165,250,0.35)] bg-[rgba(96,165,250,0.14)]"
                      : "border-white/10 bg-white/6";

                return (
                  <div
                    key={day.key}
                    className={`rounded-2xl border px-3 py-3 text-left shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5 ${stateClasses}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {day.date.toLocaleDateString("en-KE", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {day.date.getDate()}
                    </p>
                    <div className="mt-3 space-y-1 text-[11px] font-medium text-white/75">
                      <p>{day.usedApp ? "App used" : "No activity"}</p>
                      <p>
                        {day.groupsHandled > 0
                          ? `${day.groupsHandled} groups handled`
                          : "No groups"}
                      </p>
                      <p>
                        {day.ntsaEvent ? day.ntsaEvent.title : "No NTSA event"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <span className="rounded-full border border-[rgba(96,165,250,0.4)] bg-[rgba(96,165,250,0.15)] px-3 py-1">
                Blue: app use
              </span>
              <span className="rounded-full border border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.15)] px-3 py-1">
                Green: groups handled
              </span>
              <span className="rounded-full border border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.18)] px-3 py-1">
                Amber: NTSA date
              </span>
            </div>
          </div>
        </div>
      </section>

      <StatusBanner message={statusMessage} />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel overflow-hidden p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                Personal information
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Teacher details
              </h2>
            </div>
            <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
              {isEditing ? "Editing" : "Read only"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium">
              Name
              <input
                type="text"
                value={draft.name}
                disabled={!isEditing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium">
              Role
              <input
                type="text"
                value={draft.role}
                disabled={!isEditing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>

            {details.map((item) => (
              <label
                key={item.key}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium"
              >
                {item.label}
                <input
                  type={item.type ?? "text"}
                  value={
                    item.key === "joined"
                      ? formatLongDate(draft.joined)
                      : String(draft[item.key] ?? "")
                  }
                  disabled={!isEditing || item.readOnly}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [item.key]: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
                />
              </label>
            ))}

            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium">
              Groups handled
              <input
                type="number"
                min="0"
                value={draft.groupsHandled}
                disabled={!isEditing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    groupsHandled: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium">
              Monthly sessions
              <input
                type="number"
                min="0"
                value={draft.monthlySessions}
                disabled={!isEditing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    monthlySessions: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium">
              Pass rate
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={draft.passRate}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      passRate: event.target.value,
                    }))
                  }
                  className="w-full bg-transparent text-sm text-[var(--fg)] outline-none disabled:cursor-default"
                />
                <span className="text-sm font-semibold text-[var(--fg)]/60">%</span>
              </div>
            </label>
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium sm:col-span-2">
              Assigned classes
              <input
                type="text"
                value={classesInput}
                disabled={!isEditing}
                onChange={(event) => setClassesInput(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>
            <label className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium sm:col-span-2">
              About
              <textarea
                rows={4}
                value={draft.bio}
                disabled={!isEditing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
              Teaching overview
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              Current rhythm
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Focus area
                </p>
                <p className="mt-3 text-base font-semibold">{profile.focusArea}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Joined
                </p>
                <p className="mt-3 text-base font-semibold">
                  {formatLongDate(profile.joined)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.classes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                  Upcoming NTSA dates
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold">
                  Next assessments
                </h2>
              </div>
              <span className="chip bg-[rgba(245,158,11,0.16)] text-[rgb(180,83,9)]">
                {upcomingNtsa.length} scheduled
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {upcomingNtsa.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--panel-2)] px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--fg)]/60">
                      {item.group}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[rgba(245,158,11,0.16)] px-3 py-2 text-sm font-semibold text-[rgb(180,83,9)]">
                    {formatShortDate(item.date)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
