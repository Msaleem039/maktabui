"use client";

import React from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown } from "lucide-react";
import CommunicationPanel from "@/components/dashboard/CommunicationPanel";

const CommunicationPage = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Grid size={18} className="text-[#0B4B31]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Moon size={18} className="text-[#0B4B31]" />
            </button>
            <div className="flex items-center gap-2 bg-white border border-[#0B4B31] rounded-full px-2 py-1.5 pr-3 cursor-pointer hover:bg-emerald-50 shadow-sm">
              <div className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden">
                <Image
                  src="/main-dashboard.jpg"
                  alt="user"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">
                Ahmed J.
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <p className="text-[2.5rem] font-semibold text-[#0B4B31] leading-tight">
          Communication Center
        </p>
        <p className="text-[1.25rem] text-[#5E6C64]">
          Seamless conversations between administrators, teachers, parents, and students
        </p>
      </div>

      <CommunicationPanel
        panelTitle="Live Conversations"
        subtitle="Monitor, reply, and collaborate across roles"
      />
    </div>
  );
};

export default CommunicationPage;

