"use client";

import { useEffect, useState } from "react";
import SideFoot from "../components/sideFoot";
import {
  activeStudentsCount,
  classCategoryCatalog,
  getStudentsByClassCategory,
  students,
} from "../data/students";
import ClassCategoryCard from "./components/classCategoryCard";

const DRAFT_KEY = "goTeach.communicationDraft";

const recipientScopes = [
  { id: "all", label: "Select all", detail: "Send to every learner." },
  {
    id: "some",
    label: "Selected learners",
    detail: "Only send to the learners you pick below.",
  },
  {
    id: "except",
    label: "Select all except",
    detail: "Send to everyone except the selected learners.",
  },
];

function matchesStudent(student, searchTerm) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [
    student.name,
    student.id,
    student.className,
    student.track,
    student.status,
  ].some((value) => value.toLowerCase().includes(query));
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [scope, setScope] = useState("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [composeState, setComposeState] = useState("Ready");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedDraft = window.localStorage.getItem(DRAFT_KEY);
    if (storedDraft) {
      setBroadcastMessage(storedDraft);
      setComposeState("Draft restored");
    }
  }, []);

  const filteredStudents = students.filter((student) =>
    matchesStudent(student, searchTerm),
  );
  const classCategories = classCategoryCatalog.map((category) => ({
    ...category,
    count: getStudentsByClassCategory(category.id).length,
  }));

  const recipientStudents =
    scope === "all"
      ? students
      : scope === "some"
        ? students.filter((student) => selectedIds.includes(student.id))
        : students.filter((student) => !selectedIds.includes(student.id));

  const addSelectedStudent = (studentId) => {
    if (!studentId) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(studentId) ? current : [...current, studentId],
    );
    setComposeState("Recipient updated");
  };

  const removeSelectedStudent = (studentId) => {
    setSelectedIds((current) => current.filter((id) => id !== studentId));
    setComposeState("Recipient updated");
  };

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DRAFT_KEY, broadcastMessage);
    }
    setComposeState("Draft saved");
  };

  const handleSend = () => {
    if (!broadcastMessage.trim()) {
      setComposeState("Write a message first");
      return;
    }

    setComposeState(`Prepared for ${recipientStudents.length} learners`);
  };

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Students" />
        <main className="dashboard-main space-y-6">
          <section className="glass rounded-[24px] p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/60">
                  Communication
                </p>
                <h1 className="mt-1.5 font-display text-2xl font-semibold">
                  Learner outreach
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs font-medium leading-5 text-[var(--fg)]/70">
                  Search the roster, choose recipients from the dropdown, and
                  keep all learner communication in one place.
                </p>
              </div>
              <span className="chip bg-[var(--green)] text-[var(--fg)]">
                {activeStudentsCount} / {students.length} active
              </span>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[22px] border border-[var(--border)] bg-[var(--panel)]/65 p-3.5 shadow-[var(--shadow-tight)] md:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
                    Recipient filters
                  </p>
                  <span className="text-[10px] font-medium text-[var(--fg)]/55">
                    {filteredStudents.length} matches
                  </span>
                </div>

                <fieldset className="mt-4 grid gap-2">
                  {recipientScopes.map((option) => (
                    <label
                      key={option.id}
                      className={`rounded-[22px] border px-3 py-2.5 text-xs font-medium transition ${
                        scope === option.id
                          ? "border-transparent bg-[var(--blue)] text-white shadow-[var(--shadow-tight)]"
                          : "border-[var(--border)] bg-[var(--panel)] text-[var(--fg)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="recipient-scope"
                          value={option.id}
                          checked={scope === option.id}
                          onChange={(event) => setScope(event.target.value)}
                          className="h-3.5 w-3.5 accent-[var(--blue)]"
                        />
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          <p
                            className={`text-[11px] leading-4 ${
                              scope === option.id
                                ? "text-white/75"
                                : "text-[var(--fg)]/60"
                            }`}
                          >
                            {option.detail}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </fieldset>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
                  <label className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-2)] p-3 text-xs font-medium text-[var(--fg)]/80 md:p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                      Search learners
                    </span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, ID, class, or program..."
                      className="mt-2.5 w-full rounded-[18px] border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-xs text-[var(--fg)] placeholder:text-[var(--fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                    />
                  </label>

                  <label className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-2)] p-3 text-xs font-medium text-[var(--fg)]/80 md:p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                      Dropdown menu
                    </span>
                    <select
                      className="mt-2.5 w-full rounded-[18px] border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                      defaultValue=""
                      onChange={(event) => {
                        addSelectedStudent(event.target.value);
                        event.target.value = "";
                      }}
                    >
                      <option value="">Choose learner</option>
                      {filteredStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 rounded-[22px] border border-[var(--border)] bg-[var(--panel)] p-3 md:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
                      Selected learners
                    </p>
                    <span className="text-[10px] font-medium text-[var(--fg)]/55">
                      {selectedIds.length} chosen
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedIds.length > 0
                      ? selectedIds.map((studentId) => {
                          const learner = students.find(
                            (student) => student.id === studentId,
                          );
                          if (!learner) {
                            return null;
                          }

                          return (
                            <button
                              key={studentId}
                              type="button"
                              onClick={() => removeSelectedStudent(studentId)}
                              className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1.5 text-[10px] font-semibold"
                            >
                              {learner.name} x
                            </button>
                          );
                        })
                      : <p className="text-xs font-medium text-[var(--fg)]/55">
                          Use the search bar and dropdown menu to add
                          recipients.
                        </p>}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(245,158,11,0.08))] p-3.5 shadow-[var(--shadow-tight)] md:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
                      Teacher broadcast
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-semibold">
                      Communication composer
                    </h2>
                  </div>
                  <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                    {composeState}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "Recipients", value: recipientStudents.length },
                    { label: "Active learners", value: activeStudentsCount },
                    { label: "Search results", value: filteredStudents.length },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[18px] border border-[var(--border)] bg-[var(--panel)] p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fg)]/55">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-xl font-semibold">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <textarea
                  rows={5}
                  value={broadcastMessage}
                  onChange={(event) => setBroadcastMessage(event.target.value)}
                  placeholder="Write a message to your learners..."
                  className="mt-4 w-full resize-none rounded-[22px] border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-xs font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSend}
                    className="btn btn-primary"
                  >
                    Send to learners
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="btn btn-ghost"
                  >
                    Save draft
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/60">
                  Class categories
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold">
                  A to D learner groups
                </h2>
                <p className="mt-1.5 max-w-3xl text-xs font-medium leading-5 text-[var(--fg)]/70">
                  Open a category to view learners grouped under that class
                  family.
                </p>
              </div>
              <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                {classCategories.length} groups
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {classCategories.map((category) => (
                <ClassCategoryCard
                  key={category.id}
                  category={category}
                  count={category.count}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
