"use client";

function PencilSquareIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4.75 6.75A2.75 2.75 0 0 1 7.5 4h9A2.75 2.75 0 0 1 19.25 6.75v10.5A2.75 2.75 0 0 1 16.5 20h-9a2.75 2.75 0 0 1-2.75-2.75V6.75Z"
        strokeWidth="1.8"
      />
      <path
        d="m9 14.75 5.75-5.75 1.5 1.5L10.5 16.25 8 17l.75-2.25Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperPlaneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4 11.75 19.25 4 14.5 20 10.75 13.75 4 11.75Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.75 13.75 19.25 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function SetTest() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="dashboard-section hover-lift rounded-[34px] p-6">
        <div className="absolute -right-14 top-0 h-36 w-36 rounded-full bg-(--aura-blue) blur-3xl" />
        <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-(--aura-green) blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="icon-shell h-12 w-12 text-(--blue) shadow-(--shadow-tight)">
                <PencilSquareIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">
                  Learning Studio
                </p>
                <p className="mt-1 text-sm font-medium text-(--muted)">
                  Build lessons, schedule tests, and push material instantly.
                </p>
              </div>
            </div>
            <span className="chip bg-(--green) text-foreground">New</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">
              Module Title
              <input
                type="text"
                placeholder="Hill start mastery"
                className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">
              Difficulty
              <select className="field-shell w-full rounded-2xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)">
                <option>Intermediate</option>
                <option>Beginner</option>
                <option>Advanced</option>
              </select>
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--muted) md:col-span-2">
              Brief
              <textarea
                rows="3"
                placeholder="Focus on clutch control and safe rollback prevention."
                className="field-shell w-full rounded-3xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-(--blue)"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary">
              Publish lesson
            </button>
            <button type="button" className="btn btn-green">
              Schedule test
            </button>
            <button type="button" className="btn btn-ghost">
              Save draft
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-section hover-lift rounded-[34px] p-6">
        <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-(--aura-rose) blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="icon-shell h-12 w-12 text-(--green) shadow-(--shadow-tight)">
                <PaperPlaneIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">
                  Quick Dispatch
                </p>
                <p className="mt-1 text-sm font-medium text-(--muted)">
                  Push materials to groups in one tap.
                </p>
              </div>
            </div>
            <span className="chip bg-(--panel-2) text-foreground">
              Fast send
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { label: "Road rules refresh", tag: "PDF" },
              { label: "Night driving checklist", tag: "VIDEO" },
              { label: "Mock test A", tag: "QUIZ" },
            ].map((item) => (
              <div
                key={item.label}
                className="interactive-tile rounded-3xl border border-(--border) bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-2))] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-1 text-xs font-medium text-(--muted)">
                      GoDomain Studio
                    </p>
                  </div>
                  <span className="chip bg-(--blue) text-white">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-primary mt-6 w-full">
            Send to all learners
          </button>
        </div>
      </div>
    </section>
  );
}
