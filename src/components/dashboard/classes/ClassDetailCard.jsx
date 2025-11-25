"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, Edit, MessageSquare, Trash2, Plus } from "lucide-react";

const ClassDetailCard = ({ classData, onAddLesson }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const actionMenuItems = [
    { label: "View Profile", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" },
    { label: "Comment", icon: MessageSquare, action: "comment" },
    { label: "Remove", icon: Trash2, action: "remove" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    console.log(`${action} clicked for student ${id}`);
    setOpenDropdownId(null);
  };

  return (
    <div className="rounded-[28px] border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
      {/* Header with profile picture */}
      <div className="relative h-[200px] bg-gradient-to-br from-[#0B4B31] to-[#1C6A45] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white/30"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/20"></div>
        </div>

        {/* Profile Picture - Clickable */}
        <div className="absolute left-8 bottom-[-60px] z-30">
          <button
            onClick={onAddLesson}
            className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-45px_rgba(0,0,0,0.7)] ring-8 ring-[#D5E2DB] transition hover:scale-105 cursor-pointer"
          >
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#C7D7D0] bg-white">
              <Image
                src="/user-icon.svg"
                alt="Class profile"
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

      {/* Content Area */}
      <div className="px-8 pb-8 pt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#0B4B31]">{classData.name}</h2>
            <p className="text-sm uppercase tracking-[0.35em] text-[#627169]">{classData.code}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2">
              <p className="text-xs font-semibold text-[#627169]">Students</p>
              <p className="text-lg font-bold text-[#0B4B31]">{classData.students}</p>
            </div>
            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2">
              <p className="text-xs font-semibold text-[#627169]">Subject</p>
              <p className="text-lg font-bold text-[#0B4B31]">{classData.subject}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#0B4B31] mb-4">Students</h3>
          <div className="space-y-3">
            {classData.studentsList?.map((student, index) => {
              const isDropdownOpen = openDropdownId === student.id;
              return (
                <div
                  key={student.id || index}
                  className="flex items-center justify-between rounded-[18px] border border-[#E2E7E4] bg-[#FBFDFB] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                      👤
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B4B31]">{student.name}</p>
                      <p className="text-xs text-[#627169]">ID: {student.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailCard;

