"use client";

import { useEffect, useState } from "react";
import {
  CONTENT_LINKS_KEY,
  CONTENT_MEDIA_KEY,
  defaultPublishedLinks,
  defaultPublishedMedia,
  formatFileSize,
  formatPublishedDate,
  readStudioCollection,
} from "../../lib/contentStudioStore";

const medalToneStyles = {
  amber: {
    backgroundColor: "rgba(245, 158, 11, 0.16)",
    borderColor: "rgba(245, 158, 11, 0.35)",
  },
  blue: {
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderColor: "rgba(37, 99, 235, 0.3)",
  },
  green: {
    backgroundColor: "rgba(34, 197, 94, 0.16)",
    borderColor: "rgba(34, 197, 94, 0.34)",
  },
  rose: {
    backgroundColor: "rgba(225, 29, 72, 0.12)",
    borderColor: "rgba(225, 29, 72, 0.26)",
  },
};

export default function StudentInfo({ student }) {
  const studiedCount = student.studyDays.filter((item) => item.studied).length;
  const [publishedLinks, setPublishedLinks] = useState(defaultPublishedLinks);
  const [publishedMedia, setPublishedMedia] = useState(defaultPublishedMedia);

  useEffect(() => {
    function syncPublishedContent() {
      setPublishedLinks(
        readStudioCollection(CONTENT_LINKS_KEY, defaultPublishedLinks),
      );
      setPublishedMedia(
        readStudioCollection(CONTENT_MEDIA_KEY, defaultPublishedMedia),
      );
    }

    syncPublishedContent();
    window.addEventListener("storage", syncPublishedContent);

    return () => window.removeEventListener("storage", syncPublishedContent);
  }, []);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
            Student profile
          </p>
          <h1 className="font-display text-4xl font-semibold">
            {student.name}
          </h1>
          <p className="text-sm font-medium text-[var(--fg)]/70">
            {student.className} - {student.index}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2 text-sm font-semibold">
            {student.track}
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[rgba(34,197,94,0.14)] px-4 py-2 text-sm font-semibold">
            {student.status}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel p-6 hover-lift">
          <p className="font-display text-2xl font-semibold">
            Progress snapshot
          </p>
          <div className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--fg)]/60">
              <span>Completion</span>
              <span>{student.progress}%</span>
            </div>
            <div className="mt-2 h-4 rounded-full border border-[var(--border)] bg-[var(--panel)]">
              <div
                className="h-full rounded-full bg-[var(--blue)]"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Program
              </p>
              <p className="mt-2 text-lg font-semibold">{student.track}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Weeks in school
              </p>
              <p className="mt-2 text-lg font-semibold">{student.weeks}</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Next test
              </p>
              <p className="mt-2 text-lg font-semibold">{student.nextTest}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(34,197,94,0.08))] p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
              <span>5-day study streak</span>
              <span className="text-[var(--fg)]">{studiedCount}/5 days</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {student.studyDays.map((day) => (
                <div key={day.label} className="text-center">
                  <div
                    className="h-12 rounded-2xl border border-[var(--border)]"
                    style={{
                      background: day.studied
                        ? "linear-gradient(180deg, rgba(37,99,235,0.92), rgba(34,197,94,0.92))"
                        : "var(--panel)",
                    }}
                  />
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                    {day.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--blue-2)] p-6 text-white shadow-[var(--shadow-tight)] hover-lift">
          <p className="font-display text-2xl font-semibold">
            Instructor notes
          </p>
          <p className="mt-4 text-sm font-medium text-white/80">
            {student.notes}
          </p>
          <div className="mt-6 space-y-3">
            {student.weakAreas.map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-white/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="panel p-6 hover-lift">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
              Published from GoDomain
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Student dashboard feed
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium text-[var(--fg)]/70">
              Newly added learning links appear here first, and recent teacher
              uploads are listed underneath so students can see what is live.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-[var(--green)] text-[var(--fg)]">
              {publishedLinks.length} links
            </span>
            <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
              {publishedMedia.length} media
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(34,197,94,0.08))] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                  Latest live link
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {publishedLinks[0]?.label ?? "No live links yet"}
                </h3>
              </div>
              <span className="chip bg-[var(--blue)] text-white">Latest</span>
            </div>

            {publishedLinks[0]
              ? <a
                  href={publishedLinks[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-[24px] border border-[var(--border)] bg-[var(--panel)] px-4 py-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-tight)]"
                >
                  <span className="block truncate text-sm font-semibold">
                    {publishedLinks[0].url}
                  </span>
                  <span className="mt-2 block text-xs font-medium text-[var(--fg)]/60">
                    Published {formatPublishedDate(publishedLinks[0].addedAt)}
                  </span>
                </a>
              : <div className="mt-4 rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--panel)] px-4 py-8 text-center text-sm font-medium text-[var(--fg)]/55">
                  No live links have been published yet.
                </div>}

            <div className="mt-4 space-y-2">
              {publishedLinks.slice(1, 4).map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)]/78 px-4 py-3 text-sm font-medium"
                >
                  <div className="min-w-0">
                    <p className="truncate">{link.url}</p>
                    <p className="mt-1 text-xs text-[var(--fg)]/60">
                      {formatPublishedDate(link.addedAt)}
                    </p>
                  </div>
                  <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                    Live
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-tight)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                  Recent uploads
                </p>
                <h3 className="mt-2 text-xl font-semibold">Media published</h3>
              </div>
              <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                Synced
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {publishedMedia.length > 0
                ? publishedMedia.slice(0, 4).map((item, index) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        index === 0
                          ? "border-[rgba(37,99,235,0.24)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(255,255,255,0.88))]"
                          : "border-[var(--border)] bg-[var(--panel-2)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--fg)]/60">
                            {item.kind} | {formatFileSize(item.size)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
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
                      <p className="mt-3 text-xs font-medium text-[var(--fg)]/60">
                        Uploaded {formatPublishedDate(item.uploadedAt)}
                      </p>
                    </div>
                  ))
                : <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--panel-2)] px-4 py-10 text-center text-sm font-medium text-[var(--fg)]/55">
                    No media has been published yet.
                  </div>}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-tight)] hover-lift">
          <p className="font-display text-2xl font-semibold">Contact student</p>
          <div className="mt-5 space-y-3 text-sm font-medium text-[var(--fg)]/80">
            <p>Email: {student.contact.email}</p>
            <p>Phone: {student.contact.phone}</p>
            <p>Guardian: {student.contact.guardian}</p>
          </div>
          <button type="button" className="mt-6 w-full btn btn-primary">
            Start chat
          </button>
        </div>

        <div className="panel p-6 hover-lift">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-2xl font-semibold">
              Achievements and checklist
            </p>
            <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
              New medals weekly
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {student.achievements.map((achievement) => (
              <span
                key={`${achievement.week}-${achievement.medal}`}
                className="rounded-full border px-3 py-2 text-xs font-semibold"
                style={medalToneStyles[achievement.tone]}
              >
                {achievement.medal} - {achievement.week}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {student.checklist.map((item, index) => (
              <label
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium"
              >
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className="h-4 w-4 accent-[var(--blue)]"
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
