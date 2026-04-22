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
        <main className="dashboard-main space-y-4 sm:space-y-6">
          <section className="card-elevated overflow-hidden p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="section-title">Interactive Sessions</p>
                <h1 className="section-heading text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                  Live classroom
                </h1>
                <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-[var(--muted)]">
                  Host dynamic theory drills, live demonstrations, and interactive workshop walkthroughs for your students in one immersive learning hub.
                </p>

                <div className="mt-5 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-3">
                  {[
                    { label: "Live rooms", value: "2", icon: "🎯" },
                    { label: "Students waiting", value: "44", icon: "👥" },
                    { label: "Next session", value: "6:00 PM", icon: "⏰" },
                  ].map((item) => (
                    <div key={item.label} className="stat-card p-3 sm:p-5">
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <div className="min-w-0">
                          <p className="stat-label text-[10px] sm:text-xs">{item.label}</p>
                          <p className="text-base sm:text-xl font-bold text-[var(--primary)] mt-1">{item.value}</p>
                        </div>
                        <span className="text-lg sm:text-2xl shrink-0">{item.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-elevated p-4 sm:p-6 border-2 border-[var(--primary)]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <p className="section-title">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse mr-2"></span>
                    {activeSession.status}
                  </p>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{activeSession.title}</h3>
                <p className="text-sm text-[var(--muted)] mb-3 sm:mb-4">{activeSession.cohort}</p>
                
                <div className="space-y-3 mb-4 sm:mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[var(--muted)]">Session Progress</span>
                      <span className="font-bold text-[var(--primary)] text-sm">{activeSession.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${activeSession.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full btn bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all">
                  Join Session
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="card-elevated p-4 sm:p-6">
              <h2 className="section-heading text-xl sm:text-2xl mb-3 sm:mb-4">Upcoming Sessions</h2>
              <div className="space-y-2 sm:space-y-3">
                {liveSessions.slice(1).map((session) => (
                  <div key={session.id} className="lesson-card p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-[var(--fg)] mb-0.5 sm:mb-1 truncate">{session.title}</h3>
                        <p className="text-xs sm:text-sm text-[var(--muted)]">{session.cohort}</p>
                      </div>
                      <span className={`badge text-xs shrink-0 ${session.status === "Starting soon" ? "badge-warning" : "badge"}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[var(--muted)]">
                        <span>📅 {session.startsAt}</span>
                        <span>👥 {session.attendees}</span>
                      </div>
                      <button className="icon-btn w-8 h-8 sm:w-10 sm:h-10">→</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6">
              <h2 className="section-heading text-xl sm:text-2xl mb-3 sm:mb-4">Pre-Session Checklist</h2>
              <div className="space-y-2 sm:space-y-3">
                {lessonChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer hover:bg-[var(--panel-2)] transition-colors group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 border-[var(--border)] accent-[var(--primary)] cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
