"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWaitlistStudents,
  removeFromWaitlistStudent
} from "@/redux/slices/studentSlices/studentSlices";
import { ToggleRight,ToggleLeft } from "lucide-react";

export default function WaitlistTable() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [updatingStudentId, setUpdatingStudentId] = useState(null);

  const dispatch = useDispatch();

  const { students, status, error, pagination } = useSelector(
    (state) => state.waitlistStudents
  );

  const fetchWaitlistStudents = useCallback(() => {
    dispatch(getAllWaitlistStudents({ limit, page, search: debouncedSearch }));
  }, [dispatch, limit, page, debouncedSearch]);

  useEffect(() => {
    fetchWaitlistStudents();
  }, [fetchWaitlistStudents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleRemoveFromWaitlist = async (studentId) => {
    try {
      setUpdatingStudentId(studentId);
      await dispatch(removeFromWaitlistStudent(studentId)).unwrap();
      fetchWaitlistStudents();
    } catch (err) {
      console.error("Failed to remove from waitlist:", err);
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded-full px-4 py-2 text-sm font-semibold ${currentPage === 1
            ? "bg-[#0B4B31] text-white"
            : "border border-[#C5D2CD] bg-white text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          }`}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-start" className="px-2 text-[#0B4B31]">
          ...
        </span>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currentPage === i
                ? "bg-[#0B4B31] text-white"
                : "border border-[#C5D2CD] bg-white text-[#0B4B31] transition hover:bg-[#F3F6F5]"
              }`}
          >
            {i}
          </button>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis-end" className="px-2 text-[#0B4B31]">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${currentPage === totalPages
              ? "bg-[#0B4B31] text-white"
              : "border border-[#C5D2CD] bg-white text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-8">
            <div className="text-[#0B4B31] font-medium">
              Loading waitlist students...
            </div>
          </div>
        </section>
      </div>
    );
  }

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
          <h2 className="text-lg font-semibold text-[#104D2E]">
            Students in Waiting List
          </h2>

          <div className="flex flex-wrap items-center gap-3">
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
                <th className="px-4 font-normal text-center text-[#0000008C]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-[#0B4B31] font-medium"
                  >
                    {pagination.total === 0
                      ? "No Data Available"
                      : "No students match your search"}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">
                      {student.studentName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {calculateAge(student.dateOfBirth)}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.gender || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.phone || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {student.class?.name || student.class?.join(", ") || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWaitlist(student._id, student, student.addToWaitList);
                        }}
                        disabled={updatingStudentId === student._id}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal transition ${student.addToWaitList
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          } ${updatingStudentId === student._id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {updatingStudentId === student._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : student.addToWaitList ? (
                          <ToggleRight className="text-green-600" size={18} />
                        ) : (
                          <ToggleLeft className="text-gray-400" size={18} />
                        )}
                        {student.addToWaitList ? "On Waitlist" : "Off Waitlist"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">
            Showing {students.length} of {pagination.total} entries
            {debouncedSearch && " (filtered)"}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            >
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] ${pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                ‹
              </button>

              {renderPageButtons()}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] ${pagination.page === pagination.totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}