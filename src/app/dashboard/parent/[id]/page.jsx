"use client";

import { use } from "react";
import ParentProfile from "@/components/dashboard/parents/ParentProfile";

const demoParents = {
  "parent-1": {
    name: "Abdifatah Soyal",
  },
};

export default function ParentDetailPage({ params }) {
  const resolvedParams = use(params);
  const parentId = resolvedParams?.id;
  const parentData = parentId ? demoParents[parentId] ?? { name: "Abdifatah Soyal" } : {};

  return (
    <div className="space-y-8">
      <ParentProfile parent={parentData} />
    </div>
  );
}

