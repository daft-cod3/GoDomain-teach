import SideFoot from "../components/sideFoot";

const liveSessions = [
  {
    id: "room-01",
    title: "Highway Code Live Drill",
    cohort: "Class B evening",
    startsAt: "Today · 4:30 PM",
    attendees: 28,
    status: "Live now",
    progress: 68,
    host: "jane_wambui",
  },
  {
    id: "room-02",
    title: "Truck Yard Maneuvers",
    cohort: "Class D truck",
    startsAt: "Today · 6:00 PM",
    attendees: 16,
    status: "Starting soon",
    progress: 42,
    host: "mike_odhiambo",
  },
  {
    id: "room-03",
    title: "Workshop Safety Basics",
    cohort: "Automotive engineering",
    startsAt: "Tomorrow · 10:00 AM",
    attendees: 24,
    status: "Scheduled",
    progress: 0,
    host: "faith_kimani",
  },
];

const lessonChecklist = [
  "Camera and microphone check",
  "Slides and simulator prompts ready",
  "Attendance auto-log enabled",
  "Student question queue open",
];

export default function LiveLessonsPage() {
  const activeSession = liveSessions[0];

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Live Lessons" />
        <main className="dashboard-main space-y-6">
          <section className="glass overflow-hidden rounded-[28px] p-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Live lessons
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold">
                  Student live classroom
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[var(--fg)]/72">
                  Host theory drills, live demonstrations, and workshop
                  walkthroughs for students in one dedicated lesson hub.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Live rooms", value: "2", tone: "var(--blue)" },
                    {
                      label: "Students waiting",
                      value: "44",
                      tone: "var(--green)",
                    },
                    {
                      label: "Next session",
                      value: "6:00 PM",
                      tone: "var(--amber)",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-[var(--border)] p-4 text-slate-950"
                      style={{ backgroundColor: item.tone }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-950/70">
                        {item.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="btn btn-primary">
                    Start live lesson
                  </button>
                  <button type="button" className="btn btn-ghost">
                    Share student invite
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.92),rgba(15,118,110,0.92))] p-5 text-white shadow-[var(--shadow-tight)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Live room focus
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                      {activeSession.title}
                    </h2>
                  </div>
                  <span className="chip border-white text-white">
                    {activeSession.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Cohort
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {activeSession.cohort}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Host
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {activeSession.host}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-white/20 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    <span>Session completion</span>
                    <span>{activeSession.progress}%</span>
                  </div>
                  <div className="mt-3 h-3 rounded-full border border-white/20 bg-white/20">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${activeSession.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                    Lesson rooms
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">
                    Live and upcoming sessions
                  </h2>
                </div>
                <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
                  {liveSessions.length} rooms
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {liveSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--panel-2)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{session.title}</p>
                        <p className="mt-1 text-sm font-medium text-[var(--fg)]/65">
                          {session.cohort} · {session.startsAt}
                        </p>
                      </div>
                      <span
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor:
                            session.status === "Live now"
                              ? "rgba(34, 197, 94, 0.16)"
                              : session.status === "Starting soon"
                                ? "rgba(245, 158, 11, 0.18)"
                                : "rgba(37, 99, 235, 0.12)",
                        }}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                          Attendees
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {session.attendees}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                          Host
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {session.host}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                          Session code
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {session.id.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button type="button" className="btn btn-primary">
                        Join room
                      </button>
                      <button type="button" className="btn btn-ghost">
                        Copy invite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-tight)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                      Session checklist
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                      Before students join
                    </h2>
                  </div>
                  <span className="chip bg-[var(--green)] text-[var(--fg)]">
                    Ready
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {lessonChecklist.map((item, index) => (
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
              </section>

              <section className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(37,99,235,0.06))] p-6 shadow-[var(--shadow-tight)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Student access
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Quick join details
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Primary room", value: "ROOM-01" },
                    { label: "Backup stream", value: "ROOM-02" },
                    { label: "Attendance mode", value: "Auto check-in" },
                    { label: "Shared resources", value: "Slides + simulator" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
