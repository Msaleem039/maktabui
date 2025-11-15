"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";

export default function ParentsWaitingListPage() {
  const [searchValue, setSearchValue] = useState("");

  const tableData = []; // Empty for now as shown in screenshot

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Parents/Guardians in Waiting List</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} className="text-white" />
              Export Data
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4">ID</th>
                <th className="px-4">Primary Parent</th>
                <th className="px-4">Data Added</th>
                <th className="px-4">Children</th>
                <th className="px-4">Action</th>
                <th className="px-4">Delete</th>
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
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">{parent.id}</td>
                    <td className="px-4 py-3 text-[#555]">{parent.primaryParent}</td>
                    <td className="px-4 py-3 text-[#555]">{parent.dataAdded}</td>
                    <td className="px-4 py-3 text-[#555]">{parent.children}</td>
                    <td className="px-4 py-3">
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90">
                        Take Action
                        <span>▾</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#F16957] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#F16957]/90">
                        <Trash2 size={14} />
                        Delete
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
          <div className="text-sm text-[#8A928F]">Showing 0 out of 0 entries</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8A928F]">Display</span>
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
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

