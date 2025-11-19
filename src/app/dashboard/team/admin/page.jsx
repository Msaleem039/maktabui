"use client";

import { useState } from "react";
import Link from "next/link";
import AdminCard from "@/components/dashboard/team/AdminCard";

export default function AdminPage() {
  const [admins] = useState([
    {
      id: "institute",
      name: "MaktabOS Institute",
      email: "User@gmail.com",
      isInstitute: true,
    },
    {
      id: "1",
      name: "Mohamed Karie",
      email: "user@gmail.com",
      role: "Owner",
      photo: null,
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">
            Welcome to
          </h1>
          <p className="text-[1.75rem] font-medium text-[#000000] mb-4">
            MaktabOS
          </p>
        </div>
        <Link
          href="/dashboard/team/admin/createAdmin"
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          <span className="text-lg">+</span>
          Add New Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} isInstitute={admin.isInstitute} />
        ))}
      </div>
    </div>
  );
}
