"use client";

import { useState } from "react";
import StudentTable from "@/components/dashboard/students/StudentTable";

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