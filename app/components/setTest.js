"use client";

export default function SetTest() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-tight)] hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Learning Studio</p>
            <p className="text-sm font-medium text-[var(--fg)]/70">
              Build lessons, schedule tests, and push material instantly.
            </p>
          </div>
          <span className="chip bg-[var(--green)] text-[var(--fg)]">
            New
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold text-[var(--fg)]/70">
            Module Title
            <input
              type="text"
              placeholder="Hill start mastery"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </label>
          <label className="space-y-2 text-xs font-semibold text-[var(--fg)]/70">
            Difficulty
            <select className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]">
              <option>Intermediate</option>
              <option>Beginner</option>
              <option>Advanced</option>
            </select>
          </label>
          <label className="md:col-span-2 space-y-2 text-xs font-semibold text-[var(--fg)]/70">
            Brief
            <textarea
              rows="3"
              placeholder="Focus on clutch control and safe rollback prevention."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-primary hover-lift"
          >
            Publish lesson
          </button>
          <button
            type="button"
            className="btn btn-green hover-lift"
          >
            Schedule test
          </button>
          <button
            type="button"
            className="btn btn-ghost hover-lift"
          >
            Save draft
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-6 shadow-[var(--shadow-tight)] hover-lift">
        <p className="font-display text-2xl font-semibold">Quick Dispatch</p>
        <p className="text-sm font-medium text-[var(--fg)]/70">
          Push materials to groups in one tap.
        </p>

        <div className="mt-6 space-y-4">
          {[
            { label: "Road rules refresh", tag: "PDF" },
            { label: "Night driving checklist", tag: "VIDEO" },
            { label: "Mock test A", tag: "QUIZ" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 hover-lift"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs font-medium text-[var(--fg)]/60">
                  GoDomain Studio
                </p>
              </div>
              <span className="chip bg-[var(--blue)] text-white">
                {item.tag}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full btn btn-primary hover-lift"
        >
          Send to all learners
        </button>
      </div>
    </section>
  );
}
