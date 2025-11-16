"use client";

import { Download, Search } from "lucide-react";

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
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E]">
          Welcome to
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E]">
          MaktabOS
        </p>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-[#104D2E]">
            Manage Text
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} />
              Export Data
            </button>

            <div className="flex items-center rounded-full border border-[#C5D2CD] px-4 py-2 bg-white min-w-[240px]">
              <Search size={16} className="text-[#799086] mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-[#0B4B31] placeholder:text-[#799086] focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5] whitespace-nowrap"
            >
              See All ↗
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockSchedules.map((row) => (
                <tr
                  key={row.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm align-top"
                >
                  <td className="px-4 py-3 text-[#555] max-w-lg">
                    {row.message}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
                      Take Action ▾
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">
            Showing 2 out of {mockSchedules.length} entries
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8A928F]">Display 10</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
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


