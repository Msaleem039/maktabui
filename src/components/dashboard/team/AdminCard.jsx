"use client";

import Image from "next/image";
import { Building2, User } from "lucide-react";

const AdminCard = ({ admin, isInstitute = false }) => {
  if (isInstitute) {
    return (
      <div className="relative h-[280px] rounded-[28px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/institute.svg"
            alt="Institute card background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {/* <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-[#0B4B31] rounded-sm"></div>
            ))}
          </div> */}
          {/* <span className="text-[#0B4B31] font-bold text-lg">MaktabOS</span> */}
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{admin.name}</h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center">
              <Building2 size={20} className="text-[#0B4B31]" />
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-[#0B4B31] text-xs">▾</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[280px] rounded-[28px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/proofile card 4.svg"
          alt="Admin card background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Avatar */}
      {/* <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
          {admin.photo ? (
            <Image src={admin.photo} alt={admin.name} width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {admin.name?.charAt(0) || "A"}
            </div>
          )}
        </div>
      </div> */}

      {/* Glassmorphism overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{admin.name}</h3>
            {admin.role && <p className="text-sm text-gray-600">({admin.role})</p>}
            <p className="text-sm text-gray-600">{admin.email}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center">
            <User size={20} className="text-[#0B4B31]" />
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-[#0B4B31] text-xs">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;

