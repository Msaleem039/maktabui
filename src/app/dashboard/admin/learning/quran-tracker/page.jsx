"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, Eye } from "lucide-react";

export default function QuranTrackerPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const router = useRouter();

  const tableData = Array.from({ length: 4 }, (_, index) => ({
    id: `tracker-${index + 1}`,
    teacherName: "Abdikabir Yusuf",
    students: "0%",
    currentSurah: "No Chapter",
  }));

  const handleViewDetails = (id) => {
    router.push(`/dashboard/admin/learning/quran-tracker/${id}`);
  };

  const handleAddNew = (id) => {
    console.log("Add new for:", id);
  };

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
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Classes</h2>

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex w-full max-w-xs items-center">
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value="">Select</option>
                <option value="teacher-1">Mohamed Karie</option>
                <option value="teacher-2">Abdikabir Yusuf</option>
              </select>
              <span className="pointer-events-none absolute right-4 text-[#0B4B31]">▾</span>
            </div>
            <button
              type="button"
              className="rounded-full border-2 border-white bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Teacher Summary Card */}
        <div className="mt-6 rounded-[18px] bg-[#E5EFEB] px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-normal text-[#0B4B31]">Teacher: Mohamed Karie</p>
              <p className="text-[0.6875rem] font-normal text-[#0B4B31]">Subject:</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-normal text-[#0B4B31]">51</p>
                <p className="text-[0.6875rem] font-normal text-[#0B4B31]">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-normal text-[#0B4B31]">0/51</p>
                <p className="text-[0.6875rem] font-normal text-[#0B4B31]">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Teacher Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Students</th>
                <th className="px-4 font-normal text-[#0000008C]">Current Surah</th>
                <th className="px-4 font-normal text-[#0000008C]">Actions</th>
                <th className="px-4 font-normal text-[#0000008C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr
                  key={item.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.teacherName}</td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.students}</td>
                  <td className="px-4 py-3 font-normal text-[#1e1e1e]">{item.currentSurah}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleAddNew(item.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                    >
                      <Plus size={14} />
                      Add New
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#E5EFEB] px-4 py-2 text-xs font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 1 out of 1 entries</div>
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
