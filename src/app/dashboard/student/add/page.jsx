"use client";

import AddStudentSimpleForm from "@/components/dashboard/students/AddStudentSimpleForm";

export default function AddStudentPage() {
  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <AddStudentSimpleForm />
      </div>
    </div>
  );
}


