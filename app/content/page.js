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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/55">
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
    <div className="min-h-screen px-6 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Content" />
        <main className="space-y-6">
          <section className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Content studio
                </p>
                <h1 className="font-display text-3xl font-semibold">
                  Learning content
                </h1>
              </div>
              <span className="chip bg-[var(--blue)] text-white">
                {contentCount} items
              </span>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Media upload
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Video and image
                  </h2>
                </div>
                <span className="chip bg-[var(--green)] text-[var(--fg)]">
                  {mediaItems.length} live
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="glass-soft rounded-[28px] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/58">
                        Latest upload
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--fg)]/68">
                        {mediaState}
                      </p>
                    </div>
                    {latestMedia
                      ? <span className="chip bg-[var(--blue)] text-white">
                          {latestMedia.status}
                        </span>
                      : <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                          No media yet
                        </span>}
                  </div>

                  {latestMedia
                    ? <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative h-48 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel)]/80">
                          {renderMediaPreview(latestMedia)}
                        </div>
                        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)]/72 p-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                              {latestMedia.kind}
                            </span>
                            <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                              {formatFileSize(latestMedia.size)}
                            </span>
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">
                            {latestMedia.name}
                          </h3>
                          <p className="mt-2 text-sm font-medium text-[var(--fg)]/65">
                            Uploaded{" "}
                            {formatPublishedDate(latestMedia.uploadedAt)}. The
                            newest file appears first so teachers can confirm
                            what students will see next.
                          </p>
                        </div>
                      </div>
                    : <div className="mt-4 rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--panel)]/65 px-4 py-10 text-center text-sm font-medium text-[var(--fg)]/55">
                        Upload a video or image to show the newest media here
                        instantly.
                      </div>}
                </div>

                <label className="panel-soft flex flex-col gap-2 p-4 text-sm font-medium text-[var(--fg)]/70">
                  Upload lesson video
                  <input
                    type="file"
                    accept="video/*"
                    className="text-sm text-[var(--fg)]"
                    onChange={(event) => handleMediaUpload("Video", event)}
                  />
                </label>
                <label className="panel-soft flex flex-col gap-2 p-4 text-sm font-medium text-[var(--fg)]/70">
                  Upload cover image
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[var(--fg)]"
                    onChange={(event) => handleMediaUpload("Image", event)}
                  />
                </label>

                <div className="grid gap-3">
                  {mediaItems.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${
                        index === 0
                          ? "border-[rgba(37,99,235,0.26)] bg-[var(--panel)] shadow-[var(--shadow-tight)]"
                          : "border-[var(--border)] bg-[var(--panel-2)]"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-[var(--fg)]/60">
                          {item.kind} | {formatFileSize(item.size)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {index === 0
                          ? <span className="chip bg-[var(--blue)] text-white">
                              Latest
                            </span>
                          : null}
                        <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Links library
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Add learning links
                  </h2>
                </div>
                <span className="chip bg-[var(--blue)] text-white">
                  {links.length} links
                </span>
              </div>

              <div className="mt-5 space-y-4">
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button type="submit" className="btn btn-primary">
                      Add link
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                      {linkState}
                    </span>
                  </div>
                </form>

                {latestLink
                  ? <div className="glass-soft rounded-[28px] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/58">
                            Latest published link
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {latestLink.label}
                          </h3>
                        </div>
                        <span className="chip bg-[var(--green)] text-[var(--fg)]">
                          Student dashboard
                        </span>
                      </div>
                      <a
                        href={latestLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 block rounded-[24px] border border-[var(--border)] bg-[var(--panel)] px-4 py-4 text-sm font-medium text-[var(--fg)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-tight)]"
                      >
                        <span className="block truncate">{latestLink.url}</span>
                        <span className="mt-2 block text-xs text-[var(--fg)]/55">
                          Published {formatPublishedDate(latestLink.addedAt)}
                        </span>
                      </a>
                    </div>
                  : null}

                <div className="space-y-2">
                  {links.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${
                        index === 0
                          ? "border-[rgba(37,99,235,0.26)] bg-[var(--panel)] shadow-[var(--shadow-tight)]"
                          : "border-[var(--border)] bg-[var(--panel)]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate">{item.url}</p>
                        <p className="mt-1 text-xs text-[var(--fg)]/60">
                          {item.source} | {formatPublishedDate(item.addedAt)}
                        </p>
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-2">
                        {index === 0
                          ? <span className="chip bg-[var(--blue)] text-white">
                              Latest
                            </span>
                          : null}
                        <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
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

          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Quiz creation
                </p>
                <h2 className="font-display text-2xl font-semibold">
                  Build a quiz
                </h2>
              </div>
              <span className="chip bg-[var(--green)] text-[var(--fg)]">
                2 questions
              </span>
            </div>
            <div className="mt-6 grid gap-6">
              {[1, 2].map((index) => (
                <div key={index} className="panel-soft flex flex-col gap-4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--fg)]/70">
                      Question {index}
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold text-[var(--fg)]/60">
                      Correct option position
                      <select className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]">
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Answer A"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                    />
                    <input
                      type="text"
                      placeholder="Answer B"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                    />
                    <input
                      type="text"
                      placeholder="Answer C"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                    />
                    <input
                      type="text"
                      placeholder="Answer D"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
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

          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Materials vault
                </p>
                <h2 className="font-display text-2xl font-semibold">
                  Ready to send
                </h2>
              </div>
              <span className="chip bg-[var(--green)] text-[var(--fg)]">
                Updated
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {materials.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--fg)]/60">
                      GoDomain Studio
                    </p>
                  </div>
                  <span className="chip bg-[var(--blue)] text-white">
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
