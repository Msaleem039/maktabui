"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWaitlistStudents } from "@/redux/slices/studentSlices/studentSlices";

export default function WaitlistTable() {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  
  const { students, status, error } = useSelector((state) => state.waitlistStudents);
  console.log("students", students);

  useEffect(() => {
    dispatch(getAllWaitlistStudents());
  }, [dispatch]);

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchValue.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.phone?.includes(searchValue) ||
      calculateAge(student.dateOfBirth)?.toString().includes(searchValue) ||
      student.gender?.toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (status === "loading") {
    return (
      <div className="space-y-8">
        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-8">
            <div className="text-[#0B4B31] font-medium">Loading waitlist students...</div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div className="space-y-8">
        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600 font-medium">Error: {error}</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Students in Waiting List</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} />
              Export Data
            </button>
            <button
            type="button"
            className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by student name, email, phone, age, or gender..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Student Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Email</th>
                <th className="px-4 font-normal text-[#0000008C]">Age</th>
                <th className="px-4 font-normal text-[#0000008C]">Gender</th>
                <th className="px-4 font-normal text-[#0000008C]">Phone</th>
                <th className="px-4 font-normal text-[#0000008C]">Class</th>
                <th className="px-4 font-normal text-[#0000008C]">Added</th>
                <th className="px-4 font-normal text-right text-[#0000008C]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-[#0B4B31] font-medium">
                    {students.length === 0 ? "No Data Available" : "No students match your search"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">
                      {student.studentName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {calculateAge(student.dateOfBirth)}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.gender || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.class?.join(', ') || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {formatDate(student.createdAt)}
                    </td>
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
          <div className="text-sm text-[#8A928F]">
            Showing {filteredStudents.length} of {students.length} entries
          </div>
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