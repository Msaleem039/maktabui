"use client";

import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassDetailCard from "@/components/dashboard/classes/ClassDetailCard";
import { useRouter } from "next/navigation";
import { getClassByIDAction } from "@/redux/slices/classSlices/classSlice";

export default function ClassDetailPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const classId = params?.id;

  const {
    loading,
    classDetails,
    students,
    error
  } = useSelector(state => state.getClassByID);

  useEffect(() => {
    if (classId) {
      dispatch(getClassByIDAction(classId));
    }
  }, [classId, dispatch]);

  const classData = useMemo(() => {
    if (!classDetails) {
      return {
        id: classId || "class-1",
        name: "Loading...",
        code: "CLS-000",
        students: "0",
        subject: "Loading...",
        studentsList: [],
        teacher: "Loading...",
        description: "",
        startDate: "",
        endDate: "",
        isActive: true
      };
    }

    return {
      id: classDetails._id,
      name: classDetails.name,
      code: classDetails.code,
      students: classDetails.studentCount?.toString() || students?.length.toString() || "0",
      subject: classDetails.subject,
      description: classDetails.description,
      teacher: classDetails.teacherId?.fullName || "Unknown Teacher",
      startDate: classDetails.startDate,
      endDate: classDetails.endDate,
      isActive: classDetails.isActive,
      studentsList: students?.map(student => ({
        id: student._id,
        name: student.studentName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        parent: student.parent?.parentName,
        parentPhone: student.parent?.phone,
        enrollDate: student.enrollDate
      })) || []
    };
  }, [classDetails, students, classId]);

  const handleAddLesson = () => {
    router.push(`/dashboard/class/${classData.id}/add-lesson`);
  };

  const handleViewStudent = (studentId) => {
    router.push(`/dashboard/student/${studentId}`);
  };

  const handleEditClass = () => {
    router.push(`/dashboard/class/${classData.id}/edit`);
  };

  // Show loading state
  if (loading) {
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
          <div className="text-lg text-[#799086]">Loading class details...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
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
          <div className="text-lg text-red-600">Error: {error}</div>
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
            onClick={handleEditClass}
            className="px-4 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
          >
            Edit Class
          </button>
        </div>
      </div>

      <ClassDetailCard
        classData={classData}
        onAddLesson={handleAddLesson}
        onViewStudent={handleViewStudent}
      />
    </div>
  );
}