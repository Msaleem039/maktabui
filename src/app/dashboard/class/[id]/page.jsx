"use client";

import { useMemo } from "react";
import ClassDetailCard from "@/components/dashboard/classes/ClassDetailCard";
import { useRouter } from "next/navigation";

export default function ClassDetailPage({ params }) {
  const router = useRouter();

  const classData = useMemo(() => {
    return {
      id: params?.id || "class-1",
      name: "203 Abdirahman Jama Class",
      code: "CLS-203",
      students: "30",
      subject: "Quran",
      studentsList: Array.from({ length: 7 }, (_, index) => ({
        id: `student-${index + 1}`,
        name: "Abdirahman Jama Class",
      })),
    };
  }, [params?.id]);

  const handleAddLesson = () => {
    router.push(`/dashboard/class/${classData.id}/add-lesson`);
  };

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
      <ClassDetailCard classData={classData} onAddLesson={handleAddLesson} />
    </div>
  );
}

