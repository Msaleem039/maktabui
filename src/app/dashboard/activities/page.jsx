"use client";

import { Download, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

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
  const { mainText } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            {mainText || "MaktabOS"}
          </h1>
        </div>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-8">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-[1.125rem] font-semibold text-[#0B4B31]">
            All Activity Logs
          </h2>


          {/* Search Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center rounded-full border border-[#0B4B31] px-4 py-2 bg-white w-72">
              <Search size={16} className="text-[#799086] mr-2" />
              <input
                type="text"
                placeholder="Search by Number"
                className="w-full bg-transparent text-sm text-[#0B4B31] placeholder:text-[#799086] focus:outline-none"
              />
            </div>

            {/* See All Button */}
            {/* <div>
              <button
                type="button"
                className="rounded-full border border-[#0B4B3138] px-4 py-2 text-xs sm:text-sm font-normal text-[#0B4B31] transition hover:bg-[#F3F6F5] whitespace-nowrap"
              >
                See All ↗
              </button>
            </div> */}
          </div>
        </div>


        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-normal uppercase tracking-wide text-[#979699]">
              <tr>
                <th className="px-4 py-2 font-normal text-[#0000008C]">ID</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Date</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">User</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Event Type</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Occurred</th>
              </tr>
            </thead>
            <tbody>
              {mockActivityData.map((row) => (
                <tr
                  key={row.id + row.date}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 text-[#0B4B31] font-normal">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">{row.date}</td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">{row.user}</td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                    {row.eventType}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#979699]">{row.occurred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#979699]">
            Showing 2 out of {mockActivityData.length} entries
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8A928F]">Display 10</span>
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


