"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, Eye, Edit, MessageSquare, Trash2 } from "lucide-react";

const StudentTable = ({
  title = "Students (All Classes)",
  onSearchChange,
  searchValue = "",
  students = [],
}) => {
  const router = useRouter();
  const tableData = useMemo(() => {
    if (students.length > 0) return students;

    // Fallback demo data
    return Array.from({ length: 10 }, (_, index) => ({
      id: `student-${index + 1}`,
      name: "Milad Hersi",
      parentName: "Milad Hersi",
      phone: "123456789",
      class: "203 Abdirahman Jama Class",
    }));
  }, [students]);

  const [selectedId, setSelectedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const handleSearchChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  const handleRowSelect = (studentId) => {
    setSelectedId(studentId);
  };

  const toggleDropdown = (studentId, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === studentId ? null : studentId);
  };

  const handleActionClick = (action, studentId, event) => {
    event.stopPropagation();
    setOpenDropdownId(null);
    
    if (action === "view") {
      router.push(`/dashboard/student/${studentId}`);
    } else if (action === "edit") {
      router.push(`/dashboard/student/${studentId}/edit`);
    } else {
      console.log(`${action} clicked for student ${studentId}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actionMenuItems = [
    { label: "View Profile", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" },
    { label: "Comment", icon: MessageSquare, action: "comment" },
    { label: "Remove", icon: Trash2, action: "remove" },
  ];

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#104D2E]">{title}</h2>

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
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
            <tr>
              <th className="px-4">Student Name</th>
              <th className="px-4">Parent Names</th>
              <th className="px-4">Phone Number</th>
              <th className="px-4">Class</th>
              <th className="px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((student) => {
              const isSelected = student.id === selectedId;
              const isDropdownOpen = openDropdownId === student.id;
              return (
                <tr
                  key={student.id}
                  onClick={() => handleRowSelect(student.id)}
                  className={`group cursor-pointer rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm transition hover:shadow-md ${
                    isSelected ? "bg-[#C9DCD4] border-[#AECDBF]" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">
                    <div className="relative flex items-center gap-3 pl-3">
                      <span
                        className={`absolute left-0 inline-flex h-2 w-2 rounded-full transition ${
                          isSelected
                            ? "bg-[#0B4B31]"
                            : "bg-transparent group-hover:bg-[#0B4B31]/50"
                        }`}
                      ></span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                        👤
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/student/${student.id}`}
                          className="font-semibold text-[#0B4B31] transition hover:text-[#0B4B31]/70"
                        >
                          {student.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#555]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5EF] text-xs">
                        👤
                      </span>
                      {student.parentName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{student.phone}</td>
                  <td className="px-4 py-3 text-[#555]">{student.class}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(student.id, e)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                      >
                        Take Action
                        <span>▾</span>
                      </button>

                      {isDropdownOpen && (
                        <div
                          ref={(el) => (dropdownRefs.current[student.id] = el)}
                          className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                        >
                          {actionMenuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.action}
                                type="button"
                                onClick={(e) =>
                                  handleActionClick(item.action, student.id, e)
                                }
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] transition-all duration-150 ${
                                  index === 0
                                    ? ""
                                    : "border-t border-[#E2E7E4]"
                                } hover:bg-[#E5EFEB]`}
                              >
                                <Icon size={16} className="text-[#0B4B31]" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#8A928F]">
          Showing 1 to 10 of 50 entries
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
  );
};

export default StudentTable;

