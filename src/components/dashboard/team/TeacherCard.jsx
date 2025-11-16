"use client";

import Image from "next/image";
import { User, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
  return (
    <div className="relative h-[320px] rounded-[28px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/proofile card 4.svg"
          alt="Teacher card background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Avatar */}
      {/* <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
          {teacher.photo ? (
            <Image src={teacher.photo} alt={teacher.name} width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {teacher.name?.charAt(0) || "T"}
            </div>
          )}
        </div>
      </div> */}

      {/* Glassmorphism overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{teacher.name}</h3>
            {teacher.role && <p className="text-sm text-gray-600">({teacher.role})</p>}
            <p className="text-sm text-gray-600">{teacher.email}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center">
            <User size={20} className="text-[#0B4B31]" />
          </div>
        </div>

        {/* Stats badges */}
        {teacher.students !== undefined && (
          <div className="flex gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0B4B31] text-white text-xs font-semibold">
              Students ({teacher.students})
            </span>
            {teacher.lastLogin && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F16957] text-white text-xs font-semibold">
                Last Login : {teacher.lastLogin}
              </span>
            )}
          </div>
        )}

        {/* Class info */}
        {teacher.className && (
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-gray-900 text-xs font-semibold">
              Class : {teacher.className}
            </span>
          </div>
        )}

        {/* Action buttons */}
        {teacher.showActions && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit?.(teacher)}
              className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(teacher)}
              className="flex-1 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              Delete
            </button>
          </div>
        )}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-[#0B4B31] text-xs">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;

