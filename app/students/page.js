import SideFoot from "../components/sideFoot";
import StudentCard from "../components/studentCard";

const students = [
  {
    id: "GD-201",
    name: "Amina Otieno",
    className: "Class B Manual",
    index: "IDX-104",
    progress: 78,
    feeStatus: "Paid",
    weakAreas: ["Roundabouts", "Parking"],
  },
  {
    id: "GD-202",
    name: "Kevin Kariuki",
    className: "Class C Automatic",
    index: "IDX-221",
    progress: 54,
    feeStatus: "Plan",
    weakAreas: ["Hill starts", "Signs"],
  },
  {
    id: "GD-203",
    name: "Lynn Mwikali",
    className: "Class B Manual",
    index: "IDX-119",
    progress: 62,
    feeStatus: "Overdue",
    weakAreas: ["Night driving"],
  },
  {
    id: "GD-204",
    name: "Brian Kiptoo",
    className: "Class D Truck",
    index: "IDX-087",
    progress: 81,
    feeStatus: "Paid",
    weakAreas: ["Reverse bay"],
  },
  {
    id: "GD-205",
    name: "Njeri Kimani",
    className: "Class B Manual",
    index: "IDX-176",
    progress: 47,
    feeStatus: "Plan",
    weakAreas: ["Mirror checks", "Speed"],
  },
  {
    id: "GD-206",
    name: "Sam Ouma",
    className: "Class C Automatic",
    index: "IDX-190",
    progress: 69,
    feeStatus: "Paid",
    weakAreas: ["Confidence"],
  },
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Students" />
        <main className="space-y-6">
          <section className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--fg)]/60">
                  Student roster
                </p>
                <h1 className="font-display text-3xl font-semibold">
                  Learners
                </h1>
              </div>
              <span className="chip bg-[var(--green)] text-[var(--fg)]">
                84 active
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
