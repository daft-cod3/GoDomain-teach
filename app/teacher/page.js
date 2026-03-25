"use client";

import { useEffect, useRef, useState } from "react";
import LeadBod from "../components/leadBod";
import SideFoot from "../components/sideFoot";
import { defaultTeacherProfile } from "../data/teacher";

const STORAGE_KEY = "goTeach.teacherProfile";

const formFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "drivingSchool", label: "Driving school", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "location", label: "Location", type: "text" },
  { key: "joined", label: "Joined", type: "date" },
  { key: "license", label: "License", type: "text" },
  { key: "experience", label: "Experience", type: "text" },
  { key: "focusArea", label: "Focus area", type: "text" },
  { key: "emergencyContact", label: "Emergency contact", type: "text" },
  { key: "groupsHandled", label: "Groups handled", type: "number" },
  { key: "monthlySessions", label: "Monthly sessions", type: "number" },
  { key: "passRate", label: "Pass rate", type: "number" },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value, options = {}) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

function getUsageDuration(value) {
  const joined = new Date(value);
  if (Number.isNaN(joined.getTime())) {
    return "Not available";
  }

  const today = new Date();
  let months =
    (today.getFullYear() - joined.getFullYear()) * 12 +
    (today.getMonth() - joined.getMonth());

  if (today.getDate() < joined.getDate()) {
    months -= 1;
  }

  const safeMonths = Math.max(months, 0);
  const years = Math.floor(safeMonths / 12);
  const remainder = safeMonths % 12;

  if (years > 0 && remainder > 0) {
    return `${years} yr ${remainder} mo`;
  }
  if (years > 0) {
    return `${years} yr`;
  }
  return `${remainder} mo`;
}

function getCurrentStreak(activityPattern) {
  let streak = 0;
  const activityByOffset = new Map(
    activityPattern.map((entry) => [entry.offset, entry.usedApp])
  );

  while (activityByOffset.get(-streak)) {
    streak += 1;
  }

  return streak;
}

function getActiveDays(activityPattern) {
  return activityPattern.filter((entry) => entry.usedApp).length;
}

function buildTimeline(profile) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activityByOffset = new Map(
    profile.activityPattern.map((entry) => [entry.offset, entry])
  );
  const ntsaByOffset = profile.ntsaTemplates.reduce((map, item) => {
    const bucket = map.get(item.offset) ?? [];
    bucket.push(item);
    map.set(item.offset, bucket);
    return map;
  }, new Map());

  return Array.from({ length: 21 }, (_, index) => {
    const offset = index - 14;
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const activity = activityByOffset.get(offset) ?? {
      usedApp: false,
      groupsHandled: 0,
    };

    return {
      key: date.toISOString(),
      offset,
      date,
      usedApp: activity.usedApp,
      groupsHandled: activity.groupsHandled ?? 0,
      ntsaItems: ntsaByOffset.get(offset) ?? [],
    };
  });
}

function getDayStyle(day) {
  if (day.ntsaItems.length > 0 && day.usedApp && day.groupsHandled > 0) {
    return {
      background:
        "linear-gradient(145deg, var(--amber) 0%, var(--green) 52%, var(--blue) 100%)",
      color: "#0f172a",
    };
  }
  if (day.ntsaItems.length > 0) {
    return {
      backgroundColor: "var(--amber)",
      color: "#0f172a",
    };
  }
  if (day.usedApp && day.groupsHandled > 0) {
    return {
      background:
        "linear-gradient(145deg, var(--blue) 0%, var(--green) 100%)",
      color: "#ffffff",
    };
  }
  if (day.groupsHandled > 0) {
    return {
      backgroundColor: "var(--green)",
      color: "#0f172a",
    };
  }
  if (day.usedApp) {
    return {
      backgroundColor: "var(--blue)",
      color: "#ffffff",
    };
  }
  return {
    backgroundColor: "var(--panel)",
    color: "var(--fg)",
  };
}

function createDraft(profile) {
  return {
    ...profile,
    classesText: profile.classes.join(", "),
  };
}

function normalizeDraft(draft) {
  const nextProfile = {
    ...draft,
    groupsHandled: Number(draft.groupsHandled) || 0,
    monthlySessions: Number(draft.monthlySessions) || 0,
    passRate: Number(draft.passRate) || 0,
    classes: draft.classesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };

  delete nextProfile.classesText;
  return nextProfile;
}

function readFileAsDataUrl(file, maxSide) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const longestSide = Math.max(image.width, image.height);
        const scale = longestSide > maxSide ? maxSide / longestSide : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image processing is unavailable."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => reject(new Error("Could not load image."));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState(defaultTeacherProfile);
  const [draft, setDraft] = useState(createDraft(defaultTeacherProfile));
  const [isEditing, setIsEditing] = useState(false);
  const [saveState, setSaveState] = useState("Ready");
  const [isHydrated, setIsHydrated] = useState(false);
  const avatarInputRef = useRef(null);
  const headerInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        const nextProfile = {
          ...defaultTeacherProfile,
          ...parsed,
          classes: parsed.classes ?? defaultTeacherProfile.classes,
        };
        setProfile(nextProfile);
        setDraft(createDraft(nextProfile));
      }
    } catch {
      setSaveState("Using default profile");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [isHydrated, profile]);

  const timeline = buildTimeline(profile);
  const currentStreak = getCurrentStreak(profile.activityPattern);
  const activeDays = getActiveDays(profile.activityPattern);
  const usageDuration = getUsageDuration(profile.joined);
  const upcomingNtsa = profile.ntsaTemplates
    .filter((item) => item.offset >= 0)
    .sort((first, second) => first.offset - second.offset)
    .map((item) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + item.offset);
      return {
        ...item,
        date: formatDate(date),
      };
    });

  const handleFieldChange = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextProfile = normalizeDraft(draft);
    setProfile(nextProfile);
    setDraft(createDraft(nextProfile));
    setSaveState("Profile details saved");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(createDraft(profile));
    setIsEditing(false);
    setSaveState("Draft discarded");
  };

  const handleImageChange = async (event, key, maxSide) => {
    const [file] = event.target.files ?? [];
    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file, maxSide);
      setProfile((current) => ({
        ...current,
        [key]: dataUrl,
      }));
      setDraft((current) => ({
        ...current,
        [key]: dataUrl,
      }));
      setSaveState(
        key === "headerImage"
          ? "Header image updated"
          : "Profile image updated"
      );
    } catch {
      setSaveState("Image upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const clearImage = (key) => {
    setProfile((current) => ({
      ...current,
      [key]: "",
    }));
    setDraft((current) => ({
      ...current,
      [key]: "",
    }));
    setSaveState(
      key === "headerImage" ? "Header image removed" : "Profile image removed"
    );
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Profile" />
        <main className="space-y-6">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleImageChange(event, "profileImage", 360)}
          />
          <input
            ref={headerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleImageChange(event, "headerImage", 1600)}
          />

          <section
            className="glass overflow-hidden rounded-[28px] border border-[var(--border)] shadow-[var(--shadow)]"
            style={{
              backgroundImage: profile.headerImage
                ? `linear-gradient(135deg, rgba(6, 12, 28, 0.72), rgba(14, 27, 61, 0.3)), url(${profile.headerImage})`
                : "linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(15, 118, 110, 0.9) 48%, rgba(245, 158, 11, 0.92) 100%)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="flex h-full flex-col justify-between gap-8 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.62))] p-5 text-white sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    Teacher profile
                  </p>
                  <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                    {profile.name}
                  </h1>
                  <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
                    {profile.role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => headerInputRef.current?.click()}
                    className="btn border-white/35 bg-white/15 text-white backdrop-blur hover:bg-white/20"
                  >
                    Add header image
                  </button>
                  {profile.headerImage ? (
                    <button
                      type="button"
                      onClick={() => clearImage("headerImage")}
                      className="btn border-white/35 bg-transparent text-white hover:bg-white/10"
                    >
                      Clear header
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="flex flex-col gap-5 rounded-[26px] border border-white/15 bg-white/12 p-4 backdrop-blur md:flex-row md:items-end md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[26px] border border-white/20 bg-white/15 text-2xl font-semibold shadow-[var(--shadow-tight)]">
                        {profile.profileImage ? (
                          <img
                            src={profile.profileImage}
                            alt={`${profile.name} profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(profile.name)
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/40 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                      >
                        Add photo
                      </button>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        Using app for
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{usageDuration}</p>
                      <p className="mt-2 text-sm font-medium text-white/80">
                        Joined {formatDate(profile.joined)} and still leading {profile.groupsHandled} student groups.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: "Current streak",
                        value: `${currentStreak} days`,
                        tone: "rgba(37, 99, 235, 0.9)",
                      },
                      {
                        label: "Groups handled",
                        value: `${profile.groupsHandled}`,
                        tone: "rgba(34, 197, 94, 0.85)",
                      },
                      {
                        label: "Upcoming NTSA",
                        value: `${upcomingNtsa.length}`,
                        tone: "rgba(245, 158, 11, 0.88)",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/15 p-4 text-slate-950 shadow-[var(--shadow-tight)]"
                        style={{ backgroundColor: item.tone }}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-950/70">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/15 bg-slate-950/35 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="chip border-white/30 bg-white/12 text-white">
                      Active
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                      {saveState}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-white/78">
                    Profile picture, header image, and profile details save in this browser so the page stays editable without leaving the dashboard.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(createDraft(profile));
                        setIsEditing((current) => !current);
                      }}
                      className="btn border-white/30 bg-white text-slate-950"
                    >
                      {isEditing ? "Close editor" : "Edit details"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("activity-calendar")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                      className="btn border-white/30 bg-transparent text-white hover:bg-white/10"
                    >
                      View streak calendar
                    </button>
                    {profile.profileImage ? (
                      <button
                        type="button"
                        onClick={() => clearImage("profileImage")}
                        className="btn border-white/30 bg-transparent text-white hover:bg-white/10"
                      >
                        Clear photo
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isEditing ? (
            <section className="panel overflow-hidden rounded-[28px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Edit details
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Update teacher profile
                  </h2>
                </div>
                <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                  Local browser save
                </span>
              </div>

              <form className="mt-6 space-y-6" onSubmit={handleSave}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {formFields.map((field) => (
                    <label
                      key={field.key}
                      className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/80"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        value={draft[field.key]}
                        onChange={(event) =>
                          handleFieldChange(field.key, event.target.value)
                        }
                        className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                      />
                    </label>
                  ))}
                </div>

                <label className="block rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/80">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                    Assigned classes
                  </span>
                  <input
                    type="text"
                    value={draft.classesText}
                    onChange={(event) =>
                      handleFieldChange("classesText", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                  />
                </label>

                <label className="block rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/80">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                    Bio
                  </span>
                  <textarea
                    rows={4}
                    value={draft.bio}
                    onChange={(event) => handleFieldChange("bio", event.target.value)}
                    className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn btn-primary">
                    Save details
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Personal information
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Contact and credentials
                  </h2>
                </div>
                <span className="chip bg-[var(--blue)] text-white">
                  {profile.passRate}% pass rate
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Staff ID", value: profile.staffId },
                  { label: "Email", value: profile.email },
                  { label: "Phone", value: profile.phone },
                  { label: "Driving school", value: profile.drivingSchool },
                  { label: "Location", value: profile.location },
                  { label: "Joined", value: formatDate(profile.joined) },
                  { label: "License", value: profile.license },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(14,165,233,0.04))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  About
                </p>
                <p className="mt-3 text-sm font-medium leading-7 text-[var(--fg)]/75">
                  {profile.bio}
                </p>
              </div>
            </div>

            <div className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Teaching overview
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Workload snapshot
                  </h2>
                </div>
                <span className="chip bg-[var(--green)] text-[var(--fg)]">
                  {profile.monthlySessions} sessions this month
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Experience",
                    value: profile.experience,
                    tone: "var(--panel-2)",
                  },
                  {
                    label: "Focus area",
                    value: profile.focusArea,
                    tone: "rgba(34, 197, 94, 0.14)",
                  },
                  {
                    label: "Emergency contact",
                    value: profile.emergencyContact,
                    tone: "rgba(245, 158, 11, 0.18)",
                  },
                  {
                    label: "Logged active days",
                    value: `${activeDays} days in view`,
                    tone: "rgba(37, 99, 235, 0.12)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-[var(--border)] p-4"
                    style={{ backgroundColor: item.tone }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Assigned classes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.classes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="enter" style={{ animationDelay: "320ms" }}>
            <LeadBod />
          </section>

          <section
            id="activity-calendar"
            className="panel overflow-hidden rounded-[28px] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Streak calendar
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Activity, groups, and NTSA schedule
                </h2>
              </div>
              <span className="chip bg-[var(--amber-soft)] text-[var(--fg)]">
                21-day view
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
              {[
                { label: "App used", color: "var(--blue)" },
                { label: "Groups handled", color: "var(--green)" },
                { label: "Upcoming NTSA", color: "var(--amber)" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-2"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {timeline.map((day) => (
                <div
                  key={day.key}
                  className="rounded-3xl border border-[var(--border)] p-4 shadow-[var(--shadow-tight)]"
                  style={getDayStyle(day)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                        {formatDate(day.date, { weekday: "short" })}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {formatDate(day.date, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    {day.offset === 0 ? (
                      <span className="rounded-full border border-current/25 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Today
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-2 text-xs font-semibold">
                    <p className="opacity-85">
                      {day.usedApp ? "App opened" : "No login recorded"}
                    </p>
                    <p className="opacity-85">
                      {day.groupsHandled > 0
                        ? `${day.groupsHandled} group${day.groupsHandled > 1 ? "s" : ""} handled`
                        : "No group handled"}
                    </p>
                    {day.ntsaItems.length > 0 ? (
                      <div className="space-y-1">
                        {day.ntsaItems.map((item) => (
                          <p
                            key={item.id}
                            className="rounded-2xl border border-current/20 px-2 py-1"
                          >
                            {item.title}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="opacity-70">No NTSA milestone</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Usage summary
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "App history", value: usageDuration },
                    { label: "Current streak", value: `${currentStreak} days` },
                    { label: "Logged days", value: `${activeDays}/15 active` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(37,99,235,0.06))] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                    Upcoming NTSA dates
                  </p>
                  <span className="chip bg-[var(--amber)] text-slate-950">
                    {upcomingNtsa.length} scheduled
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {upcomingNtsa.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--fg)]/60">
                            {item.group}
                          </p>
                        </div>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--amber-soft)] px-3 py-1 text-xs font-semibold">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
