"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getGrades } from "@/redux/slices/gradeSlices/gradeSlices";
import { getCookie } from "cookies-next";

export default function GradesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filteredGrades, setFilteredGrades] = useState([]);
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

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    if (action === "view") {
      router.push(`/dashboard/grades/${id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/grades/${id}/edit`);
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this grade?")) {
        console.log(`Delete grade ${id}`);
        // TODO: Add API call to delete grade
      }
    }
    setOpenDropdownId(null);
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} className="text-white" />
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
                {user?.role === "Student" || user?.role === "Teacher" && (
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
                      <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={(e) => toggleDropdown(grade._id, e)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                          >
                            Take Action
                            <span>▾</span>
                          </button>

                          {openDropdownId === grade._id && (
                            <div
                              ref={(el) => (dropdownRefs.current[grade._id] = el)}
                              className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                            >
                              {actionMenuItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.action}
                                    type="button"
                                    onClick={(e) => handleActionClick(item.action, grade._id, e)}
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-[#8A928F]">
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
    </div>
  );
}