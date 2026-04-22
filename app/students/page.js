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
        <main className="dashboard-main space-y-4 sm:space-y-6">
          <section className="card-elevated rounded-[24px] p-4 sm:p-6">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:mb-6">
              <div>
                <p className="section-title">Classroom Management</p>
                <h1 className="section-heading text-2xl sm:text-3xl">
                  Student Communication
                </h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base font-medium text-[var(--muted)]">
                  Manage your entire student roster, send broadcasts, and keep all classroom communication centralized in one place.
                </p>
              </div>
              <span className="badge badge-success gap-2 self-start sm:self-auto shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-white"></span>
                {activeStudentsCount} / {students.length} active
              </span>
            </div>

            <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="card-elevated p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
                  <p className="section-title">Recipient Filters</p>
                  <span className="text-sm font-semibold text-[var(--primary)]">
                    {filteredStudents.length} matches
                  </span>
                </div>

                <fieldset className="mt-3 sm:mt-4 grid gap-2 mb-4 sm:mb-6">
                  {recipientScopes.map((option) => (
                    <label
                      key={option.id}
                      className={`rounded-[16px] border px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium transition-all cursor-pointer ${
                        scope === option.id
                          ? "border-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--shadow)]"
                          : "border-[var(--border)] bg-[var(--panel)] text-[var(--fg)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="recipient-scope"
                          value={option.id}
                          checked={scope === option.id}
                          onChange={(event) => setScope(event.target.value)}
                          className="h-4 w-4 accent-[var(--primary)] cursor-pointer shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-sm">{option.label}</p>
                          <p className={`text-xs leading-4 ${
                            scope === option.id ? "text-white/80" : "text-[var(--fg)]/60"
                          }`}>
                            {option.detail}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </fieldset>

                <div className="mt-3 sm:mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
                  <label className="rounded-[14px] border border-[var(--border)] bg-[var(--panel-2)] p-3 sm:p-4 text-sm font-medium">
                    <span className="section-title mb-1 sm:mb-2">Search learners</span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, ID, class..."
                      className="mt-2 w-full rounded-[12px] border border-[var(--border)] bg-[var(--panel)] px-3 py-2 sm:py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </label>

                  <label className="rounded-[14px] border border-[var(--border)] bg-[var(--panel-2)] p-3 sm:p-4 text-sm font-medium">
                    <span className="section-title mb-1 sm:mb-2">Add learner</span>
                    <select
                      className="mt-2 w-full rounded-[12px] border border-[var(--border)] bg-[var(--panel)] px-3 py-2 sm:py-2.5 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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

                <div className="mt-3 sm:mt-4 card-elevated p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2 sm:mb-3">
                    <p className="section-title">Selected Recipients</p>
                    <span className="text-sm font-semibold text-[var(--primary)]">
                      {selectedIds.length} chosen
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIds.length > 0
                      ? selectedIds.map((studentId) => {
                          const learner = students.find((student) => student.id === studentId);
                          if (!learner) return null;
                          return (
                            <button
                              key={studentId}
                              type="button"
                              onClick={() => removeSelectedStudent(studentId)}
                              className="badge badge-success gap-2 text-white hover:scale-105 transition-transform"
                            >
                              {learner.name}
                              <span>×</span>
                            </button>
                          );
                        })
                      : <p className="text-sm font-medium text-[var(--muted)]">
                          Use search and dropdown to add recipients.
                        </p>}
                  </div>
                </div>
              </div>

              <div className="card-elevated p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
                  <div>
                    <p className="section-title">Teacher Broadcast</p>
                    <h2 className="section-heading text-lg sm:text-xl mt-1">Compose Message</h2>
                  </div>
                  <span className="badge">{composeState}</span>
                </div>

                <div className="mt-3 sm:mt-4 grid gap-2 grid-cols-3 mb-3 sm:mb-4">
                  {[
                    { label: "Recipients", value: recipientStudents.length, icon: "👥" },
                    { label: "Active", value: activeStudentsCount, icon: "✅" },
                    { label: "Matches", value: filteredStudents.length, icon: "🔍" },
                  ].map((item) => (
                    <div key={item.label} className="stat-card p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="stat-label text-[10px] sm:text-xs">{item.label}</p>
                          <p className="text-lg sm:text-xl font-bold text-[var(--primary)] mt-1">{item.value}</p>
                        </div>
                        <span className="text-lg sm:text-2xl">{item.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(event) => setBroadcastMessage(event.target.value)}
                  placeholder="Write a message to your learners..."
                  className="w-full resize-none rounded-[14px] border border-[var(--border)] bg-[var(--panel)] px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                  <button type="button" onClick={handleSend} className="btn btn-primary gap-2">
                    <span>📤</span>
                    Send to learners
                  </button>
                  <button type="button" onClick={handleSaveDraft} className="btn btn-ghost gap-2">
                    <span>💾</span>
                    Save draft
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="section-title">Class Organization</p>
                <h2 className="section-heading text-xl sm:text-2xl">Learner Groups (A-D)</h2>
                <p className="mt-1 sm:mt-2 max-w-3xl text-sm sm:text-base font-medium text-[var(--muted)]">
                  Browse students organized by their class category and tier.
                </p>
              </div>
              <span className="badge gap-2 self-start sm:self-auto shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-white"></span>
                {classCategories.length} groups
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
