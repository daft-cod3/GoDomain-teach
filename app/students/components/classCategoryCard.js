import Link from "next/link";

export default function ClassCategoryCard({ category, count }) {
  return (
    <Link
      href={`/students/classes/${category.id}`}
      className="group glass relative overflow-hidden rounded-[30px] border border-[var(--border)] p-5 shadow-[var(--shadow-tight)] hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[var(--shadow)]"
      style={{
        background: `linear-gradient(135deg, ${category.accent}, rgba(255,255,255,0.72))`,
      }}
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl"
        style={{ backgroundColor: category.glow }}
      />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--fg)]/56">
              Learner category
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold">
              {category.id}
            </h3>
            <p className="mt-2 text-lg font-semibold">{category.title}</p>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--panel)]/80 px-4 py-2 text-sm font-semibold shadow-[var(--shadow-tight)]">
            {count} learners
          </div>
        </div>

        <p className="max-w-md text-sm font-medium leading-6 text-[var(--fg)]/68">
          {category.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {category.levels.map((level) => (
            <span
              key={level}
              className="rounded-full border border-[var(--border)] bg-[var(--panel)]/74 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg)]"
            >
              {level}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)]/70 pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--fg)]/52">
            View class roster
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--panel)]/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] group-hover:bg-[var(--panel)]">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}
