import Link from "next/link";









export default function ClassCategoryCard({ category, count }) {
  return (
    <Link
      href={`/students/classes/${category.id}`}
      className="group glass relative overflow-hidden rounded-3xl border border-(--border) p-3 shadow-(--shadow-tight) hover:-translate-y-1 hover:scale-[1.01] hover:shadow-(--shadow) md:p-4"
      style={{
        background: `linear-gradient(135deg, ${category.accent}, rgba(255,255,255,0.72))`,
      }}
    >
      <div
        className="absolute -right-5 -top-5 h-20 w-20 rounded-full blur-3xl"
        style={{ backgroundColor: category.glow }}
      />

      <div className="relative flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--fg)/56">
              Learner category
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold">
              {category.id}
            </h3>
            <p className="mt-1 text-sm font-semibold">{category.title}</p>
          </div>
          <div className="rounded-full border border-(--border) bg-(--panel)]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-(--shadow-tight)">
            {count} learners
          </div>
        </div>

        <p className="max-w-md text-[11px] font-medium leading-5 text-(--fg)/68">
          {category.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {category.levels.map((level) => (
            <span
              key={level}
              className="rounded-full border border-(--border) bg-(--panel)]/74 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-"
            >
              {level}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-(--border)/70 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--fg)/52">
            View class roster
          </span>
          <span className="rounded-full border border-(--border) bg-(--panel)/80 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] group-hover:bg-(--panel)">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}
