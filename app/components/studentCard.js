import Link from "next/link";

const medalToneStyles = {
  amber: {
    backgroundColor: "rgba(245, 158, 11, 0.16)",
    borderColor: "rgba(245, 158, 11, 0.35)",
  },
  blue: {
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderColor: "rgba(37, 99, 235, 0.3)",
  },
  green: {
    backgroundColor: "rgba(34, 197, 94, 0.16)",
    borderColor: "rgba(34, 197, 94, 0.34)",
  },
  rose: {
    backgroundColor: "rgba(225, 29, 72, 0.12)",
    borderColor: "rgba(225, 29, 72, 0.26)",
  },
};

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
      return {
        backgroundColor: "rgba(34, 197, 94, 0.16)",
        color: "var(--fg)",
      };
    case "In review":
      return {
        backgroundColor: "rgba(245, 158, 11, 0.18)",
        color: "var(--fg)",
      };
    default:
      return {
        backgroundColor: "rgba(225, 29, 72, 0.12)",
        color: "var(--fg)",
      };
  }
}

export default function StudentCard({ student }) {
  const joinedDate = formatDate(student.joinedDate);
  const studiedCount = student.studyDays.filter((item) => item.studied).length;

  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-[28px] border border-[var(--border)] glass p-5 shadow-[var(--shadow-tight)] transition hover:-translate-y-1 hover:shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_#ffffff,_#c7d7ff)] text-lg font-semibold">
            {getInitials(student.name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/students/${student.id}`}
                className="text-lg font-semibold hover:underline"
                aria-label={`View ${student.name}`}
              >
                {student.name}
              </Link>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={getStatusTone(student.status)}
              >
                {student.status}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-[var(--fg)]/60">
              {student.className}
            </p>
          </div>
        </div>
        <span className="chip bg-[var(--panel-2)] text-[var(--fg)]">
          {student.index}
        </span>
      </div>

      <div className="grid gap-2 rounded-3xl border border-[var(--border)] bg-[var(--panel)]/60 px-4 py-3 text-xs font-medium text-[var(--fg)]/70">
        <div className="flex items-center justify-between">
          <span>Program</span>
          <span className="text-right text-[var(--fg)]">{student.track}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Joined</span>
          <span className="text-[var(--fg)]">{joinedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phone</span>
          <span className="text-[var(--fg)]">{student.phone}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(34,197,94,0.08))] p-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
          <span>5-day study streak</span>
          <span className="text-[var(--fg)]">{studiedCount}/5 days</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {student.studyDays.map((day) => (
            <div key={day.label} className="text-center">
              <div
                className="h-12 rounded-2xl border border-[var(--border)]"
                style={{
                  background: day.studied
                    ? "linear-gradient(180deg, rgba(37,99,235,0.92), rgba(34,197,94,0.92))"
                    : "var(--panel)",
                }}
              />
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/55">
                {day.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)]/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
            Weekly medals
          </p>
          <span className="text-xs font-medium text-[var(--fg)]/55">
            New each week
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {student.achievements.map((achievement) => (
            <span
              key={`${achievement.week}-${achievement.medal}`}
              className="rounded-full border px-3 py-2 text-xs font-semibold"
              style={medalToneStyles[achievement.tone]}
            >
              {achievement.medal} · {achievement.week}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--fg)]/60">
        {student.weakAreas.map((area) => (
          <span
            key={area}
            className="rounded-full border border-[var(--border)] bg-[var(--panel)]/70 px-3 py-1"
          >
            {area}
          </span>
        ))}
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)]/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/60">
          Direct message
        </p>
        <textarea
          rows={3}
          placeholder={`Write a message for ${student.name}...`}
          className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
        />
        <button type="button" className="mt-3 w-full btn btn-primary">
          Send text
        </button>
      </div>
    </article>
  );
}
