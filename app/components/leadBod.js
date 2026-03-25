const leaders = [
  { username: "@jane.wambui", points: 980 },
  { username: "@peter.odhiambo", points: 920 },
  { username: "@lydia.mwende", points: 890 },
  { username: "@samir.hassan", points: 860 },
  { username: "@brenda.k", points: 840 },
];

const maxPoints = Math.max(...leaders.map((leader) => leader.points), 1);

export default function LeadBod() {
  return (
    <section className="panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
            Leaderboard
          </p>
          <h2 className="font-display text-2xl font-semibold">
            Teacher leaderboard
          </h2>
        </div>
        <span className="chip bg-[var(--green)] text-[var(--fg)]">
          Live points
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {leaders.map((leader, index) => (
          <div
            key={leader.username}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-4 text-sm font-medium"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--blue)] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{leader.username}</p>
                  <p className="text-xs text-[var(--fg)]/60">
                    Total points accumulated
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-[var(--fg)]">
                {leader.points} pts
              </p>
            </div>

            <div className="mt-3">
              <div className="h-3 overflow-hidden rounded-full bg-[var(--panel)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--blue),var(--green))]"
                  style={{
                    width: `${Math.round((leader.points / maxPoints) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
