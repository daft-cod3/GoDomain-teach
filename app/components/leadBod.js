const leaders = [
  { name: "Jane Wambui", hp: 980, performance: "A+", classes: 42 },
  { name: "Peter Odhiambo", hp: 920, performance: "A", classes: 39 },
  { name: "Lydia Mwende", hp: 890, performance: "A", classes: 36 },
  { name: "Samir Hassan", hp: 860, performance: "B+", classes: 33 },
  { name: "Brenda K.", hp: 840, performance: "B", classes: 31 },
];

export default function LeadBod() {
  return (
    <section className="panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
            Leaderboard
          </p>
          <h2 className="font-display text-2xl font-semibold">
            Teacher performance
          </h2>
        </div>
        <span className="chip bg-[var(--green)] text-[var(--fg)]">
          Weekly
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {leaders.map((leader, index) => (
          <div
            key={leader.name}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm font-medium"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--blue)] text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-medium">{leader.name}</p>
                <p className="text-xs text-[var(--fg)]/60">
                  {leader.classes} classes
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{leader.hp} HP</p>
              <p className="text-xs text-[var(--fg)]/60">
                {leader.performance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
