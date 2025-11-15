"use client";

import { useState } from "react";
import Link from "next/link";
import TeacherCard from "@/components/dashboard/team/TeacherCard";
import { useRouter } from "next/navigation";

export default function TeachersPage() {
  const router = useRouter();
  const [teachers] = useState([
    {
      id: "1",
      name: "Mohamed Karie",
      email: "user@gmail.com",
      role: "Owner",
      students: undefined,
      lastLogin: undefined,
      className: undefined,
      showActions: false,
    },
    {
      id: "2",
      name: "Abdirahman Ahmed",
      email: "user@gmail.com",
      students: 50,
      lastLogin: "5 mints ago",
      className: "Abdirahman Ahmed Weekend Class",
      showActions: true,
    },
  ]);

  const handleEdit = (teacher) => {
    router.push(`/dashboard/super-admin/team/teacher/${teacher.id}/edit`);
  };

  const handleDelete = (teacher) => {
    console.log("Delete teacher:", teacher);
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
        <Link
          href="/dashboard/super-admin/team/teacher/createTeacher"
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          <span className="text-lg">+</span>
          Add New Teachers
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
