"use client";

import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";
import SetTest from "../components/setTest";
import SideFoot from "../components/sideFoot";
import {
  CONTENT_LINKS_KEY,
  CONTENT_MEDIA_KEY,
  createStudioId,
  defaultPublishedLinks,
  defaultPublishedMedia,
  formatFileSize,
  formatPublishedDate,
  readStudioCollection,
  writeStudioCollection,
} from "../lib/contentStudioStore";
import StudentLearningPathSection from "./components/studentLearningPathSection";

const materials = [
  { title: "Road rules handbook 2026", type: "PDF" },
  { title: "Mock theory exam pack", type: "QUIZ" },
  { title: "Night driving safety guide", type: "PDF" },
  { title: "Defensive driving slides", type: "SLIDES" },
];

function StudioSparkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="m12 3.75 1.35 3.3 3.4 1.2-3.4 1.2L12 12.75l-1.35-3.3-3.4-1.2 3.4-1.2L12 3.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m18 12.5.82 2.02 2.03.73-2.03.72L18 18l-.82-2.03-2.03-.72 2.03-.73L18 12.5Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m6 13 .67 1.66 1.66.59-1.66.58L6 17.5l-.67-1.67-1.66-.58 1.66-.59L6 13Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MediaStackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="4" y="5" width="16" height="14" rx="3" strokeWidth="1.8" />
      <path
        d="m8.25 14.75 2.5-2.5 2.25 2.25 2.75-3 2.25 3.25"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9.25" r="1.25" strokeWidth="1.8" />
    </svg>
  );
}

function LinkLibraryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M10.25 7.75H8.5a4 4 0 0 0 0 8h1.75"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13.75 7.75h1.75a4 4 0 0 1 0 8h-1.75"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M8.75 12h6.5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function QuizBuilderIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M6 5.25h12A1.75 1.75 0 0 1 19.75 7v10A1.75 1.75 0 0 1 18 18.75H6A1.75 1.75 0 0 1 4.25 17V7A1.75 1.75 0 0 1 6 5.25Z"
        strokeWidth="1.8"
      />
      <path
        d="M8 9h8M8 12.5h4.5M8 16h6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VaultIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5v-9Z"
        strokeWidth="1.8"
      />
      <path d="M8.25 11.75h7.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 9.5h4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 14h4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SectionMarker({ Icon, toneClass = "text-[var(--blue)]" }) {
  return (
    <span
      className={`icon-shell h-12 w-12 shadow-(--shadow-tight) ${toneClass}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function getHostnameLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Published link";
  }
}

function removePreview(item) {
  const nextItem = { ...item };
  delete nextItem.previewUrl;

  return {
    ...nextItem,
    status: "Published",
  };
}

function renderMediaPreview(item) {
  if (item.previewUrl && item.mimeType?.startsWith("image/")) {
    return (
      <Image
        src={item.previewUrl}
        alt={item.name}
        fill
        unoptimized
        className="h-full w-full rounded-[26px] object-cover"
      />
    );
  }

  if (item.previewUrl && item.mimeType?.startsWith("video/")) {
    return (
      <video
        src={item.previewUrl}
        muted
        playsInline
        className="h-full w-full rounded-[26px] object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,rgba(37,99,235,0.16),rgba(34,197,94,0.16))] text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)/55">
          Preview
        </p>
        <p className="mt-2 text-lg font-semibold">{item.kind}</p>
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [links, setLinks] = useState(defaultPublishedLinks);
  const [mediaItems, setMediaItems] = useState(defaultPublishedMedia);
  const [linkInput, setLinkInput] = useState("");
  const [linkState, setLinkState] = useState("Ready to publish");
  const [mediaState, setMediaState] = useState("Waiting for upload");
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    setLinks(readStudioCollection(CONTENT_LINKS_KEY, defaultPublishedLinks));
    setMediaItems(
      readStudioCollection(CONTENT_MEDIA_KEY, defaultPublishedMedia),
    );
  }, []);

  useEffect(
    () => () => {
      previewUrlsRef.current.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    },
    [],
  );

  function handleAddLink() {
    const trimmedLink = linkInput.trim();
    if (!trimmedLink) {
      setLinkState("Paste a link first");
      return;
    }

    let normalizedLink;

    try {
      normalizedLink = new URL(trimmedLink).toString();
    } catch {
      setLinkState("Enter a valid URL");
      return;
    }

    const nextLink = {
      id: createStudioId("link"),
      label: getHostnameLabel(normalizedLink),
      url: normalizedLink,
      source: "GoDomain Studio",
      addedAt: new Date().toISOString(),
      status: "Published",
    };

    setLinkInput("");
    setLinkState("Publishing to student dashboard...");

    startTransition(() => {
      setLinks((currentLinks) => {
        const nextLinks = [
          nextLink,
          ...currentLinks.filter((item) => item.url !== normalizedLink),
        ];
        writeStudioCollection(CONTENT_LINKS_KEY, nextLinks);
        return nextLinks;
      });
    });

    window.setTimeout(() => {
      setLinkState("Latest link published to students");
    }, 420);
  }

  function handleMediaUpload(kind, event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl =
      file.type.startsWith("image/") || file.type.startsWith("video/")
        ? URL.createObjectURL(file)
        : null;

    if (previewUrl) {
      previewUrlsRef.current.push(previewUrl);
    }

    const storedItem = {
      id: createStudioId("media"),
      kind,
      mimeType: file.type || `${kind.toLowerCase()}/*`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "Published",
    };

    const optimisticItem = {
      ...storedItem,
      status: "Uploading",
      previewUrl,
    };

    setMediaState(`${file.name} uploading...`);

    startTransition(() => {
      setMediaItems((currentItems) => {
        const nextItems = [optimisticItem, ...currentItems];
        writeStudioCollection(CONTENT_MEDIA_KEY, [
          storedItem,
          ...currentItems.map(removePreview),
        ]);
        return nextItems;
      });
    });

    window.setTimeout(() => {
      setMediaItems((currentItems) =>
        currentItems.map((item) =>
          item.id === storedItem.id ? { ...item, status: "Published" } : item,
        ),
      );
      setMediaState(`${file.name} is live`);
    }, 700);

    event.target.value = "";
  }

  const latestLink = links[0];
  const latestMedia = mediaItems[0];
  const contentCount = materials.length + links.length + mediaItems.length;

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Content" />
        <main className="dashboard-main space-y-6">
          <section className="dashboard-section enter rounded-[34px] p-6 sm:p-7">
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-(--aura-blue) blur-3xl" />
            <div className="absolute bottom-0 left-8 h-28 w-28 rounded-full bg-(--aura-green) blur-3xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex max-w-3xl items-start gap-4">
                <SectionMarker
                  Icon={StudioSparkIcon}
                  toneClass="text-(--blue)"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/60">
                    Content studio
                  </p>
                  <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                    Learning content
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-(--muted)">
                    Upload media, publish links, build quizzes, and shape the
                    student learning path from one polished studio workspace.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip bg-(--blue) text-white">
                  {contentCount} items
                </span>
                <span className="chip bg-(--panel-strong) text-foreground">
                  Adaptive theme
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="dashboard-section enter rounded-4xl p-6">
              <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-(--aura-blue) blur-3xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <SectionMarker
                    Icon={MediaStackIcon}
                    toneClass="text-[var(--green)]"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/60">
                      Media upload
                    </p>
                    <h2 className="font-display text-2xl font-semibold">
                      Video and image
                    </h2>
                  </div>
                </div>
                <span className="chip bg-(--green) text-foreground">
                  {mediaItems.length} live
                </span>
              </div>

              <div className="relative mt-5 grid gap-4">
                <div className="glass-soft interactive-tile spotlight-ring rounded-[30px] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                        Latest upload
                      </p>
                      <p className="mt-1 text-sm font-medium text-(--fg)/68">
                        {mediaState}
                      </p>
                    </div>
                    {latestMedia
                      ? <span className="chip bg-(--blue) text-white">
                          {latestMedia.status}
                        </span>
                      : <span className="chip bg-(--panel-strong) text-foreground">
                          No media yet
                        </span>}
                  </div>

                  {latestMedia
                    ? <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative h-48 overflow-hidden rounded-[28px] border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))]">
                          {renderMediaPreview(latestMedia)}
                        </div>
                        <div className="rounded-[28px] border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] p-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="chip bg-(--panel) text-foreground">
                              {latestMedia.kind}
                            </span>
                            <span className="chip bg-(--panel) text-foreground">
                              {formatFileSize(latestMedia.size)}
                            </span>
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">
                            {latestMedia.name}
                          </h3>
                          <p className="mt-2 text-sm font-medium text-(--fg)/65">
                            Uploaded{" "}
                            {formatPublishedDate(latestMedia.uploadedAt)}. The
                            newest file appears first so teachers can confirm
                            what students will see next.
                          </p>
                        </div>
                      </div>
                    : <div className="mt-4 rounded-[28px] border border-dashed border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] px-4 py-10 text-center text-sm font-medium text-(--fg)/55">
                        Upload a video or image to show the newest media here
                        instantly.
                      </div>}
                </div>

                <label className="panel-soft interactive-tile flex flex-col gap-2 rounded-[26px] p-4 text-sm font-medium text-(--fg)/70">
                  Upload lesson video
                  <input
                    type="file"
                    accept="video/*"
                    className="text-sm text-foreground"
                    onChange={(event) => handleMediaUpload("Video", event)}
                  />
                </label>
                <label className="panel-soft interactive-tile flex flex-col gap-2 rounded-[26px] p-4 text-sm font-medium text-(--fg)/70">
                  Upload cover image
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-foreground"
                    onChange={(event) => handleMediaUpload("Image", event)}
                  />
                </label>

                <div className="grid gap-3">
                  {mediaItems.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className={`interactive-tile flex items-center justify-between rounded-3xl border px-4 py-3 text-sm font-medium ${
                        index === 0
                          ? "border-[rgba(37,99,235,0.26)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] shadow-(--shadow-tight)"
                          : "border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))]"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-(--fg)/60">
                          {item.kind} | {formatFileSize(item.size)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {index === 0
                          ? <span className="chip bg-(--blue) text-white">
                              Latest
                            </span>
                          : null}
                        <span className="chip bg-(--panel-strong) text-foreground">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-section enter rounded-4xl p-6">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-(--aura-green) blur-3xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <SectionMarker
                    Icon={LinkLibraryIcon}
                    toneClass="text-[var(--blue)]"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/60">
                      Links library
                    </p>
                    <h2 className="font-display text-2xl font-semibold">
                      Add learning links
                    </h2>
                  </div>
                </div>
                <span className="chip bg-(--blue) text-white">
                  {links.length} links
                </span>
              </div>

              <div className="relative mt-5 space-y-4">
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAddLink();
                  }}
                >
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(event) => setLinkInput(event.target.value)}
                    placeholder="https://..."
                    className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button type="submit" className="btn btn-primary">
                      Add link
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/55">
                      {linkState}
                    </span>
                  </div>
                </form>

                {latestLink
                  ? <div className="glass-soft interactive-tile spotlight-ring rounded-[30px] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                            Latest published link
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {latestLink.label}
                          </h3>
                        </div>
                        <span className="chip bg-(--green) text-foreground">
                          Student dashboard
                        </span>
                      </div>
                      <a
                        href={latestLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="interactive-tile mt-4 block rounded-3xl border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-4 text-sm font-medium text-foreground"
                      >
                        <span className="block truncate">{latestLink.url}</span>
                        <span className="mt-2 block text-xs text-(--fg)/55">
                          Published {formatPublishedDate(latestLink.addedAt)}
                        </span>
                      </a>
                    </div>
                  : null}

                <div className="space-y-2">
                  {links.map((item, index) => (
                    <div
                      key={item.id}
                      className={`interactive-tile flex items-center justify-between rounded-3xl border px-4 py-3 text-sm font-medium ${
                        index === 0
                          ? "border-[rgba(37,99,235,0.26)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] shadow-(--shadow-tight)"
                          : "border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate">{item.url}</p>
                        <p className="mt-1 text-xs text-(--fg)/60">
                          {item.source} | {formatPublishedDate(item.addedAt)}
                        </p>
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-2">
                        {index === 0
                          ? <span className="chip bg-(--blue) text-white">
                              Latest
                            </span>
                          : null}
                        <span className="chip bg-(--panel-strong) text-foreground">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <SetTest />

          <section className="dashboard-section enter rounded-4xl p-6">
            <div className="absolute -right-6 top-0 h-24 w-24 rounded-full bg-(--aura-rose) blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-start gap-4">
                <SectionMarker
                  Icon={QuizBuilderIcon}
                  toneClass="text-[var(--amber)]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/60">
                    Quiz creation
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Build a quiz
                  </h2>
                </div>
              </div>
              <span className="chip bg-(--green) text-foreground">
                2 questions
              </span>
            </div>
            <div className="relative mt-6 grid gap-6">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="panel-soft interactive-tile flex flex-col gap-4 rounded-[28px] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-(--fg)/70">
                      Question {index}
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold text-(--fg)/60">
                      Correct option position
                      <select className="field-shell rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)">
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                      </select>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={`Question ${index}`}
                    className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-(--fg)/50 focus:outline-none focus:ring-2 focus:ring-(--blue)"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Answer A"
                      className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
                    />
                    <input
                      type="text"
                      placeholder="Answer B"
                      className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
                    />
                    <input
                      type="text"
                      placeholder="Answer C"
                      className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
                    />
                    <input
                      type="text"
                      placeholder="Answer D"
                      className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">
                Save quiz
              </button>
              <button type="button" className="btn btn-ghost">
                Add question
              </button>
            </div>
          </section>

          <section className="dashboard-section enter rounded-4xl p-6">
            <div className="absolute left-4 top-4 h-24 w-24 rounded-full bg-(--aura-blue) blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-start gap-4">
                <SectionMarker
                  Icon={VaultIcon}
                  toneClass="text-[var(--blue)]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/60">
                    Materials vault
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Ready to send
                  </h2>
                </div>
              </div>
              <span className="chip bg-(--green) text-foreground">
                Updated
              </span>
            </div>
            <div className="relative mt-5 grid gap-3 md:grid-cols-2">
              {materials.map((item) => (
                <div
                  key={item.title}
                  className="interactive-tile flex items-center justify-between rounded-3xl border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-3 text-sm font-medium"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-(--fg)/60">
                      GoDomain Studio
                    </p>
                  </div>
                  <span className="chip bg-(--blue) text-white">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <StudentLearningPathSection />
        </main>
      </div>
    </div>
  );
}
