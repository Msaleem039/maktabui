"use client";

import Image from "next/image";
import { User, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TeacherCard = ({ teacher, onDelete, isExpanded, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`relative rounded-[28px] overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[320px]'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <Image
          src="/proofile card 4.svg"
          alt="Teacher card background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20 transition-all duration-300 ${isExpanded ? 'relative rounded-t-[28px]' : ''
        }`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={onToggle}
            className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${isHovered || isExpanded ? 'shadow-lg' : 'shadow-md'
              }`}
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-[#0B4B31]" />
            ) : (
              <ChevronDown size={16} className="text-[#0B4B31]" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{teacher.name}</h3>
            {teacher.role && (
              <p className="text-sm text-gray-600 mt-1">({teacher.role})</p>
            )}
            <p className="text-sm text-gray-600 mt-1">{teacher.email}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center ml-4">
            <User size={24} className="text-[#0B4B31]" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {teacher.students !== undefined && teacher.students !== null && (
            <span className="inline-flex items-center px-3 py-2 rounded-full bg-[#0B4B31] text-white text-xs font-semibold">
              Students ({teacher.students})
            </span>
          )}
          {teacher.lastLogin && (
            <span className="inline-flex items-center px-3 py-2 rounded-full bg-[#F16957] text-white text-xs font-semibold">
              Last Login: {teacher.lastLogin}
            </span>
          )}
        </div>

        {teacher.className && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-2 rounded-full bg-cyan-100 text-gray-900 text-xs font-semibold">
              Class: {teacher.className}
            </span>
          </div>
        )}

        {isExpanded && (
          <div
            className="mt-4 pt-5 border-t border-gray-200/60 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                <p className="text-gray-500 font-medium">Status</p>
                <p className="text-[#0B4B31] font-semibold mt-1">
                  {teacher.role === "Owner" ? "Administrator" : "Active"}
                </p>
              </div>

              <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                <p className="text-gray-500 font-medium">Account Type</p>
                <p className="text-[#0B4B31] font-semibold mt-1">Teacher</p>
              </div>

              {teacher.joinedDate && (
                <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                  <p className="text-gray-500 font-medium">Joined</p>
                  <p className="text-[#0B4B31] font-semibold mt-1">{teacher.joinedDate}</p>
                </div>
              )}

              {teacher.phone && (
                <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                  <p className="text-gray-500 font-medium">Phone</p>
                  <p className="text-[#0B4B31] font-semibold mt-1">{teacher.phone}</p>
                </div>
              )}
            </div>

            <div className="bg-white/60 rounded-xl p-4 border border-white/40 shadow-sm">
              <p className="text-gray-500 font-medium text-sm mb-3">Quick Actions</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(`/dashboard/team/teacher/${teacher._id}/detail`)}
                  className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  View Profile
                </button>
                <button
                  onClick={() => router.push(`/dashboard/team/teacher/${teacher._id}/edit`)}
                  className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}


        {teacher.showActions && (
          <div className={`flex gap-2 transition-all duration-300 ${isExpanded ? 'mt-4' : 'mt-3'
            }`}>
            <button
              onClick={() => onEdit?.(teacher)}
              className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete?.(teacher)}
              className="flex-1 rounded-full bg-[#0B4B31] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0B4B31]/90 hover:shadow-md flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;