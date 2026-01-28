"use client";

import { Download, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const mockSchedules = [
  {
    id: 1,
    message:
      "Payment reminder: The monthly due date is approaching. Plan ahead and reach out to NASR Institute Management for queries. JAK!",
    time: "2025-11-01 10:00",
    type: "SMS",
  },
  {
    id: 2,
    message:
      "Payment reminder: The monthly due date is approaching. Plan ahead and reach out to NASR Institute Management for queries. JAK!",
    time: "2025-12-01 10:00",
    type: "SMS",
  },
];

export default function SchedulePage() {
  const { mainText } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[2.5rem] font-semibold text-[#0B4B31]">
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000]">
          {mainText || "MaktabOS"}
        </p>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-8">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-[1.125rem] font-semibold text-[#0B4B31]">
            Manage Text
          </h2>

          {/* Search Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center rounded-full border border-[#0B4B31] px-4 py-2 bg-white w-60">
              <Search size={16} className="text-[#799086] mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full text-sm text-[#0B4B31] bg-white placeholder:text-[#979699] focus:outline-none"
              />
            </div>

            {/* See All Button */}
            <div>
              <button
                type="button"
                className="rounded-full border border-[#0B4B3138] px-4 py-2 text-xs sm:text-sm font-normal text-[#0B4B31] transition hover:bg-[#F3F6F5] whitespace-nowrap"
              >
                See All ↗
              </button>
            </div>
          </div>
        </div>


        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-normal uppercase tracking-wide text-[#979699]">
              <tr>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Message</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Time</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Type</th>
                <th className="px-4 py-2 font-normal text-[#0000008C] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockSchedules.map((row) => (
                <tr
                  key={row.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm align-top"
                >
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] max-w-lg">
                    {row.message}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-normal text-[#71DD8C] transition ">
                      Take Action ▾
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#979699]">
            Showing 2 out of {mockSchedules.length} entries
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#979699]">Display 10</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-semibold text-white">
                1
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                2
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                3
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                4
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


