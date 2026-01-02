"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getGrades, setGradesPage } from "@/redux/slices/gradeSlices/gradeSlices";
import { getCookie } from "cookies-next";

export default function GradesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, grade: null });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [dropdownDirections, setDropdownDirections] = useState({});
  const [dropdownPositions, setDropdownPositions] = useState({});
  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});
  const router = useRouter();
  const dispatch = useDispatch();

  const { grades, status, error, pagination } = useSelector((state) => state.grade);
  console.log("grades",grades);
  
  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  const currentPage = pagination?.currentPage || 1;

  useEffect(() => {
    let requestData = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchInput) {
      requestData.search = searchInput;
    }

    if (user?.role === "Student" && user?.id) {
      requestData.studentId = user.id;
    } else if (user?.role === "Teacher" && user?.id) {
      requestData.teacherId = user.id;
    }

    dispatch(getGrades(requestData));
  }, [dispatch, user, currentPage, itemsPerPage, searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchInput(searchValue);
      dispatch(setGradesPage(1));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          // Check if click is on the button
          const isButtonClick = Object.values(buttonRefs.current).some(
            (buttonRef) => buttonRef && buttonRef.contains(event.target)
          );
          if (!isButtonClick) {
            setOpenDropdownId(null);
          }
        }
      });
    };

    const handleScroll = () => {
      // Close dropdown on scroll
      setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    const isOpening = openDropdownId !== id;

    if (isOpening && typeof window !== "undefined") {
      const button = event.currentTarget;
      const buttonRect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      const dropdownHeight = 120; // Approximate height of dropdown with 2 items
      const dropdownWidth = 180;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      // Calculate position
      let top, left, right;
      
      if (shouldOpenUp) {
        top = buttonRect.top - dropdownHeight - 8; // 8px margin
      } else {
        top = buttonRect.bottom + 8; // 8px margin
      }

      // Align to right edge of button
      right = viewportWidth - buttonRect.right;
      
      // Ensure dropdown stays within viewport
      if (right + dropdownWidth > viewportWidth) {
        right = viewportWidth - dropdownWidth - 8;
      }
      if (right < 8) {
        right = 8;
      }

      setDropdownDirections((prev) => ({
        ...prev,
        [id]: shouldOpenUp ? "up" : "down",
      }));

      setDropdownPositions((prev) => ({
        ...prev,
        [id]: { top, right },
      }));
    } else {
      setDropdownDirections((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDropdownPositions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }

    setOpenDropdownId(isOpening ? id : null);
  };

  const handleActionClick = (action, grade, event) => {
    event.stopPropagation();
    if (action === "view") {
      router.push(`/dashboard/grades/${grade._id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/grades/${grade._id}/edit`);
    } else if (action === "delete") {
      setDeleteModal({ open: true, grade });
    }
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (deleteModal.grade) {
      setDeleteModal({ open: false, grade: null });
    }
  };

  const handlePageChange = (page) => {
    dispatch(setGradesPage(page));
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);
    setItemsPerPage(newLimit);
    dispatch(setGradesPage(1));
  };

  const getPageNumbers = () => {
    if (!pagination?.totalPages) return [];

    const pages = [];
    const current = currentPage;
    const total = pagination.totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  };

  const getDisplayRange = () => {
    const totalCount = pagination?.totalCount || 0;
    if (totalCount === 0) return { start: 0, end: 0 };

    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalCount);

    return { start, end };
  };

  const { start, end } = getDisplayRange();
  const totalCount = pagination?.totalCount || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculatePercentage = (marksObtained, totalMarks) => {
    if (!totalMarks || totalMarks === 0) return "N/A";
    const percentage = (marksObtained / totalMarks) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getGradeColorClass = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-green-50 text-green-700";
      case "B+":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-blue-50 text-blue-700";
      case "C+":
        return "bg-yellow-100 text-yellow-800";
      case "C":
        return "bg-yellow-50 text-yellow-700";
      case "D+":
        return "bg-orange-100 text-orange-800";
      case "D":
        return "bg-orange-50 text-orange-700";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAssessmentInfo = (grade) => {
    if (grade.assessment) {
      return {
        title: grade.assessment.title || "N/A",
        totalMarks: grade.assessment.totalMarks || "N/A"
      };
    } else if (grade.assignment) {
      return {
        title: grade.assignment.title || "N/A",
        totalMarks: grade.assignment.totalMarks || "N/A"
      };
    }
    return { title: "N/A", totalMarks: "N/A" };
  };

  const actionMenuItems = [
    { label: "View Details", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" }
  ];

  if (status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              MaktabOS
            </h1>
          </div>
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-[#0B4B31]">Loading grades...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              MaktabOS
            </h1>
          </div>
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">Error loading grades: {error}</p>
              <button
                onClick={() => dispatch(getGrades())}
                className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Grades</h2>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by student name, assessment, marks, or grade..."
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:bg-white"
            />
          </label>

          {/* See All Button */}
          {/* <div>
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            >
              See All ↗
            </button>
          </div> */}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Student</th>
                <th className="px-4 font-normal text-[#0000008C]">Assessment</th>
                <th className="px-4 font-normal text-[#0000008C]">Marks</th>
                <th className="px-4 font-normal text-[#0000008C]">Percentage</th>
                <th className="px-4 font-normal text-[#0000008C]">Grade</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Graded By</th>
                <th className="px-4 font-normal text-[#0000008C]">Date</th>
                {(user?.role === "Admin" || user?.role === "Super Admin" || user?.role === "Teacher") && (
                  <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {grades && grades.length > 0 ? (
                grades.map((grade) => {
                  const assessmentInfo = getAssessmentInfo(grade);
                  const percentage = calculatePercentage(grade.marksObtained, assessmentInfo.totalMarks);

                  return (
                    <tr
                      key={grade._id}
                      className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                    >
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        <div>
                          <div className="font-semibold">{grade.student?.studentName || "N/A"}</div>
                          <div className="text-xs text-gray-500">{grade.student?.email || ""}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        {assessmentInfo.title}
                        {grade.assignment?.subject && (
                          <div className="text-xs text-gray-500">{grade.assignment.subject}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        {grade.marksObtained} / {assessmentInfo.totalMarks}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        {percentage}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getGradeColorClass(grade.grade)}`}>
                          {grade.grade || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${grade.status === "Graded"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {grade.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        {grade.gradedBy?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                        {formatDate(grade.createdAt)}
                      </td>
                      {(user?.role === "Admin" || user?.role === "Super Admin" || user?.role === "Teacher") && (
                        <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                          <div className="relative inline-block text-left">
                            <button
                              ref={(el) => (buttonRefs.current[grade._id] = el)}
                              type="button"
                              onClick={(e) => toggleDropdown(grade._id, e)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                            >
                              Take Action
                              <span>▾</span>
                            </button>

                            {openDropdownId === grade._id && (
                              <div
                                ref={(el) => {
                                  dropdownRefs.current[grade._id] = el;
                                }}
                                style={{
                                  position: 'fixed',
                                  top: `${dropdownPositions[grade._id]?.top || 0}px`,
                                  right: `${dropdownPositions[grade._id]?.right || 0}px`,
                                  zIndex: 9999,
                                }}
                                className="min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                              >
                                {actionMenuItems.map((item, idx) => {
                                  const Icon = item.icon;
                                  return (
                                    <button
                                      key={item.action}
                                      type="button"
                                      onClick={(e) => handleActionClick(item.action, grade, e)}
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] transition-all duration-150 ${idx === 0 ? "" : "border-t border-[#E2E7E4]"
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
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={(user?.role === "Admin" || user?.role === "Super Admin" || user?.role === "Teacher") ? "9" : "8"} className="px-4 py-8 text-center text-[#8A928F]">
                    {searchInput ? "No grades match your search." : "No grades found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Updated Pagination */}
        {pagination && totalCount > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {start} to {end} of {totalCount} entries
              {searchInput && " (filtered)"}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value={10}>Display 10</option>
                <option value={20}>Display 20</option>
                <option value={50}>Display 50</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasPrev ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ‹
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === "..."}
                    className={`rounded-full border border-[#C5D2CD] px-4 py-2 text-sm transition ${page === currentPage
                        ? 'bg-[#0B4B31] text-white border-[#0B4B31]'
                        : page === "..."
                          ? 'bg-white text-[#0B4B31] cursor-default'
                          : 'bg-white text-[#0B4B31] hover:bg-[#F3F6F5]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasNext ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {deleteModal.open && deleteModal.grade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteModal({ open: false, grade: null });
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-[#0B4B31]">
                  Remove
                </h2>
              </div>
              <button
                onClick={() => setDeleteModal({ open: false, grade: null })}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to delete the grade for <span className="font-semibold text-[#0B4B31]">{deleteModal.grade.student?.studentName || "this student"}</span>?
              </p>
              <p className="text-xs text-red-600">
                This action cannot be undone. The grade will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setDeleteModal({ open: false, grade: null })}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}