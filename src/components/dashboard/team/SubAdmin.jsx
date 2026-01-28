"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { getAllSubAdminsAction } from "@/redux/slices/subadminSlices/subAdminSlices";
import Cookies from "js-cookie";
import SubAdminCard from "./SubAdminCard";
import { useTheme } from "@/hooks/useTheme";

export default function SubAdmin() {
  const dispatch = useDispatch();
  const { themeColor, mainText } = useTheme();
  const { subAdmins, loading, error, adminId } = useSelector(
    (state) => state.getAllSubAdmins
  );

  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        if (userData && userData.id) {
          setCurrentAdminId(userData.id);
          dispatch(getAllSubAdminsAction(userData.id));
        } else {
          console.error("User ID not found in cookie");
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    } else {
      console.error("User cookie not found");
    }
  }, [dispatch]);

  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRefresh = () => {
    if (currentAdminId) {
      dispatch(getAllSubAdminsAction(currentAdminId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText}
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold opacity-50" style={{ borderColor: themeColor, color: themeColor }}>
            <span className="text-lg">+</span>
            Add New Sub Admin
          </div>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-[#799086]">Loading sub-admins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText}
            </h1>
          </div>
          <Link
            href="/dashboard/team/sub-admin/add"
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#F3F6F5]"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            <span className="text-lg">+</span>
            Add New Sub Admin
          </Link>
        </div>
        <div className="flex justify-center items-center h-32 flex-col gap-2">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={handleRefresh} className="text-blue-500 underline">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentAdminId && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText}
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500">
            Admin authentication required. Please login again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            {mainText}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/team/sub-admin/add"
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#F3F6F5]"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            <span className="text-lg">+</span>
            Add New Sub Admin
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Sub-Admins ({subAdmins?.length || 0})
        </h2>
        {subAdmins && subAdmins.length > 0 && (
          <span className="text-sm text-gray-500">
            Showing {subAdmins.length} sub-admin(s)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subAdmins && subAdmins.length > 0 ? (
          subAdmins.map((subAdmin) => (
            <SubAdminCard
              key={subAdmin._id}
              admin={subAdmin}
              isInstitute={subAdmin.isInstitute}
              isExpanded={expandedId === subAdmin._id}
              onToggle={() => handleToggle(subAdmin._id)}
              isSubAdmin={true}
            />
          ))
        ) : (
          <div className="col-span-2 flex justify-center items-center h-32">
            <p className="text-[#799086]">No sub-admins found</p>
          </div>
        )}
      </div>
    </div>
  );
}
