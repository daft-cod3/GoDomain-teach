export const teacherLeaders = [
  { username: "@jane.wambui", points: 980 },
  { username: "@peter.odhiambo", points: 920 },
  { username: "@lydia.mwende", points: 890 },
  { username: "@samir.hassan", points: 860 },
  { username: "@brenda.k", points: 840 },
];

const maxPoints = Math.max(...teacherLeaders.map((leader) => leader.points), 1);

export default function LeadBod() {
  return (
    <section className="card-elevated p-4 sm:p-6">
      <div className="flex items-center justify-between mb-2 gap-3">
        <div>
          <p className="section-title">Leaderboard</p>
          <h2 className="section-heading text-xl sm:text-2xl">
            Top educators
          </h2>
        </div>
        <span className="badge badge-success gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-white"></span>
          <span className="hidden xs:inline">Live ranking</span>
          <span className="xs:hidden">Live</span>
        </span>
      </div>

      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        {teacherLeaders.map((leader, index) => (
          <div
            key={leader.username}
            className="group relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-gradient-to-r from-[var(--panel)] to-[var(--panel-deep)] px-3 sm:px-5 py-3 sm:py-4 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-xs font-bold text-white shadow-md">
                  {index === 0 && "👑"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && (index + 1)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-[var(--fg)] truncate">{leader.username}</p>
                  <p className="text-xs text-[var(--muted)] hidden sm:block">
                    Points accumulated
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent shrink-0">
                {leader.points}
              </p>
            </div>

            <div className="mt-3 sm:mt-4 relative">
              <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-[var(--panel-3)] border border-[var(--border)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--cyan)]"
                  style={{
                    width: `${Math.round((leader.points / maxPoints) * 100)}%`,
                    transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
              <span className="mt-1 sm:mt-2 inline-block text-xs font-semibold text-[var(--muted)]">
                {Math.round((leader.points / maxPoints) * 100)}% of top score
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
