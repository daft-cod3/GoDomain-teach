import LeadBod from "./components/leadBod";
import SideFoot from "./components/sideFoot";

export default function Home() {
  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Overview" />
        <main className="dashboard-main space-y-4 sm:space-y-6 lg:space-y-8">
          <section
            className="card-elevated enter p-4 sm:p-6 lg:p-8"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-6 sm:mb-6">
              <div className="flex-1 min-w-0">
                <p className="section-title">Teaching Dashboard</p>
                <h1 className="section-heading text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">
                  Welcome back!
                </h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base font-medium text-[var(--muted)] leading-relaxed">
                  Monitor student progress, deliver engaging lessons, and manage all classroom communications from one powerful hub.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-4 sm:p-6 text-center shadow-[var(--shadow-tight)] self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Today's Schedule
                </p>
                <p className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-bold text-white">13</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Active Lessons
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  label: "Active learners",
                  value: "84",
                  gradient: "from-[var(--success)] to-[var(--green)]",
                  icon: "👥",
                },
                { label: "Tests booked", value: "12", gradient: "from-[var(--info)] to-[var(--blue)]", icon: "📝" },
                { label: "New messages", value: "31", gradient: "from-[var(--warning)] to-[var(--amber)]", icon: "💬" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group interactive-tile rounded-2xl border border-[var(--border)] p-4 sm:p-5"
                  style={{
                    background: `linear-gradient(135deg, rgba(91,74,255,0.06), rgba(59,130,246,0.04))`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                        {stat.label}
                      </p>
                      <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                    <span className="text-xl sm:text-2xl group-hover:scale-125 transition-transform">{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="card-elevated p-4 sm:p-6 enter" style={{ animationDelay: "120ms" }}>
              <h2 className="section-heading text-xl sm:text-2xl mb-4 sm:mb-6">Quick Stats</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: "Completion Rate", percent: 78, icon: "✅" },
                  { label: "Student Satisfaction", percent: 92, icon: "⭐" },
                  { label: "Attendance Rate", percent: 85, icon: "📍" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-sm sm:text-base font-medium">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="font-bold text-[var(--primary)] text-sm sm:text-base">{item.percent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6 enter" style={{ animationDelay: "160ms" }}>
              <h2 className="section-heading text-xl sm:text-2xl mb-4 sm:mb-6">Teaching Goals</h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { goal: "Complete module 5", status: "In Progress", daysLeft: 3 },
                  { goal: "Review all submissions", status: "On Track", daysLeft: 1 },
                  { goal: "Conduct assessments", status: "Pending", daysLeft: 5 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 truncate">{item.goal}</p>
                      <p className="text-xs text-[var(--muted)]">{item.daysLeft} days remaining</p>
                    </div>
                    <span className={`badge text-xs whitespace-nowrap ml-2 shrink-0 ${
                      item.status === "In Progress" ? "badge-warning" :
                      item.status === "On Track" ? "badge-success" :
                      "badge"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <LeadBod />
        </main>
      </div>
    </div>
  );
}
