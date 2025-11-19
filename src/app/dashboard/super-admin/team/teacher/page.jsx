"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TeacherCard from "@/components/dashboard/team/TeacherCard";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeachers, resetAllTeachersState } from "@/redux/slices/teacherSlices/teacherSlices";

export default function TeachersPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { teachers, status, error } = useSelector((state) => state.getAllTeachers);

  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    dispatch(getAllTeachers());

    return () => {
      dispatch(resetAllTeachersState());
    };
  }, [dispatch]);

  const handleEdit = (teacher) => {
    router.push(`/dashboard/super-admin/team/teacher/${teacher.id}/edit`);
  };

  const handleDelete = (teacher) => {
    console.log("Delete teacher:", teacher);
  };

  const handleToggleCard = (teacherId) => {
    setExpandedCardId(expandedCardId === teacherId ? null : teacherId);
  };


  const handleRetry = () => {
    dispatch(getAllTeachers());
  };

  if (status === "loading") {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] opacity-50">
            <span className="text-lg">+</span>
            Add New Teachers
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading teachers...</div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
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
          <Link
            href="/dashboard/super-admin/team/teacher/createTeacher"
            className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            <span className="text-lg">+</span>
            Add New Teachers
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center py-12 space-y-4">
          <div className="text-red-600 text-lg">Error: {error}</div>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            Retry
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
        <Link
          href="/dashboard/super-admin/team/teacher/createTeacher"
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          <span className="text-lg">+</span>
          Add New Teachers
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers && teachers.map((teacher) => (
          <TeacherCard
            key={teacher._id}
            teacher={teacher}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isExpanded={expandedCardId === teacher._id}
            onToggle={() => handleToggleCard(teacher._id)}
          />
        ))}

      </div>

      {(!teachers || teachers.length === 0) && status === "succeeded" && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-500">No teachers found.</div>
        </div>
      )}
    </div>
  );
}