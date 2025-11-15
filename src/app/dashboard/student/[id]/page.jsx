"use client";

import { useMemo } from "react";
import StudentProfile from "@/components/dashboard/students/StudentProfile";

const demoStudents = {
  "student-1": {
    name: "Abdiqadir Abdikadir",
  },
};

export default function StudentDetailPage({ params }) {
  const studentData = useMemo(() => {
    if (!params?.id) return {};
    return demoStudents[params.id] ?? { name: "Abdiqadir Abdikadir" };
  }, [params?.id]);

  return (
    <div className="space-y-8">
      <StudentProfile student={studentData} />
    </div>
  );
}

