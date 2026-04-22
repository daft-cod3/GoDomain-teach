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
      return "badge-success";
    case "In review":
      return "badge-warning";
    default:
      return "badge-danger";
  }
}

export default function StudentCard({ student }) {
  const joinedDate = formatDate(student.joinedDate);
  const studiedCount = student.studyDays.filter((item) => item.studied).length;
  const progressPercent = Math.round((studiedCount / (student.studyDays?.length || 1)) * 100);

  return (
    <article className="group lesson-card relative overflow-hidden rounded-[24px] border border-[var(--border)] p-6 shadow-[var(--shadow-tight)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 blur-3xl group-hover:scale-125 transition-transform duration-500" />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[var(--border)] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-base font-bold text-white shadow-[var(--shadow-tight)]">
              {getInitials(student.name)}
            </div>
            <div>
              <Link
                href={`/students/${student.id}`}
                className="text-lg font-semibold tracking-[-0.01em] text-[var(--fg)] hover:text-[var(--primary)] transition-colors duration-200"
                aria-label={`View ${student.name}`}
              >
                {student.name}
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                {student.className}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`badge ${getStatusTone(student.status)}`}>
              {student.status}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
              {student.classTier ?? student.index}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="stat-label">Joined</p>
            <p className="text-sm font-semibold">{joinedDate}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Progress</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[var(--primary)]">{progressPercent}%</span>
              <div className="flex-1 h-2 bg-[var(--panel-3)] rounded-full overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Study Days</p>
            <p className="text-base font-bold">{studiedCount} / {student.studyDays?.length || 0}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
          <div className="rounded-3xl border border-(--border) bg-(--panel)/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/52">
              Progress
            </p>
            <p className="mt-2 text-2xl font-semibold">{student.progress}%</p>
          </div>
          <div className="rounded-3xl border border-(--border) bg-(--panel)/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/52">
              Study streak
            </p>
            <p className="mt-2 text-2xl font-semibold">{studiedCount}/5</p>
          </div>
          <div className="rounded-3xl border border-(--border) bg-(--panel)/72 px-4 py-4 backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/52">
              Next test
            </p>
            <p className="mt-2 text-2xl font-semibold">{student.nextTest}</p>
          </div>
        </div>

        <div className="rounded-[26px] border border-(--border) bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(255,255,255,0.72))] p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fg)/55">
            <span>Snapshot</span>
            <span>{student.track}</span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-(--panel)/82">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--blue),var(--green))]"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 text-sm font-medium text-(--fg)/72">
            <div className="flex items-center justify-between">
              <span>Joined</span>
              <span className="text-foreground">{joinedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phone</span>
              <span className="text-foreground">{student.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {student.weakAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-(--border) bg-(--panel)/72 px-3 py-2 text-xs font-semibold text-(--fg)/74 backdrop-blur-xl"
            >
              {area}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-(--border)/70 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--fg)/52">
              Learner index
            </p>
            <p className="mt-1 text-sm font-semibold">{student.index}</p>
          </div>
          <Link
            href={`/students/${student.id}`}
            className="rounded-full border border-(--border) bg-(--panel)/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-(--blue) hover:text-white"
          >
            Open card
          </Link>
        </div>
      </div>
    </article>
  );
}
