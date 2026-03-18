import Link from "next/link";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StudentCard({ student }) {
  const progress = Math.min(Math.max(student.progress, 0), 100);
  return (
    <Link
      href={`/students/${student.id}`}
      className="group block h-full"
      aria-label={`View ${student.name}`}
    >
      <article className="relative flex h-full flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-tight)] group-hover:-translate-y-1 group-hover:shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[radial-gradient(circle_at_top,_#ffffff,_#c7d7ff)] text-lg font-semibold">
              {getInitials(student.name)}
            </div>
            <div>
              <p className="text-lg font-semibold">{student.name}</p>
              <p className="text-xs font-medium text-[var(--fg)]/60">
                {student.className}
              </p>
            </div>
          </div>
          <span className="chip bg-[var(--green)] text-[var(--fg)]">
            {student.index}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--fg)]/60">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-3 rounded-full border border-[var(--border)] bg-white">
            <div
              className="h-full rounded-full bg-[var(--blue)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--fg)]/60">
          {student.weakAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs font-semibold uppercase tracking-[0.2em]">
          <span>Fees</span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--blue-2)] px-3 py-1 text-white">
            {student.feeStatus}
          </span>
        </div>
      </article>
    </Link>
  );
}
