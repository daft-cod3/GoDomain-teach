import Link from "next/link";
import { notFound } from "next/navigation";
import SideFoot from "../../components/sideFoot";
import StudentInfo from "../components/student";

const students = [
  {
    id: "GD-201",
    name: "Amina Otieno",
    className: "Class B Manual",
    index: "IDX-104",
    status: "Active",
    feeStatus: "Paid",
    progress: 78,
    weeks: 9,
    nextTest: "Apr 03",
    weakAreas: ["Roundabouts", "Parallel park", "Mirror checks"],
    notes:
      "Confident in city driving. Needs more repetition on parallel parking and consistent mirror checks.",
    contact: {
      email: "learner@godomain.africa",
      phone: "+254 712 000 321",
      guardian: "+254 712 000 654",
    },
    checklist: [
      "Defensive driving",
      "Highway merge",
      "Night driving",
      "Emergency stops",
      "Sign recognition",
      "Parking mastery",
    ],
  },
  {
    id: "GD-202",
    name: "Kevin Kariuki",
    className: "Class C Automatic",
    index: "IDX-221",
    status: "In review",
    feeStatus: "Plan",
    progress: 54,
    weeks: 6,
    nextTest: "Apr 09",
    weakAreas: ["Hill starts", "Sign recall"],
    notes:
      "Smooth steering. Work on controlled hill starts and road sign recall drills.",
    contact: {
      email: "kevin.kariuki@godomain.africa",
      phone: "+254 712 000 411",
      guardian: "+254 712 000 455",
    },
    checklist: [
      "Defensive driving",
      "Highway merge",
      "Night driving",
      "Emergency stops",
      "Sign recognition",
      "Parking mastery",
    ],
  },
  {
    id: "GD-203",
    name: "Lynn Mwikali",
    className: "Class B Manual",
    index: "IDX-119",
    status: "Needs focus",
    feeStatus: "Overdue",
    progress: 62,
    weeks: 7,
    nextTest: "Apr 12",
    weakAreas: ["Night driving", "Speed control"],
    notes:
      "Learner is attentive. Needs more confidence with speed modulation at night.",
    contact: {
      email: "lynn.mwikali@godomain.africa",
      phone: "+254 712 000 888",
      guardian: "+254 712 000 889",
    },
    checklist: [
      "Defensive driving",
      "Highway merge",
      "Night driving",
      "Emergency stops",
      "Sign recognition",
      "Parking mastery",
    ],
  },
];

export default function StudentProfile({ params }) {
  const student = students.find((item) => item.id === params.id);
  if (!student) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr]">
        <SideFoot active="Students" />
        <main className="flex w-full flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link href="/students" className="btn btn-ghost">
              Back to students
            </Link>
            <span className="chip bg-[var(--green)] text-[var(--fg)]">
              Profile loaded
            </span>
          </div>
          <StudentInfo student={student} />
        </main>
      </div>
    </div>
  );
}
