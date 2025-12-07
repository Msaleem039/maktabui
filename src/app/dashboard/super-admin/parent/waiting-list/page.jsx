"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function ParentsWaitingListPage() {
  const [searchValue, setSearchValue] = useState("");

  const tableData = []; // Empty for now as shown in screenshot

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">

        {/* HEADING */}
        <h2 className="text-lg font-semibold text-[#104D2E] mb-4">
          Parents in Waiting List
        </h2>

        {/* EXPORT (TOP) */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* SEARCH (CENTER) */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>

          {/* SEE ALL (BOTTOM) */}
          <div className="flex justify-start">
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            >
              See All ↗
            </button>
          </div>
        </div>


        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Email</th>
                <th className="px-4 font-normal text-[#0000008C]">Phone</th>
                <th className="px-4 font-normal text-[#0000008C]">Children</th>
                <th className="px-4 font-normal text-[#0000008C]">Added</th>
                <th className="px-4 font-normal text-right text-[#0000008C]">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#0B4B31] font-medium">
                    No Data Available
                  </td>
                </tr>
              ) : (
                tableData.map((parent) => (
                  <tr
                    key={parent.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">{parent.name}</td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.email}</td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.phone}</td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.children}</td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.added}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90">
                        Take Action
                        <span>▾</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>Display 10</option>
              <option>Display 20</option>
              <option>Display 50</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
                1
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                2
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                3
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                4
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

