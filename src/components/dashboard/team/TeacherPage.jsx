"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TeacherCard from "@/components/dashboard/team/TeacherCard";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTeachers,
  resetAllTeachersState,
} from "@/redux/slices/teacherSlices/teacherSlices";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

export default function TeacherPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const adminId = getAdminId();
  const { themeColor, mainText } = useTheme();
  const { teachers, status, error } = useSelector(
    (state) => state.getAllTeachers
  );

  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    dispatch(getAllTeachers(adminId));

    return () => {
      dispatch(resetAllTeachersState());
    };
  }, [dispatch]);

  const handleEdit = (teacher) => {
    router.push(`/dashboard/team/teacher/${teacher.id}/edit`);
  };

  const handleDelete = (teacher) => {
    console.log("Delete teacher:", teacher);
  };

  const handleToggleCard = (teacherId) => {
    setExpandedCardId(expandedCardId === teacherId ? null : teacherId);
  };

  const handleRetry = () => {
    dispatch(getAllTeachers(adminId));
  };

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold opacity-50" style={{ borderColor: themeColor, color: themeColor }}>
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
            <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText}
            </h1>
          </div>
          <Link
            href="/dashboard/super-admin/team/teacher/createTeacher"
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#F3F6F5]"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            <span className="text-lg">+</span>
            Add New Teachers
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center py-12 space-y-4">
          <div className="text-red-600 text-lg">Error: {error}</div>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#F3F6F5]"
            style={{ borderColor: themeColor, color: themeColor }}
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
          <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            {mainText}
          </h1>
        </div>
        <Link
          href="/dashboard/super-admin/team/teacher/createTeacher"
          className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#F3F6F5]"
          style={{ borderColor: themeColor, color: themeColor }}
        >
          <span className="text-lg">+</span>
          Add New Teachers
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers &&
          teachers.map((teacher) => (
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
