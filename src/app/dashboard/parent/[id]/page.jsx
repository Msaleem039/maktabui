"use client";

import { useMemo } from "react";
import ParentProfile from "@/components/dashboard/parents/ParentProfile";

const demoParents = {
  "parent-1": {
    name: "Abdifatah Soyal",
  },
};

export default function ParentDetailPage({ params }) {
  const parentData = useMemo(() => {
    if (!params?.id) return {};
    return demoParents[params.id] ?? { name: "Abdifatah Soyal" };
  }, [params?.id]);

  return (
    <div className="space-y-8">
      <ParentProfile parent={parentData} />
    </div>
  );
}

