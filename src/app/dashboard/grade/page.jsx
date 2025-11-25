"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getGrades } from "@/redux/slices/gradeSlices/gradeSlices";
import { getCookie } from "cookies-next";

export default function GradesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, grade: null });
  const dropdownRefs = useRef({});
  const router = useRouter();
  const dispatch = useDispatch();

  const { grades, status, error } = useSelector((state) => state.grade);
  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);
  const actionMenuItems = [
    { label: "View Details", icon: Eye, action: "view" },
    { label: "Edit Grade", icon: Edit, action: "edit" },
    { label: "Delete Grade", icon: Trash2, action: "delete" },
  ];

  useEffect(() => {
    let requestData = {};

    if (user?.role === "Student" && user?.id) {
      requestData = { studentId: user.id };
    } else if (user?.role === "Teacher" && user?.id) {
      requestData = { teacherId: user.id };
    }

    dispatch(getGrades(requestData));

  }, [dispatch, user]);

  useEffect(() => {
    if (grades && grades.length > 0) {
      const filtered = grades.filter((grade) => {
        const searchLower = searchValue.toLowerCase();
        return (
          grade.student?.studentName?.toLowerCase().includes(searchLower) ||
          grade.assessment?.title?.toLowerCase().includes(searchLower) ||
          grade.assignment?.title?.toLowerCase().includes(searchLower) ||
          grade.marksObtained?.toString().includes(searchLower) ||
          grade.gradedBy?.fullName?.toLowerCase().includes(searchLower) ||
          grade.grade?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredGrades(filtered);
    } else {
      setFilteredGrades([]);
    }
  }, [searchValue, grades]);

  useEffect(() => {
    if (!openDropdownId) return;

    const handleClickOutside = (event) => {
      const dropdownRef = dropdownRefs.current[openDropdownId];
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    // Add event listener after a small delay to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    if (action === "view") {
      setOpenDropdownId(null);
      router.push(`/dashboard/grades/${id}`);
    } else if (action === "edit") {
      setOpenDropdownId(null);
      router.push(`/dashboard/grades/${id}/edit`);
    } else if (action === "delete") {
      const grade = filteredGrades.find((g) => g._id === id);
      setOpenDropdownId(null);
      setDeleteModal({ open: true, grade });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.grade) {
      console.log("Delete grade:", deleteModal.grade._id);
      // TODO: Implement delete grade logic
      // dispatch(deleteGradeAction(deleteModal.grade._id));
      setDeleteModal({ open: false, grade: null });
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate percentage based on marks obtained and total marks
  const calculatePercentage = (marksObtained, totalMarks) => {
    if (!totalMarks || totalMarks === 0) return "N/A";
    const percentage = (marksObtained / totalMarks) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // Get color class for grade badge
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

  // Get assessment title and total marks
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

  // Loading state
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

  // Error state
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
              placeholder="Search by student name, assessment, marks, or grade..."
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:bg-white"
            />
          </label>
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
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => {
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
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div 
                            ref={(el) => (dropdownRefs.current[grade._id] = el)}
                            className="relative inline-block text-left"
                          >
                            <button
                              type="button"
                              onClick={(e) => toggleDropdown(grade._id, e)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                            >
                              Take Action
                              <span>▾</span>
                            </button>

                            {openDropdownId === grade._id && (
                              <div
                                onClick={(event) => event.stopPropagation()}
                                className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#00000040] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                              >
                                <button
                                  type="button"
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 bg-[#0B4B3138] hover:bg-[#E5EFEB]"
                                  onClick={(e) => handleActionClick("view", grade._id, e)}
                                >
                                  <Eye size={16} className="text-[#0B4B31]" />
                                  View Details
                                </button>
                                <button
                                  type="button"
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                                  onClick={(e) => handleActionClick("edit", grade._id, e)}
                                >
                                  <Edit size={16} className="text-[#0B4B31]" />
                                  Edit Grade
                                </button>
                                <button
                                  type="button"
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                                  onClick={(e) => handleActionClick("delete", grade._id, e)}
                                >
                                  <Trash2 size={16} className="text-[#C43B30]" />
                                  Delete Grade
                                </button>
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
                    {grades.length === 0 ? "No grades found." : "No grades match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredGrades.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {filteredGrades.length} of {grades.length} entries
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
                <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                  1
                </button>
                <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
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
        )}
      </section>

      {/* Delete Confirmation Modal */}
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
                  Delete Grade
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