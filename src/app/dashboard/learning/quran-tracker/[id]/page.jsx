"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Download, GraduationCap, CheckCircle2, XCircle } from "lucide-react";

export default function QuranTrackerDetailPage({ params }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const trackerData = useMemo(() => {
    return {
      id: params?.id || "tracker-1",
      studentName: "Abdiqadir Abdikadir",
      totalLessons: 0,
      passed: 0,
      failed: 0,
      completionProgress: 0,
      estimatedCompletion: "September 28, 2031",
      remainingVerses: 6236,
      remainingLessons: 624,
      avgVersesPerLesson: 10,
    };
  }, [params?.id]);

  const handleAddNewLesson = () => {
    router.push(`/dashboard/learning/quran-tracker/${trackerData.id}/add-lesson`);
  };

  const tableData = []; // Empty for now

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quran Tracker Header */}
          <div>
            <h2 className="text-lg font-semibold text-[#104D2E]">Quran Tracker</h2>
            <p className="text-sm font-normal text-[#0000008C]">
              Monitor and manage student Quran progress with ease.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5EFEB]">
                  <GraduationCap size={24} className="text-[#0B4B31]" />
                </div>
                <div>
                  <p className="text-sm font-normal text-[#0000008C]">Total Lesson</p>
                  <p className="text-2xl font-bold text-[#0B4B31]">{trackerData.totalLessons}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5EFEB]">
                  <CheckCircle2 size={24} className="text-[#0B4B31]" />
                </div>
                <div>
                  <p className="text-sm font-normal text-[#0000008C]">Passed</p>
                  <p className="text-2xl font-bold text-[#0B4B31]">{trackerData.passed}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5EFEB]">
                  <XCircle size={24} className="text-[#0B4B31]" />
                </div>
                <div>
                  <p className="text-sm font-normal text-[#0000008C]">Failed</p>
                  <p className="text-2xl font-bold text-[#0B4B31]">{trackerData.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quran Completion Progress */}
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#104D2E] mb-4">Quran Completion Progress</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#104D2E]">{trackerData.completionProgress}%</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B4B31] transition-all duration-300"
                  style={{ width: `${trackerData.completionProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Completion Projection */}
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#104D2E] mb-4">Completion Projection</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-semibold">Estimated Completion:</span> {trackerData.estimatedCompletion}
              </li>
              <li>
                <span className="font-semibold">Remaining Verses:</span> {trackerData.remainingVerses}
              </li>
              <li>
                <span className="font-semibold">Remaining Lessons:</span> {trackerData.remainingLessons}
              </li>
              <li>
                <span className="font-semibold">Avg. Verses/Lesson:</span> {trackerData.avgVersesPerLesson}
              </li>
            </ul>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-[#E5EFEB] px-6 py-8 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24 mb-4">
                <Image
                  src="/user-icon.svg"
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg font-normal text-[#000000] mb-6 text-center">
                {trackerData.studentName}
              </h3>
              <button
                onClick={handleAddNewLesson}
                className="w-full rounded-full bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90"
              >
                ADD NEW LESSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              placeholder="Q Search..."
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
                <th className="px-4 font-normal text-[#0000008C]">Date</th>
                <th className="px-4 font-normal text-[#0000008C]">Chapter No</th>
                <th className="px-4 font-normal text-[#0000008C]">Starting/Ending Verse</th>
                <th className="px-4 font-normal text-[#0000008C]">Comment</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Date</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#0B4B31] font-normal">
                    No Data Available
                  </td>
                </tr>
              ) : (
                tableData.map((item) => (
                  <tr
                    key={item.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.date}</td>
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.chapterNo}</td>
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.verses}</td>
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.comment}</td>
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.dueDate}</td>
                    <td className="px-4 py-3 font-normal text-[#0B4B31]">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

