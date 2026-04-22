import Link from "next/link";









export default function ClassCategoryCard({ category, count }) {
  return (
    <Link
      href={`/students/classes/${category.id}`}
      className="group lesson-card relative overflow-hidden rounded-[24px] border-2 transition-all duration-300 hover:scale-105"
      style={{
        borderColor: category.accent,
        background: `linear-gradient(135deg, ${category.accent}14, rgba(255,255,255,0.6))`,
      }}
    >
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ backgroundColor: category.accent }}
      />

      <div className="relative flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Class Category
            </p>
            <h3 className="mt-2 text-2xl font-bold" style={{ color: category.accent }}>
              {category.id}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[var(--fg)]">{category.title}</p>
          </div>
          <div className="badge text-xs font-bold whitespace-nowrap" style={{
            background: `linear-gradient(135deg, ${category.accent}, ${category.glow})`,
          }}>
            {count}
          </div>
        </div>

        <p className="max-w-md text-sm font-medium leading-relaxed text-[var(--muted)]">
          {category.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {category.levels.map((level) => (
            <span
              key={level}
              className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                borderColor: category.accent,
                color: category.accent,
                backgroundColor: `${category.accent}10`,
              }}
            >
              {level}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            View roster
          </span>
          <span className="icon-btn" style={{
            background: `linear-gradient(135deg, ${category.accent}, ${category.glow})`,
            color: "white",
          }}>
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
