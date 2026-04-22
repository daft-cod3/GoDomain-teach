"use client";

import { useEffect, useEffectEvent, useState } from "react";
import {
  LEARNING_PATH_KEY,
  readStudioCollection,
  writeStudioCollection,
} from "../../lib/contentStudioStore";

const inputClass =
  "field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/45 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]";

const textareaClass =
  "field-shell min-h-[148px] w-full rounded-[24px] px-4 py-4 text-sm font-medium text-[var(--fg)] placeholder:text-[var(--fg)]/45 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]";

const toolButtonClass =
  "rounded-full border border-[var(--border)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/72 hover:-translate-y-1 hover:shadow-[var(--shadow-tight)]";

const unitTones = [
  {
    solid: "#34a853",
    soft: "rgba(52, 168, 83, 0.14)",
    line: "rgba(52, 168, 83, 0.32)",
    glow: "rgba(52, 168, 83, 0.24)",
  },
  {
    solid: "#2563eb",
    soft: "rgba(37, 99, 235, 0.14)",
    line: "rgba(37, 99, 235, 0.32)",
    glow: "rgba(37, 99, 235, 0.24)",
  },
  {
    solid: "#d97706",
    soft: "rgba(217, 119, 6, 0.14)",
    line: "rgba(217, 119, 6, 0.32)",
    glow: "rgba(217, 119, 6, 0.24)",
  },
  {
    solid: "#db2777",
    soft: "rgba(219, 39, 119, 0.14)",
    line: "rgba(219, 39, 119, 0.32)",
    glow: "rgba(219, 39, 119, 0.24)",
  },
];

const unitSeeds = [
  {
    title: "Unit 1 - Foundations",
    window: "Weeks 1-2",
    advancement: "Teacher release",
    overview:
      "Set routines, vocabulary, and the first release rules for the learning path.",
    lessons: [
      "Orientation and goals",
      "Road rules and road users",
      "Signs and markings",
      "Vehicle controls",
      "Mirror and observation routine",
    ],
  },
  {
    title: "Unit 2 - Controlled Practice",
    window: "Weeks 3-4",
    advancement: "Complete previous lesson",
    overview:
      "Coach learners through repeatable drills before opening higher-pressure scenarios.",
    lessons: [
      "Moving off and stopping",
      "Junction approach",
      "Parking lines and spacing",
      "Hill starts",
      "Traffic-light timing",
    ],
  },
  {
    title: "Unit 3 - Applied Driving",
    window: "Weeks 5-6",
    advancement: "Assessment pass",
    overview:
      "Use teacher gates to control progression through realistic and complex road situations.",
    lessons: [
      "Roundabout decisions",
      "Lane changes",
      "Overtaking judgment",
      "Night driving",
      "Rain and hazard response",
    ],
  },
  {
    title: "Unit 4 - Mastery",
    window: "Weeks 7-8",
    advancement: "Teacher release",
    overview:
      "Run final mock sessions, correction loops, and the closeout path to mastery.",
    lessons: [
      "Mock route briefing",
      "Independent planning",
      "Error correction lab",
      "Final mock test",
      "Reflection and next steps",
    ],
  },
];

const accessOptions = ["Open to students", "Preview only", "Hidden"];
const periodOptions = ["45 min", "60 min", "75 min", "90 min"];
const advancementOptions = [
  "Teacher release",
  "Complete previous lesson",
  "Assessment pass",
];
const pathOffsets = [-10, 68, 16, 76, 2];

function makeBlock(label = "New block", text) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    label,
    text:
      text ??
      "Add teacher instructions, student prompts, links, or a checkpoint for progression.",
  };
}

function seedUnits() {
  return unitSeeds.map((unit, unitIndex) => ({
    id: `unit-${unitIndex + 1}`,
    title: unit.title,
    window: unit.window,
    advancement: unit.advancement,
    overview: unit.overview,
    tone: unitTones[unitIndex],
    lessons: unit.lessons.map((title, lessonIndex) => ({
      id: `unit-${unitIndex + 1}-lesson-${lessonIndex + 1}`,
      sessionLabel: `Class ${lessonIndex + 1}`,
      title,
      access: accessOptions[(lessonIndex + unitIndex) % accessOptions.length],
      period: periodOptions[lessonIndex % periodOptions.length],
      advancement:
        advancementOptions[
          (lessonIndex + unitIndex) % advancementOptions.length
        ],
      focus: `Teach ${title.toLowerCase()} with a clear demonstration, guided practice, and a release checkpoint before students advance.`,
      blocks: [
        makeBlock(
          "Starter",
          `Open with a short recap or question tied to ${title.toLowerCase()}.`,
        ),
        makeBlock(
          "Teach",
          `Explain the core idea, model the routine, and highlight what students must notice.`,
        ),
        makeBlock(
          "Practice",
          "Add the practical task, timing, and evidence needed before the next lesson unlocks.",
        ),
      ],
    })),
  }));
}

function readUnitCount(units, access) {
  return units.reduce(
    (sum, unit) =>
      sum + unit.lessons.filter((lesson) => lesson.access === access).length,
    0,
  );
}

export default function StudentLearningPathSection() {
  const [units, setUnits] = useState(() => seedUnits());
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [editorStatus, setEditorStatus] = useState("Editing Unit 1 / Class 1");

  const currentUnit = units[selectedUnitIndex];
  const currentLesson = currentUnit.lessons[selectedLessonIndex];
  const currentOpenLessons = currentUnit.lessons.filter(
    (lesson) => lesson.access === "Open to students",
  ).length;
  const safeBlockIndex = Math.min(
    selectedBlockIndex,
    Math.max(currentLesson.blocks.length - 1, 0),
  );
  const currentBlock = currentLesson.blocks[safeBlockIndex];

  function describeSelection(unitIndex, lessonIndex) {
    const unit = units[unitIndex];
    const lesson = unit.lessons[lessonIndex];
    return `Editing ${unit.title} / ${lesson.sessionLabel}`;
  }

  function selectLesson(unitIndex, lessonIndex) {
    setSelectedUnitIndex(unitIndex);
    setSelectedLessonIndex(lessonIndex);
    setSelectedBlockIndex(0);
    setEditorStatus(describeSelection(unitIndex, lessonIndex));
  }

  function selectUnit(unitIndex) {
    setSelectedUnitIndex(unitIndex);
    setSelectedLessonIndex(0);
    setSelectedBlockIndex(0);
    setEditorStatus(describeSelection(unitIndex, 0));
  }

  function updateUnit(field, value) {
    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex ? { ...unit, [field]: value } : unit,
      ),
    );
  }

  function updateLesson(field, value) {
    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, lessonIndex) =>
                lessonIndex === selectedLessonIndex
                  ? { ...lesson, [field]: value }
                  : lesson,
              ),
            }
          : unit,
      ),
    );
  }

  function updateBlock(field, value) {
    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, lessonIndex) =>
                lessonIndex === selectedLessonIndex
                  ? {
                      ...lesson,
                      blocks: lesson.blocks.map((block, blockIndex) =>
                        blockIndex === safeBlockIndex
                          ? { ...block, [field]: value }
                          : block,
                      ),
                    }
                  : lesson,
              ),
            }
          : unit,
      ),
    );
  }

  function stepLesson(direction) {
    let nextUnitIndex = selectedUnitIndex;
    let nextLessonIndex = selectedLessonIndex + direction;

    if (nextLessonIndex < 0) {
      nextUnitIndex =
        selectedUnitIndex === 0 ? units.length - 1 : selectedUnitIndex - 1;
      nextLessonIndex = units[nextUnitIndex].lessons.length - 1;
    } else if (nextLessonIndex >= units[selectedUnitIndex].lessons.length) {
      nextUnitIndex =
        selectedUnitIndex === units.length - 1 ? 0 : selectedUnitIndex + 1;
      nextLessonIndex = 0;
    }

    selectLesson(nextUnitIndex, nextLessonIndex);
  }

  function insertBlock() {
    const nextIndex = safeBlockIndex + 1;

    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, lessonIndex) => {
                if (lessonIndex !== selectedLessonIndex) {
                  return lesson;
                }

                const blocks = [...lesson.blocks];
                blocks.splice(
                  nextIndex,
                  0,
                  makeBlock(
                    `Insert ${nextIndex + 1}`,
                    "Use this block for remediation, an extra example, or a bridge into the next class.",
                  ),
                );

                return { ...lesson, blocks };
              }),
            }
          : unit,
      ),
    );

    setSelectedBlockIndex(nextIndex);
    setEditorStatus(
      `Inserted block ${nextIndex + 1} for ${currentLesson.sessionLabel}`,
    );
  }

  function deleteBlock() {
    if (currentLesson.blocks.length === 1) {
      setUnits((current) =>
        current.map((unit, unitIndex) =>
          unitIndex === selectedUnitIndex
            ? {
                ...unit,
                lessons: unit.lessons.map((lesson, lessonIndex) =>
                  lessonIndex === selectedLessonIndex
                    ? { ...lesson, blocks: [makeBlock("Starter")] }
                    : lesson,
                ),
              }
            : unit,
        ),
      );
      setSelectedBlockIndex(0);
      setEditorStatus(
        `Reset ${currentLesson.sessionLabel} to a single starter block`,
      );
      return;
    }

    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, lessonIndex) =>
                lessonIndex === selectedLessonIndex
                  ? {
                      ...lesson,
                      blocks: lesson.blocks.filter(
                        (_, blockIndex) => blockIndex !== safeBlockIndex,
                      ),
                    }
                  : lesson,
              ),
            }
          : unit,
      ),
    );

    setSelectedBlockIndex(Math.max(0, safeBlockIndex - 1));
    setEditorStatus(`Deleted a block from ${currentLesson.sessionLabel}`);
  }

  function moveBlock(direction) {
    const nextIndex = safeBlockIndex + direction;

    if (nextIndex < 0 || nextIndex >= currentLesson.blocks.length) {
      return;
    }

    setUnits((current) =>
      current.map((unit, unitIndex) =>
        unitIndex === selectedUnitIndex
          ? {
              ...unit,
              lessons: unit.lessons.map((lesson, lessonIndex) => {
                if (lessonIndex !== selectedLessonIndex) {
                  return lesson;
                }

                const blocks = [...lesson.blocks];
                const [block] = blocks.splice(safeBlockIndex, 1);
                blocks.splice(nextIndex, 0, block);

                return { ...lesson, blocks };
              }),
            }
          : unit,
      ),
    );

    setSelectedBlockIndex(nextIndex);
    setEditorStatus(
      `Moved block ${direction < 0 ? "up" : "down"} in ${currentLesson.sessionLabel}`,
    );
  }

  const handleShortcuts = useEffectEvent((event) => {
    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

    if (isEditable) {
      return;
    }

    if (event.altKey && !event.shiftKey && event.key === "ArrowRight") {
      event.preventDefault();
      stepLesson(1);
      return;
    }

    if (event.altKey && !event.shiftKey && event.key === "ArrowLeft") {
      event.preventDefault();
      stepLesson(-1);
      return;
    }

    if (event.altKey && event.shiftKey && event.key === "ArrowUp") {
      event.preventDefault();
      moveBlock(-1);
      return;
    }

    if (event.altKey && event.shiftKey && event.key === "ArrowDown") {
      event.preventDefault();
      moveBlock(1);
      return;
    }

    if (event.ctrlKey && event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      insertBlock();
      return;
    }

    if (event.ctrlKey && event.key === "Backspace") {
      event.preventDefault();
      deleteBlock();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [handleShortcuts]);

  useEffect(() => {
    const storedUnits = readStudioCollection(LEARNING_PATH_KEY, []);
    if (storedUnits.length > 0) {
      setUnits(storedUnits);
    }
  }, []);

  useEffect(() => {
    writeStudioCollection(LEARNING_PATH_KEY, units);
  }, [units]);

  const totalLessons = units.reduce(
    (sum, unit) => sum + unit.lessons.length,
    0,
  );
  const openLessons = readUnitCount(units, "Open to students");
  const hiddenLessons = readUnitCount(units, "Hidden");

  return (
    <section className="dashboard-section relative rounded-[34px] px-6 py-6 shadow-(--shadow) sm:px-8">
      <div className="float-soft absolute left-8 top-8 h-28 w-28 rounded-full bg-(--aura-green) blur-3xl" />
      <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-(--aura-blue) blur-3xl" />
      <div className="absolute bottom-0 right-16 h-36 w-36 rounded-full bg-(--aura-rose) blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-(--fg)/58">
              Student learning path
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              A polished GoDomain lesson path built for teacher control.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-(--fg)/72 sm:text-[15px]">
              The path map uses tabbed units and circular lesson nodes so
              teachers can switch units quickly, then manage access, pacing,
              advancement, and lesson content from one linked editor.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--fg)/58">
                Units
              </p>
              <p className="mt-2 text-2xl font-semibold">{units.length}</p>
            </div>
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--fg)/58">
                Lessons
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalLessons}</p>
            </div>
            <div className="glass-soft rounded-3xl px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--fg)/58">
                Hidden
              </p>
              <p className="mt-2 text-2xl font-semibold">{hiddenLessons}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="glass path-grid rounded-[30px] p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/58">
                  Path map
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">
                  GoDomain learning flow
                </h3>
              </div>
              <span className="chip bg-(--panel-strong) text-foreground">
                {openLessons} open
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {units.map((unit, unitIndex) => {
                const isActive = unitIndex === selectedUnitIndex;

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => selectUnit(unitIndex)}
                    className={`rounded-full border px-4 py-3 text-left text-sm font-semibold shadow-(--shadow-tight) ${
                      isActive
                        ? "scale-[1.03] text-white ring-2 ring-white/45"
                        : "bg-(--panel-strong) text-foreground hover:-translate-y-1"
                    }`}
                    style={{
                      borderColor: isActive ? unit.tone.solid : "var(--border)",
                      background: isActive
                        ? `linear-gradient(135deg, ${unit.tone.solid}, rgba(15, 23, 42, 0.8))`
                        : "linear-gradient(180deg, var(--panel-strong), var(--panel-2))",
                    }}
                  >
                    <span className="block text-[10px] uppercase tracking-[0.2em] opacity-75">
                      Unit {unitIndex + 1}
                    </span>
                    <span className="mt-1 block">{unit.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-4 shadow-(--shadow-tight)">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/56">
                  Currently editing
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {currentUnit.title}
                </p>
                <p className="mt-1 text-sm font-medium text-(--fg)/65">
                  {currentLesson.sessionLabel} | {currentLesson.title}
                </p>
              </div>
              <div className="rounded-3xl border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-4 shadow-(--shadow-tight)">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/56">
                  Editor status
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {editorStatus}
                </p>
              </div>
            </div>

            <section
              className="enter mt-6 overflow-hidden rounded-[28px] border p-4 sm:p-5"
              style={{
                background: `linear-gradient(135deg, ${currentUnit.tone.soft}, var(--panel-deep))`,
                borderColor: currentUnit.tone.line,
                boxShadow: `0 28px 60px -40px ${currentUnit.tone.glow}`,
              }}
            >
              <div
                className="rounded-3xl px-4 py-4 text-white"
                style={{
                  background: `linear-gradient(135deg, ${currentUnit.tone.solid}, rgba(15, 23, 42, 0.82))`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                      GoDomain unit {selectedUnitIndex + 1}
                    </p>
                    <h4 className="mt-2 text-xl font-semibold">
                      {currentUnit.title}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip border-white/25 bg-white/14 text-white">
                      {currentUnit.window}
                    </span>
                    <span className="chip border-white/25 bg-white/14 text-white">
                      {currentOpenLessons}/5 open
                    </span>
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/78">
                  {currentUnit.overview}
                </p>
              </div>

              <div className="relative mx-auto mt-6 max-w-82.5 pb-2">
                <div
                  className="absolute bottom-7 left-1/2 top-6 w-0.75 -translate-x-1/2 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${currentUnit.tone.line}, var(--panel-deep))`,
                  }}
                />

                {currentUnit.lessons.map((lesson, lessonIndex) => {
                  const selected = lessonIndex === selectedLessonIndex;
                  const offset = pathOffsets[lessonIndex];
                  const isOpen = lesson.access === "Open to students";
                  const isHidden = lesson.access === "Hidden";

                  return (
                    <div
                      key={lesson.id}
                      className="relative mb-6 flex flex-col items-center last:mb-0"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          selectLesson(selectedUnitIndex, lessonIndex)
                        }
                        className={`lesson-orb relative flex h-18 w-18 items-center justify-center rounded-full border text-xl font-semibold sm:h-20 sm:w-20 ${
                          selected
                            ? "scale-110 text-white ring-8 ring-white/45"
                            : ""
                        } ${isHidden ? "opacity-60" : ""}`}
                        style={{
                          background: selected
                            ? `linear-gradient(135deg, ${currentUnit.tone.solid}, rgba(15, 23, 42, 0.82))`
                            : isOpen
                              ? "linear-gradient(180deg, var(--panel-strong), var(--panel-2))"
                              : "linear-gradient(180deg, var(--panel-2), var(--panel-3))",
                          borderColor: selected
                            ? currentUnit.tone.solid
                            : currentUnit.tone.line,
                          boxShadow: selected
                            ? `0 24px 40px -26px ${currentUnit.tone.glow}`
                            : `0 14px 28px -22px ${currentUnit.tone.glow}`,
                          color: selected ? "#ffffff" : "var(--fg)",
                        }}
                      >
                        {lessonIndex + 1}
                      </button>

                      <div
                        className={`mt-3 rounded-[22px] border px-4 py-3 text-center shadow-(--shadow-tight) ${
                          selected
                            ? "bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))]"
                            : "bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] backdrop-blur-md"
                        }`}
                        style={{
                          borderColor: selected
                            ? currentUnit.tone.line
                            : "var(--border)",
                        }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--fg)/54">
                          {lesson.sessionLabel}
                        </p>
                        <p className="mt-1 max-w-45 text-sm font-semibold leading-5">
                          {lesson.title}
                        </p>
                        <span
                          className="mt-2 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                          style={{
                            borderColor: currentUnit.tone.line,
                            backgroundColor: selected
                              ? currentUnit.tone.soft
                              : "var(--panel-strong)",
                          }}
                        >
                          {lesson.access}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="glass rounded-[30px] p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--fg)/58">
                  Active editor
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">
                  {currentLesson.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip bg-(--panel-strong) text-foreground">
                  {editorStatus}
                </span>
                <span
                  className="chip text-white"
                  style={{ backgroundColor: currentUnit.tone.solid }}
                >
                  {currentLesson.sessionLabel}
                </span>
                <span className="chip bg-(--panel-strong) text-foreground">
                  {currentLesson.period}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-[26px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] p-4 backdrop-blur-xl">
                <p className="text-sm font-semibold">Unit settings</p>
                <div className="mt-4 grid gap-3">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Unit title
                    <input
                      type="text"
                      value={currentUnit.title}
                      onChange={(event) =>
                        updateUnit("title", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)/58">
                      Unit period
                      <select
                        value={currentUnit.window}
                        onChange={(event) =>
                          updateUnit("window", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option>Weeks 1-2</option>
                        <option>Weeks 3-4</option>
                        <option>Weeks 5-6</option>
                        <option>Weeks 7-8</option>
                      </select>
                    </label>

                    <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                      Unit advancement
                      <select
                        value={currentUnit.advancement}
                        onChange={(event) =>
                          updateUnit("advancement", event.target.value)
                        }
                        className={inputClass}
                      >
                        {advancementOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Unit brief
                    <textarea
                      rows="3"
                      value={currentUnit.overview}
                      onChange={(event) =>
                        updateUnit("overview", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[26px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Lesson controls</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => stepLesson(-1)}
                      className={toolButtonClass}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLesson(1)}
                      className={toolButtonClass}
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Lesson title
                    <input
                      type="text"
                      value={currentLesson.title}
                      onChange={(event) =>
                        updateLesson("title", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                      Access
                      <select
                        value={currentLesson.access}
                        onChange={(event) =>
                          updateLesson("access", event.target.value)
                        }
                        className={inputClass}
                      >
                        {accessOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                      Period
                      <select
                        value={currentLesson.period}
                        onChange={(event) =>
                          updateLesson("period", event.target.value)
                        }
                        className={inputClass}
                      >
                        {periodOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                      Advancement
                      <select
                        value={currentLesson.advancement}
                        onChange={(event) =>
                          updateLesson("advancement", event.target.value)
                        }
                        className={inputClass}
                      >
                        {advancementOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Lesson brief
                    <textarea
                      rows="3"
                      value={currentLesson.focus}
                      onChange={(event) =>
                        updateLesson("focus", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[26px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] p-4 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Content builder</p>
                    <p className="mt-1 text-xs font-medium text-(--fg)/56">
                      Insert, move, delete, and write content for each lesson.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={insertBlock}
                      className={toolButtonClass}
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(-1)}
                      className={toolButtonClass}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(1)}
                      className={toolButtonClass}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={deleteBlock}
                      className={`${toolButtonClass} border-[rgba(225,29,72,0.18)] text-(--rose)`}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {currentLesson.blocks.map((block, blockIndex) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedBlockIndex(blockIndex)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                        blockIndex === safeBlockIndex
                          ? "border-transparent text-white shadow-(--shadow-tight)"
                          : "border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] text-(--fg)/68"
                      }`}
                      style={
                        blockIndex === safeBlockIndex
                          ? { backgroundColor: currentUnit.tone.solid }
                          : undefined
                      }
                    >
                      {block.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Block label
                    <input
                      type="text"
                      value={currentBlock.label}
                      onChange={(event) =>
                        updateBlock("label", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--fg)/58">
                    Lesson content
                    <textarea
                      value={currentBlock.text}
                      onChange={(event) =>
                        updateBlock("text", event.target.value)
                      }
                      className={textareaClass}
                      placeholder="Type the content, instructions, prompts, or resource notes for this block."
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      keys: ["Alt", "Left/Right"],
                      label: "Move between lessons",
                    },
                    {
                      keys: ["Alt", "Shift", "Up/Down"],
                      label: "Move a block",
                    },
                    { keys: ["Ctrl", "Shift", "Enter"], label: "Insert block" },
                    { keys: ["Ctrl", "Backspace"], label: "Delete block" },
                  ].map((shortcut) => (
                    <div
                      key={shortcut.label}
                      className="rounded-[22px] border border-(--border) bg-[linear-gradient(180deg,var(--panel),var(--panel-deep))] px-4 py-3"
                    >
                      <div className="flex flex-wrap gap-2">
                        {shortcut.keys.map((key) => (
                          <kbd key={key} className="kbd-key">
                            {key}
                          </kbd>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-medium text-(--fg)/64">
                        {shortcut.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
