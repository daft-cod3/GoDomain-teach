export default function StudentInfo({ student }) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
            Student profile
          </p>
          <h1 className="font-display text-4xl font-semibold">{student.name}</h1>
          <p className="text-sm font-medium text-[var(--fg)]/70">
            {student.className} - {student.index}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2 text-sm font-semibold">
          {student.status}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6 hover-lift">
          <p className="font-display text-2xl font-semibold">Progress snapshot</p>
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--fg)]/60">
              <span>Completion</span>
              <span>{student.progress}%</span>
            </div>
            <div className="mt-2 h-4 rounded-full border border-[var(--border)] bg-white">
              <div
                className="h-full rounded-full bg-[var(--blue)]"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Fee Status
              </p>
              <p className="mt-2 text-lg font-semibold">{student.feeStatus}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Weeks in school
              </p>
              <p className="mt-2 text-lg font-semibold">{student.weeks}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <p className="text-xs font-semibold text-[var(--fg)]/60">
                Next test
              </p>
              <p className="mt-2 text-lg font-semibold">{student.nextTest}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--blue-2)] p-6 text-white shadow-[var(--shadow-tight)] hover-lift">
          <p className="font-display text-2xl font-semibold">Instructor notes</p>
          <p className="mt-4 text-sm font-medium text-white/80">
            {student.notes}
          </p>
          <div className="mt-6 space-y-3">
            {student.weakAreas.map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-white/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow-tight)] hover-lift">
          <p className="font-display text-2xl font-semibold">Contact student</p>
          <div className="mt-5 space-y-3 text-sm font-medium text-[var(--fg)]/80">
            <p>Email: {student.contact.email}</p>
            <p>Phone: {student.contact.phone}</p>
            <p>Guardian: {student.contact.guardian}</p>
          </div>
          <button type="button" className="mt-6 w-full btn btn-primary">
            Start chat
          </button>
        </div>
        <div className="panel p-6 hover-lift">
          <p className="font-display text-2xl font-semibold">Learning checklist</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {student.checklist.map((item, index) => (
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
        </div>
      </div>
    </div>
  );
}
