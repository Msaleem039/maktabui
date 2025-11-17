"use client";

import AddStudentForm from "@/components/dashboard/students/AddStudentForm";

export default function EditParentPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <AddStudentForm parentId={params?.id} />
      </div>
    </div>
  );
}


