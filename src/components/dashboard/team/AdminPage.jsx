"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import AdminCard from "@/components/dashboard/team/AdminCard";
import { getAllAdminsAction } from "@/redux/slices/adminSlices/adminSlices";

export default function AdminPage() {
    const dispatch = useDispatch();
    const { admins, loading, error } = useSelector((state) => state.getAllAdmins);

    useEffect(() => {
        dispatch(getAllAdminsAction());
    }, [dispatch]);

    const [expandedId, setExpandedId] = useState(null);

    const handleToggle = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    if (loading) {
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
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] opacity-50">
                        <span className="text-lg">+</span>
                        Add New Admin
                    </div>
                </div>
                <div className="flex justify-center items-center h-32">
                    <p className="text-[#799086]">Loading admins...</p>
                </div>
            </div>
        );
    }

    if (error) {
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
                        href="/dashboard/team/admin/createAdmin"
                        className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
                    >
                        <span className="text-lg">+</span>
                        Add New Admin
                    </Link>
                </div>
                <div className="flex justify-center items-center h-32">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

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
                    href="/dashboard/team/admin/createAdmin"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
                >
                    <span className="text-lg">+</span>
                    Add New Admin
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {admins && admins.length > 0 ? (
                    admins.map((admin) => (
                        <AdminCard
                            key={admin._id}
                            admin={admin}
                            isInstitute={admin.isInstitute}
                            isExpanded={expandedId === admin._id}
                            onToggle={() => handleToggle(admin._id)}
                        />

                    ))
                ) : (
                    <div className="col-span-2 flex justify-center items-center h-32">
                        <p className="text-[#799086]">No admins found</p>
                    </div>
                )}
            </div>
        </div>
    );
}