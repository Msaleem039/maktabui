"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, Edit, MessageSquare, Trash2, Plus } from "lucide-react";

const ClassDetailCard = ({ classData, onAddLesson }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-[28px] border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
      
      {/* Header */}
      <div className="relative h-[200px] bg-gradient-to-br from-[#0B4B31] to-[#1C6A45] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white/30" />
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/20" />
        </div>

        {/* Profile Button */}
        <div className="absolute left-8 bottom-[-60px] z-30">
          <button
            onClick={onAddLesson}
            className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-45px_rgba(0,0,0,0.7)] ring-8 ring-[#D5E2DB] transition hover:scale-105"
          >
            <div className="relative flex h-24 w-24 overflow-hidden rounded-full border-2 border-[#C7D7D0] bg-white">
              <Image
                src="/user-icon.svg"
                alt="Class"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4B31] text-white shadow-lg opacity-0 group-hover:opacity-100 transition">
              <Plus size={16} />
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 pt-16">
        
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#0B4B31]">
              {classData.name}
            </h2>
            <p className="text-sm uppercase tracking-[0.35em] text-[#627169]">
              {classData.code}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2">
              <p className="text-xs font-semibold text-[#627169]">Students</p>
              <p className="text-lg font-bold text-[#0B4B31]">
                {classData.students}
              </p>
            </div>

            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2">
              <p className="text-xs font-semibold text-[#627169]">Subject</p>
              <p className="text-lg font-bold text-[#0B4B31]">
                {classData.subject}
              </p>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-[18px] bg-[#F3F8F6] p-4">
            <p className="text-xs font-semibold text-[#627169]">Teacher</p>
            <p className="text-base font-bold text-[#0B4B31]">
              {classData.teacher}
            </p>
            {classData.teacherEmail && (
              <p className="text-xs text-[#627169]">
                {classData.teacherEmail}
              </p>
            )}
            {classData.teacherPhone && (
              <p className="text-xs text-[#627169]">
                {classData.teacherPhone}
              </p>
            )}
          </div>

          <div className="rounded-[18px] bg-[#F3F8F6] p-4">
            <p className="text-xs font-semibold text-[#627169]">Status</p>
            <span
              className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                classData.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {classData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Description */}
        {classData.description && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#627169] uppercase tracking-wide">
              Description
            </h3>
            <p className="mt-2 text-sm text-[#0B4B31] leading-relaxed">
              {classData.description}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-3">
            <p className="text-xs font-semibold text-[#627169]">Start Date</p>
            <p className="text-sm font-bold text-[#0B4B31]">
              {classData.startDate}
            </p>
          </div>

          <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-3">
            <p className="text-xs font-semibold text-[#627169]">End Date</p>
            <p className="text-sm font-bold text-[#0B4B31]">
              {classData.endDate}
            </p>
          </div>
        </div>

        {/* Students */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#0B4B31] mb-4">
            Students
          </h3>

          {classData.studentsList?.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#C7D7D0] p-6 text-center text-sm text-[#627169]">
              No students enrolled in this class yet.
            </div>
          ) : (
            <div className="space-y-3">
              {classData.studentsList.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 rounded-[18px] border border-[#E2E7E4] bg-[#FBFDFB] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B4B31]">
                      {student.name}
                    </p>
                    <p className="text-xs text-[#627169]">
                      ID: {student.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ClassDetailCard;