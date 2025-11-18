"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function LearningPage() {
  const [searchValue, setSearchValue] = useState("");

  const tableData = []; // Empty for now as shown in screenshot

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000]  text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border-2 border-white text-[#0B4B31] px-4 py-2 text-sm font-normal bg-[#0B4B3138]"
        >
          <span className="text-lg text-[#0B4B31]">+</span>
          Add New Learning
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Learning</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90"
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
              className="w-full rounded-full border-2 border-white bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="rounded-full text-[#0B4B31] px-4 py-2 text-sm font-normal transition bg-[#0B4B3138]"
          >
            See All ↗
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Learning Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Description</th>
                <th className="px-4 font-normal text-[#0000008C]">Type</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 text-right font-normal text-[#0000008C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#0B4B31] font-normal">
                    No Data Available
                  </td>
                </tr>
              ) : (
                tableData.map((item) => (
                  <tr
                    key={item.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.name}</td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.description}</td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.type}</td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.status}</td>
                    <td className="px-4 py-3 text-right font-normal text-[#0000008C]">
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-[#71DD8C] transition hover:bg-[#0B4B31]/90">
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
          <div className="text-sm font-normal text-[#0000008C]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border-2 border-white bg-white px-4 py-2 text-sm font-normal text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>Display 10</option>
              <option>Display 20</option>
              <option>Display 50</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="rounded-full border-2 border-white bg-white px-3 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white">
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

