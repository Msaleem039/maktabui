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
  console.log("students", students);
  
  const router = useRouter();
  
  // Transform the API data to match table structure
  const transformedStudents = useMemo(() => {
    return students.map((student) => ({
      id: student._id,
      name: student.studentName,
      parentName: student.parent?.fullName || "N/A",
      phone: student.phone,
      class: student.class?.[0] || "N/A", // Take first class if array
      email: student.email,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      enrollDate: student.enrollDate,
      fee: student.fee,
      // Include original student data for potential use
      originalData: student
    }));
  }, [students]);

  const tableData = useMemo(() => {
    if (transformedStudents.length > 0) return transformedStudents;

    // Fallback dummy data when no students
    return Array.from({ length: 10 }, (_, index) => ({
      id: `student-${index + 1}`,
      name: "Milad Hersi",
      parentName: "Milad Hersi",
      phone: "123456789",
      class: "203 Abdirahman Jama Class",
    }));
  }, [transformedStudents]);

  const [selectedId, setSelectedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const [commentStudentId, setCommentStudentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Filter students based on search value
  const filteredStudents = useMemo(() => {
    if (!searchValue) return tableData;
    
    const lowerSearch = searchValue.toLowerCase();
    return tableData.filter(student => 
      student.name?.toLowerCase().includes(lowerSearch) ||
      student.parentName?.toLowerCase().includes(lowerSearch) ||
      student.email?.toLowerCase().includes(lowerSearch) ||
      student.phone?.includes(searchValue) ||
      student.class?.toLowerCase().includes(lowerSearch)
    );
  }, [tableData, searchValue]);

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
    } else if (action === "comment") {
      setCommentStudentId(studentId);
      setCommentText("");
    } else if (action === "remove") {
      if (confirm("Are you sure you want to remove this student?")) {
        console.log("Remove student:", studentId);
        // Add your remove student logic here
      }
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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
            placeholder="Search by name, parent, email, phone, or class..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-normal uppercase tracking-wide text-[#00000066]">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Student Name</th>
              <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
              <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
              <th className="px-4 font-normal text-[#0000008C]">Class</th>
              <th className="px-4 font-normal text-[#0000008C]">Email</th>
              <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
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
                        {student.gender === "Female" ? "👩" : "👨"}
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/student/${student.id}`}
                          className="font-medium text-[#1E1E1E] transition hover:text-[#0B4B31]/70"
                        >
                          {student.name}
                        </Link>
                        <span className="text-xs text-[#666]">
                          {student.gender} • {formatDate(student.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5EF] text-xs">
                        👤
                      </span>
                      <span className="font-medium text-[#1E1E1E]">{student.parentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm">{student.phone}</td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm">{student.class}</td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm text-xs">
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(student.id, e)}
                        className="inline-flex items-center gap-2 rounded-full text-[#71DD8C] bg-[#0B4B31] px-4 py-2 text-sm font-normal transition hover:bg-[#0B4B31]/90"
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

      {/* Show message when no students found */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-8 text-[#666]">
          {students.length === 0 ? "No students found" : "No students match your search"}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#8A928F]">
          Showing {filteredStudents.length} of {students.length} students
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

      {commentStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-[#0B4B31]">
              Add Comment
            </h3>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#799086]">
              {commentStudentId}
            </p>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment about this student..."
              className="mb-4 h-32 w-full resize-none rounded-xl border border-[#C5D2CD] bg-[#F7FAF8] p-3 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCommentStudentId(null);
                  setCommentText("");
                }}
                className="rounded-full border border-[#0B4B31]/20 px-4 py-2 text-sm font-semibold text-[#0B4B31] hover:bg-[#F3F6F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Comment saved for", commentStudentId, commentText);
                  setCommentStudentId(null);
                  setCommentText("");
                }}
                className="rounded-full bg-[#0B4B31] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0B4B31]/90"
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentTable;