"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "goteach.communication.draft.v1";

function getScopeLabel(scope) {
  if (scope === "some") {
    return "Selected students";
  }
  if (scope === "except") {
    return "Everyone except the selected students";
  }
  return "Entire student population";
}

export default function CommunicationPanel({ students }) {
  const [scope, setScope] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Start a message and choose recipients."
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setScope(parsed.scope ?? "all");
      setMessage(parsed.message ?? "");
      setSelectedIds(
        Array.isArray(parsed.selectedIds)
          ? parsed.selectedIds.filter((value) =>
              students.some((student) => student.id === value)
            )
          : []
      );
      setStatusMessage("Loaded your saved communication draft.");
    } catch {
      setStatusMessage("Communication draft storage was skipped.");
    }
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const haystack = [
        student.name,
        student.program,
        student.className,
        student.index,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm, students]);

  const selectedStudents = useMemo(
    () => students.filter((student) => selectedIds.includes(student.id)),
    [selectedIds, students]
  );

  const recipientCount =
    scope === "all"
      ? students.length
      : scope === "some"
        ? selectedIds.length
        : students.length - selectedIds.length;

  function toggleStudent(studentId) {
    setSelectedIds((current) =>
      current.includes(studentId)
        ? current.filter((value) => value !== studentId)
        : [...current, studentId]
    );
  }

  function saveDraft() {
    const payload = {
      scope,
      selectedIds,
      message,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setStatusMessage("Draft saved locally.");
    } catch {
      setStatusMessage("The draft could not be stored in this browser.");
    }
  }

  function sendMessage() {
    if (!message.trim()) {
      setStatusMessage("Write a message before sending.");
      return;
    }

    if (scope !== "all" && recipientCount <= 0) {
      setStatusMessage("Choose at least one student for this message.");
      return;
    }

    setStatusMessage(`Message queued for ${recipientCount} recipients.`);
    setMessage("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_1.35fr]">
      <div className="glass-soft rounded-[28px] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)/60">
              Recipient picker
            </p>
            <p className="mt-1 text-sm font-medium text-(--fg)/72">
              {getScopeLabel(scope)}
            </p>
          </div>
          <span className="chip bg-(--panel) text-foreground">
            {recipientCount} recipients
          </span>
        </div>

        <fieldset className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { id: "all", label: "Entire class" },
            { id: "some", label: "Selected only" },
            { id: "except", label: "All except" },
          ].map((option) => (
            <label
              key={option.id}
              className={`rounded-2xl border px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${
                scope === option.id
                  ? "border-(--blue) bg-(--blue) text-white"
                  : "border-(--border) bg-(--panel) text-foreground"
              }`}
            >
              <input
                type="radio"
                name="recipient-scope"
                value={option.id}
                checked={scope === option.id}
                onChange={(event) => setScope(event.target.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        <label className="mt-4 block text-sm font-medium text-(--fg)/80">
          Search students
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, index, class, or program"
            className="mt-2 w-full rounded-2xl border border-(--border) bg-(--panel) px-4 py-3 text-sm text-foreground outline-none placeholder:text-(--fg)/45 focus:ring-2 focus:ring-(--blue)"
          />
        </label>

        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex w-full items-center justify-between rounded-2xl border border-(--border) bg-(--panel) px-4 py-3 text-left text-sm font-semibold"
          >
            <span>
              {selectedIds.length > 0
                ? `${selectedIds.length} students chosen`
                : "Open student dropdown"}
            </span>
            <span className="text-xs uppercase tracking-[0.16em] text-(--fg)/55">
              {menuOpen ? "Hide" : "Show"}
            </span>
          </button>

          {menuOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-10 max-h-72 overflow-auto rounded-3xl border border-(--border) bg-(--panel) p-3 shadow-(--shadow)">
              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-start gap-3 rounded-2xl border border-(--border) bg-(--panel-2) px-3 py-3 text-sm font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="mt-1 h-4 w-4 accent-(--blue)"
                      />
                      <span className="flex-1">
                        <span className="block font-semibold">{student.name}</span>
                        <span className="mt-1 block text-xs text-(--fg)/60">
                          {student.program} | {student.className}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-(--border) px-4 py-8 text-center text-sm font-medium text-(--fg)/60">
                  No students match that search.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-3xl border border-(--border) bg-(--panel)/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)/60">
            Selected students
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedStudents.length > 0 ? (
              selectedStudents.map((student) => (
                <span
                  key={student.id}
                  className="rounded-full border border-(--border) bg-(--panel-2) px-3 py-2 text-xs font-semibold"
                >
                  {student.name}
                </span>
              ))
            ) : (
              <p className="text-sm font-medium text-(--fg)/60">
                No names selected yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-soft rounded-[28px] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)]60">
          Broadcast composer
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Teacher communication
        </h2>
        <textarea
          rows={7}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message to students, driving school groups, or automotive engineering cohorts..."
          className="mt-4 w-full resize-none rounded-3xl border border-(--border) bg-(--panel) px-4 py-4 text-sm font-medium text-foreground outline-none placeholder:text-(--fg)/45 focus:ring-2 focus:ring-(--blue)"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={sendMessage} className="btn btn-primary">
            Send to students
          </button>
          <button type="button" onClick={saveDraft} className="btn btn-ghost">
            Save draft
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-(--border) bg-(--panel)/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)/60">
              Audience snapshot
            </p>
            <p className="mt-3 text-2xl font-semibold">{recipientCount}</p>
            <p className="mt-1 text-sm font-medium text-(--fg)/65">
              {getScopeLabel(scope)}
            </p>
          </div>
          <div className="rounded-3xl border border-(--border) bg-(--panel)/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--fg)/60">
              Status
            </p>
            <p className="mt-3 text-sm font-medium text-(--fg)/72">
              {statusMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
