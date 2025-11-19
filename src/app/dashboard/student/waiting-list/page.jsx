"use client";

import WaitlistTable from "@/components/dashboard/students/WaitlistTable";

export default function ParentsPage() {
    return (
        <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
            <WaitlistTable />
        </div>
    );
}

