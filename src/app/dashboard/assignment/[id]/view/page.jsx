"use client";

import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAssignmentById } from "@/redux/slices/assignmentSlices/assignmentSlices";
import AssignmentDetailCard from "@/components/dashboard/assigment/AssignmentDetailCard";

export default function AssignmentDetailPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const assignmentId = params?.id;

  const {
    currentAssignment,
    fetchStatus,
    fetchError
  } = useSelector(state => state.assignment);

  useEffect(() => {
    if (assignmentId) {
      dispatch(getAssignmentById(assignmentId));
    }
  }, [assignmentId, dispatch]);

  const assignmentData = useMemo(() => {
    if (!currentAssignment) {
      return {
        id: assignmentId || "assignment-1",
        title: "Loading...",
        description: "Loading assignment details...",
        type: "Loading...",
        subject: "Loading...",
        class: "Loading...",
        teacher: "Loading...",
        totalMarks: "0",
        dueDate: "",
        attachments: [],
        status: "active",
        createdAt: "",
        student: null
      };
    }

    return {
      id: currentAssignment._id,
      title: currentAssignment.title,
      description: currentAssignment.description,
      type: currentAssignment.type,
      subject: currentAssignment.subject,
      class: currentAssignment.class?.name || "No Class",
      classId: currentAssignment.class?._id,
      teacher: currentAssignment.teacher?.fullName || "Unknown Teacher",
      teacherId: currentAssignment.teacher?._id,
      totalMarks: currentAssignment.totalMarks?.toString() || "0",
      dueDate: currentAssignment.dueDate,
      attachments: currentAssignment.attachments || [],
      status: currentAssignment.status || "active",
      createdAt: currentAssignment.createdAt,
      student: currentAssignment.student || null,
      solutions: currentAssignment.solutions || []
    };
  }, [currentAssignment, assignmentId]);

  const handleEditAssignment = () => {
    router.push(`/dashboard/assignment/${assignmentData.id}/edit`);
  };

  const handleViewSubmissions = () => {
    router.push(`/dashboard/assignment/${assignmentData.id}/submissions`);
  };

  const handleBackToAssignments = () => {
    router.push('/dashboard/assignment');
  };

  // Show loading state
  if (fetchStatus === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
              Welcome to
            </p>
            <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
              MaktabOS
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#799086]">Loading assignment details...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
              Welcome to
            </p>
            <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
              MaktabOS
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-lg text-red-600">Error: {fetchError}</div>
          <button
            onClick={handleBackToAssignments}
            className="px-4 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
            MaktabOS
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleViewSubmissions}
            className="px-4 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
          >
            View Submissions
          </button>
          <button
            onClick={handleEditAssignment}
            className="px-4 py-2 bg-[#E5EFEB] text-[#0B4B31] rounded-lg hover:bg-[#D4E6DE] transition-colors"
          >
            Edit Assignment
          </button>
        </div>
      </div>

      <AssignmentDetailCard
        assignmentData={assignmentData}
        onEditAssignment={handleEditAssignment}
        onViewSubmissions={handleViewSubmissions}
      />
    </div>
  );
}