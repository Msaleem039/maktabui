"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2, FileText, User, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignmentAgainstTeacher } from "@/redux/slices/assignmentSlices/assignmentSlices";
import { getCookie } from "cookies-next";

export default function TeacherAssignmentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const dropdownRefs = useRef({});
  const router = useRouter();
  const dispatch = useDispatch();

  const { 
    teacherAssignments, 
    teacherAssignmentsStatus, 
    teacherAssignmentsError 
  } = useSelector((state) => state.assignment);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  const actionMenuItems = [
    { label: "View Details", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" },
    { label: "Delete", icon: Trash2, action: "delete" },
  ];

  useEffect(() => {
    if (user?.role === "Teacher" && user?.id) {
      dispatch(getAssignmentAgainstTeacher({ teacherId: user.id }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (teacherAssignments && teacherAssignments.length > 0) {
      const filtered = teacherAssignments.filter((assignment) => {
        const searchLower = searchValue.toLowerCase();
        return (
          assignment.title?.toLowerCase().includes(searchLower) ||
          assignment.subject?.toLowerCase().includes(searchLower) ||
          assignment.type?.toLowerCase().includes(searchLower) ||
          assignment.class?.name?.toLowerCase().includes(searchLower) ||
          assignment.student?.studentName?.toLowerCase().includes(searchLower) ||
          assignment.student?.email?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]);
    }
  }, [searchValue, teacherAssignments]);

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

  const toggleStudentView = (id, event) => {
    event?.stopPropagation();
    setExpandedAssignmentId(expandedAssignmentId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    if (action === "view") {
      router.push(`/dashboard/assignments/${id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/assignments/${id}/edit`);
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this assignment?")) {
        console.log(`Delete assignment ${id}`);
        // Add delete assignment logic here
      }
    }
    setOpenDropdownId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubmissionStatus = (assignment) => {
    if (!assignment.solutions || assignment.solutions.length === 0) {
      return { text: "Not submitted", color: "text-red-600", count: 0 };
    }
    
    // Since student is a single object, check if there's any solution
    const hasSubmission = assignment.solutions.length > 0;
    
    if (hasSubmission) {
      return { text: "Submitted", color: "text-green-600", count: 1 };
    } else {
      return { text: "Not submitted", color: "text-red-600", count: 0 };
    }
  };

  const getStudentSubmissionStatus = (assignment) => {
    if (!assignment.solutions || assignment.solutions.length === 0) {
      return { submitted: false, text: "Not submitted", color: "text-red-600" };
    }
    
    // Since there's only one student, we can check the first solution
    const solution = assignment.solutions[0];
    if (solution) {
      return { 
        submitted: true, 
        text: "Submitted", 
        color: "text-green-600",
        submittedAt: solution.submittedAt ? formatDate(solution.submittedAt) : "Recently"
      };
    }
    return { submitted: false, text: "Not submitted", color: "text-red-600" };
  };

  // Loading state
  if (teacherAssignmentsStatus === 'loading') {
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
          {user?.role === "Teacher" && (
            <Link
              href="/dashboard/assignments/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
            >
              <span className="text-lg">+</span>
              Create New Assignment
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-[#0B4B31]">Loading assignments...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (teacherAssignmentsStatus === 'failed') {
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
          {user?.role === "Teacher" && (
            <Link
              href="/dashboard/assignments/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
            >
              <span className="text-lg">+</span>
              Create New Assignment
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">Error loading assignments: {teacherAssignmentsError}</p>
              <button
                onClick={() => user?.id && dispatch(getAssignmentAgainstTeacher({ teacherId: user.id }))}
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
        {user?.role === "Teacher" && (
          <Link
            href="/dashboard/assignments/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
          >
            <span className="text-lg">+</span>
            Create New Assignment
          </Link>
        )}
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">My Assignments</h2>

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
              placeholder="Search by title, subject, type, class, or student..."
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Assignment Title</th>
                <th className="px-4 font-normal text-[#0000008C]">Subject</th>
                <th className="px-4 font-normal text-[#0000008C]">Type</th>
                <th className="px-4 font-normal text-[#0000008C]">Class</th>
                <th className="px-4 font-normal text-[#0000008C]">Student</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Date</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const submissionStatus = getSubmissionStatus(assignment);
                  const studentSubmissionStatus = getStudentSubmissionStatus(assignment);
                  const isExpanded = expandedAssignmentId === assignment._id;

                  return (
                    <>
                      <tr
                        key={assignment._id}
                        className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm cursor-pointer hover:bg-[#F3F6F5] transition-colors"
                        onClick={(e) => toggleStudentView(assignment._id, e)}
                      >
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-[#0B4B31]" />
                            <span className="max-w-[200px] truncate">{assignment.title || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          {assignment.subject || "N/A"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          <span className="capitalize">{assignment.type || "N/A"}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          {assignment.class?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-[#0B4B31]" />
                            <span>{assignment.student?.studentName || "Unknown Student"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                          {assignment.dueDate ? formatDate(assignment.dueDate) : "No due date"}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <span className={studentSubmissionStatus.color}>
                            {studentSubmissionStatus.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => toggleStudentView(assignment._id, e)}
                              className="p-2 text-[#0B4B31] hover:bg-[#E5EFEB] rounded-full transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={(e) => toggleDropdown(assignment._id, e)}
                                className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                              >
                                Manage
                                <span>▾</span>
                              </button>

                              {openDropdownId === assignment._id && (
                                <div
                                  ref={(el) => (dropdownRefs.current[assignment._id] = el)}
                                  className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                                >
                                  {actionMenuItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                      <button
                                        key={item.action}
                                        type="button"
                                        onClick={(e) => handleActionClick(item.action, assignment._id, e)}
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
                          </div>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan="8" className="px-4 py-4 bg-[#F8FBFA] border-b border-l border-r border-[#E2E7E4] rounded-b-3xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Assignment Details */}
                              <div>
                                <h4 className="font-semibold text-[#0B4B31] mb-3">Assignment Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium text-[#8A928F]">Description:</span>
                                    <p className="text-[#1E1E1E] mt-1">{assignment.description || "No description"}</p>
                                  </div>
                                  <div className="flex gap-4">
                                    <div>
                                      <span className="font-medium text-[#8A928F]">Total Marks:</span>
                                      <p className="text-[#1E1E1E]">{assignment.totalMarks || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium text-[#8A928F]">Date Assigned:</span>
                                      <p className="text-[#1E1E1E]">{formatDate(assignment.dateAssigned)}</p>
                                    </div>
                                  </div>
                                  {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div>
                                      <span className="font-medium text-[#8A928F]">Attachments:</span>
                                      <div className="mt-1 space-y-1">
                                        {assignment.attachments.map((attachment, index) => (
                                          <a
                                            key={index}
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[#0B4B31] hover:underline"
                                          >
                                            <FileText size={14} />
                                            {attachment.name}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Student Details */}
                              <div>
                                <h4 className="font-semibold text-[#0B4B31] mb-3">Student Details</h4>
                                <div className="bg-white rounded-lg border border-[#E2E7E4] p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#0B4B31] rounded-full flex items-center justify-center">
                                      <User size={20} className="text-white" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-[#1E1E1E]">
                                        {assignment.student?.studentName || "Unknown Student"}
                                      </p>
                                      <p className="text-sm text-[#8A928F] flex items-center gap-1">
                                        <Mail size={14} />
                                        {assignment.student?.email || "No email"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-[#8A928F]">Submission Status:</span>
                                      <span className={`text-sm font-medium ${studentSubmissionStatus.color}`}>
                                        {studentSubmissionStatus.text}
                                      </span>
                                    </div>
                                    {studentSubmissionStatus.submittedAt && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#8A928F]">Submitted On:</span>
                                        <span className="text-sm text-[#1E1E1E]">
                                          {studentSubmissionStatus.submittedAt}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-[#8A928F]">
                    {teacherAssignments.length === 0 
                      ? "No assignments found. Create your first assignment!" 
                      : "No assignments match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAssignments.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {filteredAssignments.length} of {teacherAssignments.length} assignments
            </div>
            <div className="flex items-center gap-3">
              {/* <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
                <option>Display 10</option>
                <option>Display 20</option>
                <option>Display 50</option>
              </select> */}
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