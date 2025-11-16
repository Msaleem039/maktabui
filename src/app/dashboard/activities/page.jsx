"use client";

import { Download, Search } from "lucide-react";

const mockActivityData = [
  {
    id: "293739",
    date: "November 14, 2025, 3:49 am",
    user: "MaktabOS institute (owner)",
    eventType: "archived parent: abdifatah garad",
    occurred: "2 months ago",
  },
  {
    id: "293738",
    date: "November 13, 2025, 2:12 pm",
    user: "MaktabOS institute (owner)",
    eventType: "created invoice: #6763",
    occurred: "2 months ago",
  },
  {
    id: "293737",
    date: "November 13, 2025, 1:02 pm",
    user: "MaktabOS institute (owner)",
    eventType: "updated student: Ahmed Ali",
    occurred: "2 months ago",
  },
];

export default function ActivitiesPage() {
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
            All Activity Logs
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center rounded-full border border-[#C5D2CD] px-4 py-2 bg-white min-w-[240px]">
              <Search size={16} className="text-[#799086] mr-2" />
              <input
                type="text"
                placeholder="Search by ID"
                className="w-full bg-transparent text-sm text-[#0B4B31] placeholder:text-[#799086] focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
              >
                <Download size={16} />
                Export Data
              </button>
              <button
                type="button"
                className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5] whitespace-nowrap"
              >
                See All ↗
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Event Type</th>
                <th className="px-4 py-2">Occurred</th>
              </tr>
            </thead>
            <tbody>
              {mockActivityData.map((row) => (
                <tr
                  key={row.id + row.date}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 text-[#0B4B31] font-medium">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-[#555]">{row.date}</td>
                  <td className="px-4 py-3 text-[#555]">{row.user}</td>
                  <td className="px-4 py-3 text-[#0B4B31]">
                    {row.eventType}
                  </td>
                  <td className="px-4 py-3 text-[#8A928F]">{row.occurred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">
            Showing 2 out of {mockActivityData.length} entries
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


