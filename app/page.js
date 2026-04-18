import LeadBod from "./components/leadBod";
import SideFoot from "./components/sideFoot";

export default function Home() {
  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Overview" />
        <main className="dashboard-main space-y-8">
          <section
            className="enter panel p-6 hover-lift"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  GoDomain driving school
                </p>
                <h1 className="font-display text-4xl font-semibold tracking-tight">
                  Teacher overview
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium text-[var(--fg)]/70">
                  Monitor student progress, lesson delivery, and communications
                  from one streamlined dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4 text-center shadow-[var(--shadow-tight)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Today
                </p>
                <p className="text-3xl font-semibold">13</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                  Lessons
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Active learners",
                  value: "84",
                  accent: "var(--panel-2)",
                },
                { label: "Tests booked", value: "12", accent: "var(--blue)" },
                { label: "New messages", value: "31", accent: "var(--green)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--border)] p-4 hover-lift"
                  style={{ backgroundColor: stat.accent }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/60">
                    {stat.label}
                  </p>
                  <p
                    className={`mt-2 text-3xl font-semibold ${
                      stat.accent === "var(--blue)" ? "text-white" : ""
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="enter grid gap-6 lg:grid-cols-[1fr_1fr]"
            style={{ animationDelay: "260ms" }}
          >
            <div id="materials" className="panel p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Materials overview
                  </p>
                  <h2 className="font-display text-3xl font-semibold">
                    Learning kit
                  </h2>
                </div>
                <span className="chip bg-[var(--blue)] text-white">
                  42 items
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Road rules handbook 2026",
                  "Mock theory exam pack",
                  "Night driving safety guide",
                  "Defensive driving slides",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium hover-lift"
                  >
                    <span>{item}</span>
                    <span className="chip bg-[var(--panel)] text-[var(--fg)]">
                      Queued
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="messages"
              className="rounded-3xl border border-[var(--border)] bg-[var(--blue-2)] p-6 text-white shadow-[var(--shadow-tight)] hover-lift"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    Direct contact
                  </p>
                  <h2 className="font-display text-3xl font-semibold">
                    Message lane
                  </h2>
                </div>
                <span className="chip border-white text-white">6 live</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Amina Otieno",
                  "Kevin Kariuki",
                  "Lynn Mwikali",
                  "Brian Kiptoo",
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl border border-white/50 px-4 py-3 hover-lift"
                  >
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                        New check-in
                      </p>
                    </div>
                    <span className="chip border-white text-white">Reply</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="enter" style={{ animationDelay: "420ms" }}>
            <LeadBod />
          </section>
        </main>
      </div>
    </div>
  );
}
