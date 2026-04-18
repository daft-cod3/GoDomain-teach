import Link from "next/link";
import { notFound } from "next/navigation";
import SideFoot from "../../components/sideFoot";
import { getStudentById } from "../../data/students";
import StudentInfo from "../components/student";

export default async function StudentProfile({ params }) {
  const { id } = await params;
  const student = getStudentById(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <SideFoot active="Students" />
        <main className="dashboard-main flex w-full flex-col gap-8">
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
