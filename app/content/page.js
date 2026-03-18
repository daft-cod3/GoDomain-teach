import SideFoot from "../components/sideFoot";
import SetTest from "../components/setTest";

const materials = [
  { title: "Road rules handbook 2026", type: "PDF" },
  { title: "Mock theory exam pack", type: "QUIZ" },
  { title: "Night driving safety guide", type: "PDF" },
  { title: "Defensive driving slides", type: "SLIDES" },
];

export default function ContentPage() {
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
                42 items
              </span>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Media upload
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Video and image
                  </h2>
                </div>
                <span className="chip bg-[var(--green)] text-[var(--fg)]">
                  Ready
                </span>
              </div>
              <div className="mt-5 grid gap-4">
                <label className="panel-soft flex flex-col gap-2 p-4 text-sm font-medium text-[var(--fg)]/70">
                  Upload lesson video
                  <input
                    type="file"
                    accept="video/*"
                    className="text-sm text-[var(--fg)]"
                  />
                </label>
                <label className="panel-soft flex flex-col gap-2 p-4 text-sm font-medium text-[var(--fg)]/70">
                  Upload cover image
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[var(--fg)]"
                  />
                </label>
              </div>
            </div>

            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Links library
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    Add learning links
                  </h2>
                </div>
                <span className="chip bg-[var(--blue)] text-white">
                  8 links
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
                <button type="button" className="btn btn-primary">
                  Add link
                </button>
                <div className="mt-4 space-y-2">
                  {[
                    "https://gov.go.ke/road-safety",
                    "https://learner.godomain.africa/mock-test",
                    "https://youtube.com/defensive-driving-basics",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium"
                    >
                      <span className="truncate">{item}</span>
                      <span className="chip bg-white">Saved</span>
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
                <div
                  key={index}
                  className="panel-soft flex flex-col gap-4 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--fg)]/70">
                      Question {index}
                    </p>
                    <label className="flex items-center gap-2 text-xs font-semibold text-[var(--fg)]/60">
                      Correct option position
                      <select className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]">
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
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
        </main>
      </div>
    </div>
  );
}
