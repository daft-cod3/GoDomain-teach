"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { teacherLeaders } from "../components/leadBod";
import SideFoot from "../components/sideFoot";
import { defaultTeacherProfile } from "../data/teacher";

const STORAGE_KEY = "goTeach.teacherProfile";
const BOOKMARKS_KEY = "goTeach.teacherBookmarks";
const leaderMaxPoints = Math.max(
  ...teacherLeaders.map((leader) => leader.points),
  1,
);

const personalFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "drivingSchool", label: "Driving school", type: "text" },
  { key: "staffId", label: "Staff ID", type: "text" },
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

const calendarFilters = [
  { id: "all", label: "All activity" },
  { id: "active", label: "Active only" },
  { id: "milestones", label: "Milestones" },
];

function PhotoIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M6 7.25h2.3l1.2-1.75h4.98L15.7 7.25H18A2.75 2.75 0 0 1 20.75 10v6A2.75 2.75 0 0 1 18 18.75H6A2.75 2.75 0 0 1 3.25 16v-6A2.75 2.75 0 0 1 6 7.25Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.25" strokeWidth="1.8" />
    </svg>
  );
}

function PencilIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="m14.25 5.25 4.5 4.5M5.75 18.25l2.15-6.15 8.73-8.72a1.6 1.6 0 0 1 2.26 0l1.73 1.72a1.6 1.6 0 0 1 0 2.27l-8.72 8.72-6.15 2.16Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon(props) {
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
        y="5.25"
        width="16.5"
        height="14.5"
        rx="2.75"
        strokeWidth="1.8"
      />
      <path
        d="M7.75 3.75v3M16.25 3.75v3M3.75 9.5h16.5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ filled = false, ...props }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      {...props}
    >
      <path
        d="M7 4.75h10A1.75 1.75 0 0 1 18.75 6.5v12.75L12 15.75l-6.75 3.5V6.5A1.75 1.75 0 0 1 7 4.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M7 4.75h10v2.5A5 5 0 0 1 12 12.25h0A5 5 0 0 1 7 7.25v-2.5ZM9.5 12.25v2.5A2.5 2.5 0 0 1 7 17.25h10a2.5 2.5 0 0 1-2.5-2.5v-2.5"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 6.25H4.75A1.75 1.75 0 0 0 3 8v.25A3.75 3.75 0 0 0 6.75 12M17 6.25h2.25A1.75 1.75 0 0 1 21 8v.25A3.75 3.75 0 0 1 17.25 12"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="m12 3.75 1.4 3.35 3.35 1.4-3.35 1.4L12 13.25l-1.4-3.35-3.35-1.4 3.35-1.4L12 3.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m18 13.25.85 2.1 2.15.75-2.15.75L18 18.95l-.85-2.1-2.15-.75 2.15-.75.85-2.1ZM6 13.25l.68 1.68 1.68.57-1.68.58L6 17.75l-.68-1.67-1.68-.58 1.68-.57L6 13.25Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function formatDate(value, options) {
  if (!value) {
    return "N/A";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "N/A";
  }

  return new Intl.DateTimeFormat(
    "en-KE",
    options ?? {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
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
    activityPattern.map((entry) => [entry.offset, entry.usedApp]),
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
    profile.activityPattern.map((entry) => [entry.offset, entry]),
  );
  const ntsaByOffset = profile.ntsaTemplates.reduce((map, item) => {
    const bucket = map.get(item.offset) ?? [];
    bucket.push(item);
    map.set(item.offset, bucket);
    return map;
  }, new Map());

  return Array.from({ length: 28 }, (_, index) => {
    const offset = index - 14;
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const activity = activityByOffset.get(offset) ?? {
      usedApp: false,
      groupsHandled: 0,
    };

    return {
      key: toDateKey(date),
      dateKey: toDateKey(date),
      offset,
      date,
      usedApp: activity.usedApp,
      groupsHandled: activity.groupsHandled ?? 0,
      ntsaItems: ntsaByOffset.get(offset) ?? [],
    };
  });
}

function getDayStyle(day, isBookmarked) {
  const sharedStyle = {
    borderColor: "rgba(255,255,255,0.08)",
    boxShadow: isBookmarked
      ? "0 18px 32px rgba(245, 158, 11, 0.14)"
      : "var(--shadow-tight)",
  };

  if (day.ntsaItems.length > 0 && day.usedApp && day.groupsHandled > 0) {
    return {
      ...sharedStyle,
      background:
        "linear-gradient(145deg, rgba(245,158,11,0.88) 0%, rgba(34,197,94,0.9) 52%, rgba(37,99,235,0.94) 100%)",
      color: "#ffffff",
    };
  }
  if (day.ntsaItems.length > 0) {
    return {
      ...sharedStyle,
      background:
        "linear-gradient(145deg, rgba(245,158,11,0.22), rgba(245,158,11,0.1))",
      color: "var(--fg)",
      borderColor: "rgba(245,158,11,0.34)",
    };
  }
  if (day.usedApp && day.groupsHandled > 0) {
    return {
      ...sharedStyle,
      background:
        "linear-gradient(145deg, rgba(37,99,235,0.96), rgba(34,197,94,0.88))",
      color: "#ffffff",
    };
  }
  if (day.groupsHandled > 0) {
    return {
      ...sharedStyle,
      background:
        "linear-gradient(145deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))",
      color: "var(--fg)",
      borderColor: "rgba(34,197,94,0.28)",
    };
  }
  if (day.usedApp) {
    return {
      ...sharedStyle,
      background:
        "linear-gradient(145deg, rgba(37,99,235,0.18), rgba(37,99,235,0.08))",
      color: "var(--fg)",
      borderColor: "rgba(37,99,235,0.28)",
    };
  }

  return {
    ...sharedStyle,
    background: "linear-gradient(180deg,var(--panel),var(--panel-deep))",
    color: "var(--fg)",
    borderColor: "var(--border)",
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
  const [saveState, setSaveState] = useState("Profile ready");
  const [calendarFilter, setCalendarFilter] = useState("all");
  const [bookmarkedDays, setBookmarkedDays] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const avatarInputRef = useRef(null);
  const headerInputRef = useRef(null);

  useEffect(() => {
    try {
      const storedProfile =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        const nextProfile = {
          ...defaultTeacherProfile,
          ...parsed,
          classes: parsed.classes ?? defaultTeacherProfile.classes,
        };
        setProfile(nextProfile);
        setDraft(createDraft(nextProfile));
      }

      const storedBookmarks =
        typeof window !== "undefined"
          ? window.localStorage.getItem(BOOKMARKS_KEY)
          : null;
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks);
        if (Array.isArray(parsedBookmarks)) {
          setBookmarkedDays(parsedBookmarks.filter(Boolean));
        }
      }
    } catch {
      setSaveState("Using default teacher profile");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.localStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(bookmarkedDays),
      );
    } catch {
      setSaveState(
        "Changes are visible now, but local browser sync is unavailable.",
      );
    }
  }, [bookmarkedDays, isHydrated, profile]);

  const timeline = buildTimeline(profile);
  const currentStreak = getCurrentStreak(profile.activityPattern);
  const activeDays = getActiveDays(profile.activityPattern);
  const usageDuration = getUsageDuration(profile.joined);
  const teacherRank =
    teacherLeaders.findIndex((leader) => leader.username === "@jane.wambui") +
    1;
  const upcomingNtsa = profile.ntsaTemplates
    .filter((item) => item.offset >= 0)
    .sort((first, second) => first.offset - second.offset)
    .map((item) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + item.offset);
      return {
        ...item,
        date,
      };
    });

  const filteredTimeline = timeline.filter((day) => {
    if (calendarFilter === "active") {
      return (
        day.offset === 0 ||
        day.usedApp ||
        day.groupsHandled > 0 ||
        day.ntsaItems.length > 0 ||
        bookmarkedDays.includes(day.dateKey)
      );
    }

    if (calendarFilter === "milestones") {
      return day.ntsaItems.length > 0 || bookmarkedDays.includes(day.dateKey);
    }

    return true;
  });

  const pinnedDays = timeline.filter((day) =>
    bookmarkedDays.includes(day.dateKey),
  );

  function handleFieldChange(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEditing() {
    setDraft(createDraft(profile));
    setIsEditing(true);
    setSaveState("Editing personal information");
  }

  function cancelEditing() {
    setDraft(createDraft(profile));
    setIsEditing(false);
    setSaveState("Draft discarded");
  }

  function saveProfile() {
    const nextProfile = normalizeDraft(draft);
    setProfile(nextProfile);
    setDraft(createDraft(nextProfile));
    setIsEditing(false);
    setSaveState("Personal information saved");
  }

  async function handleImageChange(event, key, maxSide) {
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
          : "Profile image updated",
      );
    } catch {
      setSaveState("Image upload failed");
    } finally {
      event.target.value = "";
    }
  }

  function clearImage(key) {
    setProfile((current) => ({
      ...current,
      [key]: "",
    }));
    setDraft((current) => ({
      ...current,
      [key]: "",
    }));
    setSaveState(
      key === "headerImage" ? "Header image removed" : "Profile image removed",
    );
  }

  function focusPersonalInfoEditor() {
    startEditing();
    document
      .getElementById("personal-info")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleBookmark(dateKey) {
    const isSaved = bookmarkedDays.includes(dateKey);
    const nextBookmarks = isSaved
      ? bookmarkedDays.filter((value) => value !== dateKey)
      : [...bookmarkedDays, dateKey];

    setBookmarkedDays(nextBookmarks);
    setSaveState(isSaved ? "Bookmark removed" : "Date bookmarked");
  }

  const heroStats = [
    {
      label: "Current streak",
      value: `${currentStreak} days`,
      detail: "steady app engagement",
      tone: "rgba(37,99,235,0.92)",
    },
    {
      label: "Monthly sessions",
      value: `${profile.monthlySessions}`,
      detail: "active coaching load",
      tone: "rgba(34,197,94,0.9)",
    },
    {
      label: "Upcoming NTSA",
      value: `${upcomingNtsa.length}`,
      detail: "scheduled milestones",
      tone: "rgba(245,158,11,0.92)",
    },
  ];

  const mergedStats = [
    {
      label: "Pass rate",
      value: `${profile.passRate}%`,
      detail: "exam performance",
      tone: "rgba(37,99,235,0.12)",
    },
    {
      label: "Active days",
      value: `${activeDays}`,
      detail: "recorded in timeline",
      tone: "rgba(34,197,94,0.14)",
    },
    {
      label: "App tenure",
      value: usageDuration,
      detail: `joined ${formatDate(profile.joined, { month: "short", day: "numeric", year: "numeric" })}`,
      tone: "rgba(245,158,11,0.16)",
    },
    {
      label: "Teacher rank",
      value: `#${teacherRank || 1}`,
      detail: "current leaderboard position",
      tone: "rgba(225,29,72,0.12)",
    },
  ];

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Profile" />
        <main className="dashboard-main space-y-6">
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
            className="glass relative overflow-hidden rounded-[32px] border border-[var(--border)] shadow-[var(--shadow)]"
            style={{
              backgroundImage: profile.headerImage
                ? `linear-gradient(135deg, rgba(6, 12, 28, 0.82), rgba(13, 42, 84, 0.44)), url(${profile.headerImage})`
                : "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(37,99,235,0.88) 52%, rgba(15,118,110,0.84) 100%)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%)]" />
            <div className="relative grid gap-6 p-5 text-white sm:p-6 xl:grid-cols-[1.18fr_0.82fr] xl:p-7">
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip border-white/20 bg-white/12 text-white">
                        Teacher profile
                      </span>
                      <span className="chip border-white/20 bg-white/12 text-white">
                        {profile.drivingSchool}
                      </span>
                    </div>
                    <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl xl:text-[2.9rem]">
                      {profile.name}
                    </h1>
                    <p className="mt-3 text-base font-medium text-white/78">
                      {profile.role}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/74 sm:text-base">
                      {profile.bio}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/78">
                    Browser synced
                  </span>
                </div>

                <div className="rounded-[30px] border border-white/14 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-white/18 bg-white/12 text-2xl font-semibold shadow-[var(--shadow-tight)] sm:h-28 sm:w-28">
                          {profile.profileImage
                            ? <Image
                                src={profile.profileImage}
                                alt={`${profile.name} profile`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            : getInitials(profile.name)}
                        </div>
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/28 bg-slate-950/84 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                        >
                          <PhotoIcon className="h-3.5 w-3.5" />
                          Photo
                        </button>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">
                          Instructor tenure
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                          {usageDuration}
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6 text-white/72">
                          Joined {formatDate(profile.joined)} and currently
                          leads {profile.groupsHandled} learner groups across
                          the active route.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {heroStats.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[24px] border border-white/15 p-4 text-slate-950 shadow-[var(--shadow-tight)]"
                          style={{ backgroundColor: item.tone }}
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-950/72">
                            {item.label}
                          </p>
                          <p className="mt-3 text-2xl font-semibold">
                            {item.value}
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-950/72">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {profile.classes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/82"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[30px] border border-white/14 bg-slate-950/34 p-5 backdrop-blur-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">
                        Profile controls
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-semibold">
                        Minimal edit workspace
                      </h2>
                    </div>
                    <span className="chip border-white/20 bg-white/10 text-white">
                      {saveState}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/14 bg-white/8 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                        Focus area
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {profile.focusArea}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/14 bg-white/8 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                        Emergency contact
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        {profile.emergencyContact}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={focusPersonalInfoEditor}
                      className="btn border-white/20 bg-white text-slate-950"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit personal info
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("activity-calendar")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })
                      }
                      className="btn border-white/22 bg-transparent text-white hover:bg-white/10"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      View streak calendar
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => headerInputRef.current?.click()}
                      className="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                    >
                      Update cover
                    </button>
                    {profile.headerImage
                      ? <button
                          type="button"
                          onClick={() => clearImage("headerImage")}
                          className="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                        >
                          Clear cover
                        </button>
                      : null}
                    {profile.profileImage
                      ? <button
                          type="button"
                          onClick={() => clearImage("profileImage")}
                          className="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                        >
                          Clear photo
                        </button>
                      : null}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/14 bg-white/10 p-5 backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <span className="icon-shell h-12 w-12 border-white/18 bg-white/12 text-white">
                      <SparkIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                        Snapshot
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        Professional, minimalist presentation with live editing,
                        leaderboard context, and a more flexible activity view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <section id="personal-info" className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                    Personal information
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Teacher profile details
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium text-[var(--fg)]/68">
                    Review and update any personal or professional field from
                    this section without leaving the page.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isEditing
                    ? <>
                        <button
                          type="button"
                          onClick={saveProfile}
                          className="btn btn-primary"
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </>
                    : <button
                        type="button"
                        onClick={startEditing}
                        className="btn btn-ghost"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit information
                      </button>}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {personalFields.map((field) => {
                  const value =
                    field.key === "joined"
                      ? isEditing
                        ? draft.joined
                        : formatDate(profile.joined)
                      : String(draft[field.key] ?? "");
                  const resolvedType =
                    field.key === "joined"
                      ? isEditing
                        ? "date"
                        : "text"
                      : field.type;

                  return (
                    <label
                      key={field.key}
                      className="rounded-[26px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/78"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                        {field.label}
                      </span>
                      <input
                        type={resolvedType}
                        value={value}
                        disabled={!isEditing}
                        onChange={(event) =>
                          handleFieldChange(field.key, event.target.value)
                        }
                        className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
                      />
                    </label>
                  );
                })}

                <label className="rounded-[26px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/78 md:col-span-2 2xl:col-span-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                    Assigned classes
                  </span>
                  <input
                    type="text"
                    value={draft.classesText}
                    disabled={!isEditing}
                    onChange={(event) =>
                      handleFieldChange("classesText", event.target.value)
                    }
                    className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
                  />
                </label>

                <label className="rounded-[26px] border border-[var(--border)] bg-[var(--panel-2)] p-4 text-sm font-medium text-[var(--fg)]/78 md:col-span-2 2xl:col-span-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                    About
                  </span>
                  <textarea
                    rows={5}
                    value={draft.bio}
                    disabled={!isEditing}
                    onChange={(event) =>
                      handleFieldChange("bio", event.target.value)
                    }
                    className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:cursor-default disabled:bg-transparent"
                  />
                </label>
              </div>
            </section>

            <section className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                    Teacher stats
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Overview and leaderboard
                  </h2>
                  <p className="mt-2 max-w-xl text-sm font-medium text-[var(--fg)]/68">
                    A tighter combined section for teaching performance, focus,
                    and live ranking context.
                  </p>
                </div>
                <span className="chip bg-[var(--green)] text-[var(--fg)]">
                  Merged insights
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {mergedStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[26px] border border-[var(--border)] p-4"
                    style={{ backgroundColor: item.tone }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/58">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm font-medium text-[var(--fg)]/68">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] p-5">
                  <div className="flex items-center gap-3">
                    <span className="icon-shell h-11 w-11 text-[var(--blue)] shadow-[var(--shadow-tight)]">
                      <SparkIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/56">
                        Teaching profile
                      </p>
                      <h3 className="mt-1 text-xl font-semibold">
                        Daily priorities
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: "Focus area", value: profile.focusArea },
                      { label: "Experience", value: profile.experience },
                      {
                        label: "Emergency contact",
                        value: profile.emergencyContact,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)] px-4 py-4"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/56">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {profile.classes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(34,197,94,0.08))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="icon-shell h-11 w-11 text-[var(--amber)] shadow-[var(--shadow-tight)]">
                        <TrophyIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/56">
                          Leaderboard pulse
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">
                          Top teachers
                        </h3>
                      </div>
                    </div>
                    <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                      Rank #{teacherRank || 1}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {teacherLeaders.slice(0, 4).map((leader, index) => (
                      <div
                        key={leader.username}
                        className={`rounded-[22px] border px-4 py-4 ${
                          index === 0
                            ? "border-[rgba(37,99,235,0.24)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))]"
                            : "border-[var(--border)] bg-[var(--panel)]/72"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--blue)] text-xs font-semibold text-white">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold">
                                {leader.username}
                              </p>
                              <p className="text-xs font-medium text-[var(--fg)]/56">
                                Total points accumulated
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold">
                            {leader.points} pts
                          </p>
                        </div>

                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--panel)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--blue),var(--green))]"
                            style={{
                              width: `${Math.round(
                                (leader.points / leaderMaxPoints) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </section>

          <section
            id="activity-calendar"
            className="panel overflow-hidden rounded-[30px] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                  Streak calendar
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Activity, groups, and upcoming milestones
                </h2>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-[var(--fg)]/68">
                  A cleaner interactive view for app usage, teaching activity,
                  bookmarked dates, and NTSA events across the current schedule
                  window.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {calendarFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setCalendarFilter(filter.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      calendarFilter === filter.id
                        ? "border-transparent bg-[var(--blue)] text-white shadow-[var(--shadow-tight)]"
                        : "border-[var(--border)] bg-[var(--panel)] text-[var(--fg)]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
                  {[
                    { label: "App used", color: "var(--blue)" },
                    { label: "Groups handled", color: "var(--green)" },
                    { label: "Upcoming NTSA", color: "var(--amber)" },
                    { label: "Saved bookmark", color: "var(--rose)" },
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

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {filteredTimeline.map((day) => {
                    const isBookmarked = bookmarkedDays.includes(day.dateKey);

                    return (
                      <div
                        key={day.key}
                        className="rounded-[26px] border p-4 shadow-[var(--shadow-tight)]"
                        style={getDayStyle(day, isBookmarked)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-72">
                              {formatDate(day.date, { weekday: "short" })}
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                              {formatDate(day.date, {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {day.offset === 0
                              ? <span className="rounded-full border border-current/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                                  Today
                                </span>
                              : null}
                            <button
                              type="button"
                              onClick={() => toggleBookmark(day.dateKey)}
                              aria-label={
                                isBookmarked
                                  ? "Remove date bookmark"
                                  : "Bookmark date"
                              }
                              className={`rounded-full border p-2 ${
                                isBookmarked
                                  ? "border-transparent bg-[var(--rose)] text-white"
                                  : "border-current/18 bg-white/10 text-current"
                              }`}
                            >
                              <BookmarkIcon
                                filled={isBookmarked}
                                className="h-3.5 w-3.5"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm font-medium">
                          <p className="opacity-88">
                            {day.usedApp ? "App opened" : "No login recorded"}
                          </p>
                          <p className="opacity-88">
                            {day.groupsHandled > 0
                              ? `${day.groupsHandled} group${day.groupsHandled > 1 ? "s" : ""} handled`
                              : "No group handled"}
                          </p>
                          {day.ntsaItems.length > 0
                            ? <div className="space-y-1.5">
                                {day.ntsaItems.map((item) => (
                                  <p
                                    key={item.id}
                                    className="rounded-2xl border border-current/16 bg-white/8 px-3 py-2 text-xs font-semibold"
                                  >
                                    {item.title}
                                  </p>
                                ))}
                              </div>
                            : <p className="opacity-72">No NTSA milestone</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(225,29,72,0.08),rgba(37,99,235,0.06))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="icon-shell h-11 w-11 text-[var(--rose)] shadow-[var(--shadow-tight)]">
                        <BookmarkIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/56">
                          Saved bookmarks
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">
                          Pinned dates
                        </h3>
                      </div>
                    </div>
                    <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                      {pinnedDays.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {pinnedDays.length > 0
                      ? pinnedDays.map((day) => (
                          <div
                            key={day.dateKey}
                            className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)] px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {formatDate(day.date, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="mt-1 text-xs font-medium text-[var(--fg)]/58">
                                  {day.ntsaItems.length > 0
                                    ? day.ntsaItems[0].title
                                    : day.groupsHandled > 0
                                      ? `${day.groupsHandled} groups handled`
                                      : "Saved for follow-up"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(day.dateKey)}
                                className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      : <div className="rounded-[22px] border border-dashed border-[var(--border)] bg-[var(--panel)]/72 px-4 py-8 text-center text-sm font-medium text-[var(--fg)]/58">
                          Use the bookmark button on any day card to pin it
                          here.
                        </div>}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(37,99,235,0.06))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/56">
                        Upcoming NTSA dates
                      </p>
                      <h3 className="mt-1 text-xl font-semibold">
                        Next assessments
                      </h3>
                    </div>
                    <span className="chip bg-[var(--amber)] text-slate-950">
                      {upcomingNtsa.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {upcomingNtsa.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)] px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs font-medium text-[var(--fg)]/58">
                              {item.group}
                            </p>
                          </div>
                          <span className="rounded-full border border-[var(--border)] bg-[var(--amber-soft)] px-3 py-1 text-xs font-semibold">
                            {formatDate(item.date, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
