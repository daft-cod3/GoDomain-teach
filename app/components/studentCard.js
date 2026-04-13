import Link from "next/link";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusTone(status) {
  switch (status) {
    case "Active":
      return "bg-[rgba(34,197,94,0.14)] text-[var(--fg)]";
    case "In review":
      return "bg-[rgba(245,158,11,0.18)] text-[var(--fg)]";
    default:
      return "bg-[rgba(225,29,72,0.12)] text-[var(--fg)]";
  }
}

export default function StudentCard({ student }) {
  const joinedDate = formatDate(student.joinedDate);
  const studiedCount = student.studyDays.filter((item) => item.studied).length;

  return (
    <article className="group glass relative overflow-hidden rounded-[30px] border border-[var(--border)] p-5 shadow-[var(--shadow-tight)] hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[var(--shadow)]">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[linear-gradient(135deg,rgba(37,99,235,0.16),rgba(34,197,94,0.1))] blur-3xl" />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[var(--border)] bg-[var(--panel)]/82 text-lg font-semibold shadow-[var(--shadow-tight)]">
              {getInitials(student.name)}
            </div>
            <div>
              <Link
                href={`/students/${student.id}`}
                className="text-lg font-semibold tracking-[-0.01em] hover:text-[var(--blue)]"
                aria-label={`View ${student.name}`}
              >
                {student.name}
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--fg)]/55">
                {student.className}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(student.status)}`}
            >
              {student.status}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--panel)]/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {student.classTier ?? student.index}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)]/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/52">
              Progress
            </p>
            <p className="mt-2 text-2xl font-semibold">{student.progress}%</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)]/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/52">
              Study streak
            </p>
            <p className="mt-2 text-2xl font-semibold">{studiedCount}/5</p>
          </div>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)]/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/52">
              Next test
            </p>
            <p className="mt-2 text-2xl font-semibold">{student.nextTest}</p>
          </div>
        </div>

        <div className="rounded-[26px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(255,255,255,0.72))] p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/55">
            <span>Snapshot</span>
            <span>{student.track}</span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-[var(--panel)]/82">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--blue),var(--green))]"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 text-sm font-medium text-[var(--fg)]/72">
            <div className="flex items-center justify-between">
              <span>Joined</span>
              <span className="text-[var(--fg)]">{joinedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phone</span>
              <span className="text-[var(--fg)]">{student.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {student.weakAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-[var(--border)] bg-[var(--panel)]/72 px-3 py-2 text-xs font-semibold text-[var(--fg)]/74 backdrop-blur-xl"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)]/70 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/52">
              Learner index
            </p>
            <p className="mt-1 text-sm font-semibold">{student.index}</p>
          </div>
          <Link
            href={`/students/${student.id}`}
            className="rounded-full border border-[var(--border)] bg-[var(--panel)]/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[var(--blue)] hover:text-white"
          >
            Open card
          </Link>
        </div>
      </div>
    </article>
  );
}
