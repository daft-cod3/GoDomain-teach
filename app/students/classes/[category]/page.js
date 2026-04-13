import Link from "next/link";
import { notFound } from "next/navigation";
import SideFoot from "../../../components/sideFoot";
import StudentCard from "../../../components/studentCard";
import {
  classCategoryCatalog,
  getClassCategoryConfig,
  getStudentsByClassCategory,
} from "../../../data/students";

export default async function StudentClassCategoryPage({ params }) {
  const { category } = await params;
  const normalizedCategory = category.toUpperCase();
  const categoryConfig = getClassCategoryConfig(normalizedCategory);

  if (!categoryConfig) {
    notFound();
  }

  const learners = getStudentsByClassCategory(normalizedCategory);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Students" />
        <main className="space-y-6">
          <section className="glass overflow-hidden rounded-[32px] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            <div
              className="rounded-[28px] p-5 text-[var(--fg)]"
              style={{
                background: `linear-gradient(135deg, ${categoryConfig.accent}, rgba(255,255,255,0.72))`,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg)]/55">
                    Class category
                  </p>
                  <h1 className="mt-2 font-display text-4xl font-semibold">
                    {categoryConfig.title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[var(--fg)]/68">
                    {categoryConfig.description} This page groups the learner
                    cards for the selected class category while keeping the same
                    responsive student-card layout.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                    {learners.length} learners
                  </span>
                  <Link href="/students" className="btn btn-ghost">
                    Back to students
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {categoryConfig.levels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full border border-[var(--border)] bg-[var(--panel)]/82 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Learner cards
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  {categoryConfig.id} class roster
                </h2>
              </div>
              <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                {learners.length} displayed
              </span>
            </div>

            {learners.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {learners.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-[var(--border)] bg-[var(--panel)]/70 px-6 py-14 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/52">
                  No learners in this category yet
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-[var(--fg)]/65">
                  {categoryConfig.title} is ready for learners. Use the category
                  cards to move across the full A, B, C, and D roster map.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {classCategoryCatalog.map((categoryItem) => (
                    <Link
                      key={categoryItem.id}
                      href={`/students/classes/${categoryItem.id}`}
                      className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                    >
                      {categoryItem.id}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
