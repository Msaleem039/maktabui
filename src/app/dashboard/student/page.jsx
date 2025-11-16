"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const StudentTable = dynamic(
  () => import("@/components/dashboard/students/StudentTable"),
  { ssr: false }
);

export default function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="space-y-8">
      <StudentTable
        title="Students (All Classes)"
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />
    </div>
  );
}