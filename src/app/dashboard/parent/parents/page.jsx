"use client";

import dynamic from "next/dynamic";

const ParentTable = dynamic(
  () => import("@/components/dashboard/parents/ParentTable"),
  { ssr: false }
);

export default function ParentsPage() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <ParentTable />
    </div>
  );
}

