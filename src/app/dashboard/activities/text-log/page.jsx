"use client";

import { Download, Search } from "lucide-react";

const mockTextLogData = [
  {
    id: 1,
    from: "+18559333073",
    to: "19526879458",
    message:
      "Thanks for your payment of 140.00 on 11-09-2025.\nYour Receipt # is 6763.\n--------------------\nMaktabOS Institute",
    dateSent: "Sat, 01 Nov 2025 10:00:00 +0000",
    direction: "outbound-api",
    status: "delivered",
    error: "No Error",
  },
  {
    id: 2,
    from: "+18559333073",
    to: "19526879458",
    message:
      "Thanks for your payment of 140.00 on 11-09-2025.\nYour Receipt # is 6763.\n--------------------\nMaktabOS Institute",
    dateSent: "Sat, 01 Nov 2025 10:00:00 +0000",
    direction: "outbound-api",
    status: "delivered",
    error: "No Error",
  },
];

export default function TextLogPage() {
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
                placeholder="Search by Number"
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
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Data Sent</th>
                <th className="px-4 py-2">Direction</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {mockTextLogData.map((row) => (
                <tr
                  key={row.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm align-top"
                >
                  <td className="px-4 py-3 text-[#0B4B31] font-medium whitespace-nowrap">
                    {row.from}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-pre-line max-w-xs sm:max-w-md">
                    {row.message}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-nowrap">
                    {row.to}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-nowrap">
                    {row.dateSent}
                  </td>
                  <td className="px-4 py-3 text-[#555] whitespace-nowrap">
                    {row.direction}
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium whitespace-nowrap">
                    {row.status}
                  </td>
                  <td className="px-4 py-3 text-[#8A928F] whitespace-nowrap">
                    {row.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">
            Showing 2 out of {mockTextLogData.length} entries
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


