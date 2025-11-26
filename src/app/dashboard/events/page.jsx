"use client";

import React from "react";
import { Download, Search } from "lucide-react";

const mockEvents = [
  {
    id: 1,
    title: "Sports Day",
    message: "Sports Day – Join us for fun and competitions! Date: 22 Jan 2025 | Time: 09:00 AM",
    type: "SMS",
    audience: "Abdual Qari Class, Grade A",
    status: "Sent",
  },
  {
    id: 2,
    title: "Sports Day",
    message: "Sports Day – Join us for fun and competitions! Date: 22 Jan 2025 | Time: 09:00 AM",
    type: "SMS",
    audience: "Abdual Qari Class, Grade A",
    status: "Sent",
  },
];

export default function SendEventPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[2.5rem] font-semibold text-[#0B4B31]">
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000]">
          MaktabOS
        </p>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-sm sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[1.125rem] font-semibold text-[#0B4B31]">
            Send Event
          </h2>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a3f27]">
            <Download size={16} />
            Export Data
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 min-w-[220px] shadow-sm max-w-lg">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#0B4B31] hover:bg-[#F2F7F5]">
            See All ↗
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-normal uppercase tracking-wide text-[#979699]">
              <tr>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Title</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Message</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Type</th>
                <th className="px-4 py-2 font-normal text-[#0000008C]">Audience</th>
                <th className="px-4 py-2 font-normal text-[#0000008C] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockEvents.map((event) => (
                <tr
                  key={event.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm align-top"
                >
                  <td className="px-4 py-3 text-[#0B4B31] font-medium whitespace-nowrap">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] max-w-xl">
                    {event.message}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                    {event.type}
                  </td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                    {event.audience}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-normal text-white">
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#979699]">
            Showing {mockEvents.length} out of {mockEvents.length} entries
          </div>

          <div className="flex items-center gap-3 text-sm text-[#979699]">
            <span>Display</span>
            <span className="font-semibold text-[#0B4B31]">10</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full border border-[#0B4B3138] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                1
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-normal text-white">
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

