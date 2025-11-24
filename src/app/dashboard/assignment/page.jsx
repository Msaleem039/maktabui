"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2, Upload, X, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignment, uploadSolution } from "@/redux/slices/assignmentSlices/assignmentSlices";
import { createGrade } from "@/redux/slices/gradeSlices/gradeSlices";
import { getCookie } from "cookies-next";

export default function AssignmentPage() {
    const [searchValue, setSearchValue] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [remarksModalOpen, setRemarksModalOpen] = useState(false);
    const [selectedAssignmentForRemarks, setSelectedAssignmentForRemarks] = useState(null);
    const [marksObtained, setMarksObtained] = useState("");
    const [feedback, setFeedback] = useState("");
    const dropdownRefs = useRef({});
    const router = useRouter();
    const dispatch = useDispatch();

    const { assignments, status, error, uploadSolutionStatus } = useSelector((state) => state.assignment);
    const { createStatus: gradeCreateStatus } = useSelector((state) => state.grade);

    const getTeacherId = (assignment) => {
        return assignment.teacher?._id || "teacher";
    };

    const user = useMemo(() => {
        const userCookie = getCookie("user");
        return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
    }, []);

    // Role-based action menu items
    const getActionMenuItems = () => {
        const baseItems = [
            { label: "View Detail", icon: Eye, action: "view" },
        ];

        if (user?.role === "Teacher") {
            return [
                ...baseItems,
                { label: "Edit", icon: Edit, action: "edit" },
                { label: "Add Remarks", icon: Star, action: "remarks" },
                { label: "Remove", icon: Trash2, action: "remove" },
            ];
        }

        return baseItems;
    };

    const actionMenuItems = getActionMenuItems();

    useEffect(() => {
        let requestData = {};

        if (user?.role === "Student" && user?.id) {
            requestData = { studentId: user.id };
        } else if (user?.role === "Teacher" && user?.id) {
            requestData = { teacherId: user.id };
        }

        dispatch(getAllAssignment(requestData));
    }, [dispatch, user]);

    useEffect(() => {
        if (assignments && assignments.length > 0) {
            const filtered = assignments.filter((assignment) => {
                const searchLower = searchValue.toLowerCase();
                return (
                    assignment.title?.toLowerCase().includes(searchLower) ||
                    assignment.subject?.toLowerCase().includes(searchLower) ||
                    assignment.type?.toLowerCase().includes(searchLower) ||
                    assignment.classId?.name?.toLowerCase().includes(searchLower)
                );
            });
            setFilteredAssignments(filtered);
        } else {
            setFilteredAssignments([]);
        }
    }, [searchValue, assignments]);

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
            router.push(`/dashboard/assignment/${id}`);
        } else if (action === "edit") {
            router.push(`/dashboard/assignment/${id}/edit`);
        } else if (action === "remarks") {
            const assignment = assignments.find(a => a._id === id);
            if (assignment) {
                handleRemarksClick(assignment, event);
            }
        } else if (action === "remove") {
            if (confirm("Are you sure you want to remove this assignment?")) {
                console.log(`Remove assignment ${id}`);
            }
        }
        setOpenDropdownId(null);
    };

    const handleUploadSolution = (assignment, event) => {
        event.stopPropagation();
        setSelectedAssignment(assignment);
        setUploadModalOpen(true);
        setUploadProgress(0);
        setUploadFile(null);
    };

    const handleRemarksClick = (assignment, event) => {
        event.stopPropagation();
        setSelectedAssignmentForRemarks(assignment);
        setRemarksModalOpen(true);
        setMarksObtained("");
        setFeedback("");

        // Pre-fill existing grade if available
        if (assignment.grades && assignment.grades.length > 0) {
            const existingGrade = assignment.grades[0];
            setMarksObtained(existingGrade.marksObtained?.toString() || "");
            setFeedback(existingGrade.feedback || "");
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'image/jpeg',
                'image/png'
            ];

            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!allowedTypes.includes(file.type)) {
                alert("Please upload a valid file type (PDF, DOC, DOCX, TXT, JPG, PNG)");
                return;
            }

            if (file.size > maxSize) {
                alert("File size must be less than 10MB");
                return;
            }

            setUploadFile(file);
        }
    };

    const uploadFileToSupabase = (file) => {
        const SUPABASE_URL = "https://rixdrbokebnvidwyzvzo.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGRyYm9rZWJudmlkd3l6dnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjMzMzIsImV4cCI6MjA0ODE5OTMzMn0.Zhnz5rLRoIhtHyF52pFjzYijNdxgZBvEr9LtOxR2Lhw";
        const fileName = `${Date.now()}_${file.name}`;

        return new Promise((resolve, reject) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    `${SUPABASE_URL}/storage/v1/object/maktab-system/${fileName}`
                );
                xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_KEY}`);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round(
                            (event.loaded / event.total) * 100
                        );
                        setUploadProgress(percentComplete);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/maktab-system/${fileName}`;
                        resolve({
                            name: file.name,
                            url: fileUrl,
                            size: file.size,
                            type: file.type,
                            fileName: fileName,
                            uploadedAt: new Date().toISOString()
                        });
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Upload failed"));
                };

                xhr.send(file);
            } catch (error) {
                reject(error);
            }
        });
    };

    const handleSubmitSolution = async () => {
        if (!uploadFile) {
            alert("Please select a file to upload");
            return;
        }

        if (!selectedAssignment) {
            alert("No assignment selected");
            return;
        }

        const studentId = selectedAssignment.student?._id;
        if (!studentId) {
            alert("Student information not found in assignment");
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const fileData = await uploadFileToSupabase(uploadFile);

            await dispatch(uploadSolution({
                assignmentId: selectedAssignment._id,
                studentId: studentId,
                file: fileData
            })).unwrap();

            alert("Solution uploaded successfully!");
            setUploadModalOpen(false);
            setUploadFile(null);
            setSelectedAssignment(null);
            setUploadProgress(0);

            dispatch(getAllAssignment());

        } catch (error) {
            console.error("Error uploading solution:", error);
            alert(`Failed to upload solution: ${error.message || "Please try again."}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmitRemarks = async () => {
        if (!selectedAssignmentForRemarks) {
            alert("No assignment selected");
            return;
        }

        if (!marksObtained || isNaN(marksObtained)) {
            alert("Please enter valid marks");
            return;
        }

        const studentId = selectedAssignmentForRemarks.student?._id;
        if (!studentId) {
            alert("Student information not found");
            return;
        }

        const teacherId = getTeacherId(selectedAssignmentForRemarks);

        try {
            await dispatch(createGrade({
                assignmentId: selectedAssignmentForRemarks._id,
                studentId: studentId,
                marksObtained: parseFloat(marksObtained),
                gradedBy: teacherId,
                feedback: feedback
            })).unwrap();

            alert("Remarks added successfully!");
            setRemarksModalOpen(false);
            setSelectedAssignmentForRemarks(null);
            setMarksObtained("");
            setFeedback("");

            // Refresh assignments to show updated grades
            dispatch(getAllAssignment());

        } catch (error) {
            console.error("Error adding remarks:", error);
            alert(`Failed to add remarks: ${error.message || "Please try again."}`);
        }
    };

    const removeSelectedFile = () => {
        setUploadFile(null);
        setUploadProgress(0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (dueDate) => {
        if (!dueDate) return { text: "No Due Date", style: "bg-gray-100 text-gray-600" };

        const today = new Date();
        const due = new Date(dueDate);
        const timeDiff = due.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff < 0) {
            return { text: "Overdue", style: "bg-red-100 text-red-600" };
        } else if (daysDiff === 0) {
            return { text: "Due Today", style: "bg-orange-100 text-orange-600" };
        } else if (daysDiff <= 7) {
            return { text: "Due Soon", style: "bg-yellow-100 text-yellow-600" };
        } else {
            return { text: "Upcoming", style: "bg-green-100 text-green-600" };
        }
    };

    const getSolutionStatus = (assignment) => {
        if (!assignment.solutions || !assignment.student?._id) return { text: "Not Submitted", style: "bg-gray-100 text-gray-600" };

        const solution = assignment.solutions.find(sol => sol.student === assignment.student._id);
        if (solution) {
            return { text: "Submitted", style: "bg-green-100 text-green-600" };
        }
        return { text: "Not Submitted", style: "bg-gray-100 text-gray-600" };
    };

    const getGradeStatus = (assignment) => {
        if (!assignment.grades || assignment.grades.length === 0) {
            return { text: "No Remarks", style: "bg-gray-100 text-gray-600" };
        }

        const grade = assignment.grades[0];
        const marks = grade.marksObtained;
        const totalMarks = assignment.totalMarks;

        if (marks >= totalMarks * 0.8) {
            return {
                text: `Excellent (${marks}/${totalMarks})`,
                style: "bg-green-100 text-green-600"
            };
        } else if (marks >= totalMarks * 0.6) {
            return {
                text: `Good (${marks}/${totalMarks})`,
                style: "bg-blue-100 text-blue-600"
            };
        } else if (marks >= totalMarks * 0.4) {
            return {
                text: `Average (${marks}/${totalMarks})`,
                style: "bg-yellow-100 text-yellow-600"
            };
        } else {
            return {
                text: `Needs Improvement (${marks}/${totalMarks})`,
                style: "bg-red-100 text-red-600"
            };
        }
    };

    // Show "Add New Assignment" button only for Teachers
    const renderAddAssignmentButton = () => {
        if (user?.role === "Teacher") {
            return (
                <Link
                    href="/dashboard/assignment/add"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
                >
                    <span className="text-lg">+</span>
                    Add New Assignment
                </Link>
            );
        }
        return null;
    };

    // Show Upload Solution button only for Students
    const renderUploadSolutionButton = (assignment) => {
        if (user?.role === "Student") {
            return (
                <button
                    type="button"
                    onClick={(e) => handleUploadSolution(assignment, e)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                >
                    <Upload size={16} />
                    Upload Solution
                </button>
            );
        }
        return null;
    };

    // Show Action dropdown only for Teachers
    const renderActionDropdown = (assignment) => {
        if (user?.role === "Teacher") {
            return (
                <div className="relative inline-block">
                    <button
                        type="button"
                        onClick={(e) => toggleDropdown(assignment._id, e)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                    >
                        Actions
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
            );
        }
        return null;
    };

    if (status === 'loading') {
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
                    {renderAddAssignmentButton()}
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

    if (error) {
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
                    {renderAddAssignmentButton()}
                </div>

                <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-red-600">Error loading assignments: {error}</p>
                            <button
                                onClick={() => dispatch(getAllAssignment())}
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
                    <h1 className="font-medium text-[#000000]  text-[1.75rem]">
                        MaktabOS
                    </h1>
                </div>
                {renderAddAssignmentButton()}
            </div>

            <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-[#104D2E]">Manage Assignments</h2>

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
                            placeholder="Search by title, subject, type, or class..."
                            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:bg-white"
                        />
                    </label>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
                        <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
                            <tr>
                                <th className="px-4 font-normal text-[#0000008C]">Title</th>
                                <th className="px-4 font-normal text-[#0000008C]">Subject</th>
                                <th className="px-4 font-normal text-[#0000008C]">Type</th>
                                <th className="px-4 font-normal text-[#0000008C]">Due Date</th>
                                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                                <th className="px-4 font-normal text-[#0000008C]">Total Marks</th>
                                <th className="px-4 font-normal text-[#0000008C]">Solution</th>
                                <th className="px-4 font-normal text-[#0000008C]">Remarks</th>
                                <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map((assignment) => {
                                    const statusBadge = getStatusBadge(assignment.dueDate);
                                    const solutionStatus = getSolutionStatus(assignment);
                                    const gradeStatus = getGradeStatus(assignment);

                                    return (
                                        <tr
                                            key={assignment._id}
                                            className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                                        >
                                            <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                                                {assignment.title || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                                                {assignment.subject || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                                                <span className="capitalize">{assignment.type || "N/A"}</span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                                                {formatDate(assignment.dueDate)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge.style}`}>
                                                    {statusBadge.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                                                {assignment.totalMarks || "N/A"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${solutionStatus.style}`}>
                                                    {solutionStatus.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${gradeStatus.style}`}>
                                                    {gradeStatus.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                                                <div className="flex items-center justify-end gap-2">
                                                    {renderUploadSolutionButton(assignment)}
                                                    {renderActionDropdown(assignment)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-[#8A928F]">
                                        {assignments.length === 0 ? "No assignments found." : "No assignments match your search."}
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
                            Showing {filteredAssignments.length} of {assignments.length} entries
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

            {/* Upload Solution Modal - Only show for Students */}
            {uploadModalOpen && user?.role === "Student" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#0B4B31]">
                                Upload Solution
                            </h3>
                            <button
                                onClick={() => setUploadModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {selectedAssignment && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-[#0B4B31]">{selectedAssignment.title}</h4>
                                <p className="text-sm text-gray-600">Subject: {selectedAssignment.subject}</p>
                                <p className="text-sm text-gray-600">Due: {formatDate(selectedAssignment.dueDate)}</p>
                                <p className="text-sm text-gray-600">Student: {selectedAssignment.student?.studentName}</p>
                                <p className="text-sm text-gray-600">Student ID: {selectedAssignment.student?._id}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    disabled={isUploading}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                                </p>
                            </div>

                            {uploadFile && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-800">
                                            {uploadFile.name}
                                        </span>
                                        <button
                                            onClick={removeSelectedFile}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={isUploading}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                        Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            )}

                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#0B4B31] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">
                                        Uploading... {uploadProgress}%
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setUploadModalOpen(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitSolution}
                                    disabled={!uploadFile || isUploading}
                                    className="flex-1 py-2 px-4 bg-[#0B4B31] text-white rounded-lg hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Solution'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Remarks Modal - Only show for Teachers */}
            {remarksModalOpen && user?.role === "Teacher" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#0B4B31]">
                                Add Remarks
                            </h3>
                            <button
                                onClick={() => setRemarksModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {selectedAssignmentForRemarks && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-[#0B4B31]">{selectedAssignmentForRemarks.title}</h4>
                                <p className="text-sm text-gray-600">Subject: {selectedAssignmentForRemarks.subject}</p>
                                <p className="text-sm text-gray-600">Total Marks: {selectedAssignmentForRemarks.totalMarks}</p>
                                <p className="text-sm text-gray-600">Student: {selectedAssignmentForRemarks.student?.studentName}</p>
                                <p className="text-sm text-gray-600">Teacher: {selectedAssignmentForRemarks.teacher?.fullName}</p>
                                <p className="text-sm text-gray-600">Teacher ID: {selectedAssignmentForRemarks.teacher?._id}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marks Obtained
                                </label>
                                <input
                                    type="number"
                                    value={marksObtained}
                                    onChange={(e) => setMarksObtained(e.target.value)}
                                    placeholder="Enter marks obtained"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    max={selectedAssignmentForRemarks?.totalMarks}
                                    step="0.1"
                                />
                                {selectedAssignmentForRemarks?.totalMarks && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Out of {selectedAssignmentForRemarks.totalMarks} total marks
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feedback
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Enter your feedback..."
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setRemarksModalOpen(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    disabled={gradeCreateStatus === 'loading'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitRemarks}
                                    disabled={!marksObtained || gradeCreateStatus === 'loading'}
                                    className="flex-1 py-2 px-4 bg-[#0B4B31] text-white rounded-lg hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {gradeCreateStatus === 'loading' ? 'Submitting...' : 'Submit Remarks'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}