"use client";

import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentProfile from "@/components/dashboard/students/StudentProfile";
import { getStudentById } from "@/redux/slices/studentSlices/studentSlices";
import { useParams } from "next/navigation";

export default function StudentDetailPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const { student, attendance, assignments, status, error } = useSelector(
    (state) => state.getStudentById
  );

  useEffect(() => {
    if (params?.id) {
      dispatch(getStudentById(params.id));
    }
  }, [dispatch, params?.id]);

  const studentData = useMemo(() => {
    if (student) {
      const formatDateOfBirth = (date) => {
        if (!date) return "Not specified";
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      const parentData = student.parent
        ? {
            name: student.parent.name || "Not specified",
            email: student.parent.email || "Not specified",
            phone: student.parent.phone || "Not specified",
            spouse: student.parent.spouse || "Not specified",
            spousePhone: student.parent.spousePhone || "Not specified",
            emergencyPhone: student.parent.emergencyPhone || "Not specified",
          }
        : {};

      return {
        ...student,
        dob: formatDateOfBirth(student.dateOfBirth),
        parent: parentData,
        attendance: attendance || [],
        assignments: assignments || [],
      };
    }

    return {
      name: "",
      email: "",
      class: "",
      dob: "Not specified",
      gender: "",
      phone: "",
      address: "",
      parent: {},
      attendance: [],
      assignments: [],
    };
  }, [student, attendance, assignments]);

  const attendanceStats = useMemo(() => {
    const studentAttendance = studentData?.attendance || [];
    const total = studentAttendance.length;
    const present = studentAttendance.filter(
      (record) => record.status === "Present"
    ).length;
    const absent = studentAttendance.filter(
      (record) => record.status === "Absent"
    ).length;
    const late = studentAttendance.filter(
      (record) => record.status === "Late"
    ).length;

    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [studentData?.attendance]);

  const assignmentStats = useMemo(() => {
    const studentAssignments = studentData?.assignments || [];
    const now = new Date();

    const pending = studentAssignments.filter(
      (assignment) => new Date(assignment.dueDate) > now
    );
    const overdue = studentAssignments.filter(
      (assignment) => new Date(assignment.dueDate) < now
    );

    return {
      total: studentAssignments.length,
      pending: pending.length,
      overdue: overdue.length,
    };
  }, [studentData?.assignments]);

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-lg text-gray-600">Loading student data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-red-800 font-medium text-lg">
                Error loading student data
              </div>
              <div className="text-red-600 mt-1">{error}</div>
            </div>
          </div>
          <button
            onClick={() => params?.id && dispatch(getStudentById(params.id))}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>

        <StudentProfile
          student={studentData}
          attendanceStats={attendanceStats}
          assignmentStats={assignmentStats}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StudentProfile
        student={studentData}
        attendanceStats={attendanceStats}
        assignmentStats={assignmentStats}
      />
    </div>
  );
}