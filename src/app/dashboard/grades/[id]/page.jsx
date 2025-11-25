"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getGradeById, clearDetailStatus } from "@/redux/slices/gradeSlices/gradeSlices";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function ViewGradePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentGrade, detailStatus, detailError } = useSelector((state) => state.grade);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    if (params?.id) {
      dispatch(getGradeById({ gradeId: params.id }));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (currentGrade) {
      setGrade(currentGrade);
    }
  }, [currentGrade]);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      dispatch(clearDetailStatus());
    };
  }, [dispatch]);

  const calculatePercentage = (marksObtained, totalMarks) => {
    if (!totalMarks || totalMarks === 0) return "N/A";
    const percentage = (marksObtained / totalMarks) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getAssessmentInfo = (grade) => {
    if (grade?.assessment) {
      return {
        title: grade.assessment.title || "N/A",
        totalMarks: grade.assessment.totalMarks || "N/A"
      };
    } else if (grade?.assignment) {
      return {
        title: grade.assignment.title || "N/A",
        totalMarks: grade.assignment.totalMarks || "N/A"
      };
    }
    return { title: "N/A", totalMarks: "N/A" };
  };

  const getGradeColorClass = (grade) => {
    switch (grade) {
      case "A+": return "bg-green-100 text-green-800";
      case "A": return "bg-green-50 text-green-700";
      case "B+": return "bg-blue-100 text-blue-800";
      case "B": return "bg-blue-50 text-blue-700";
      case "C+": return "bg-yellow-100 text-yellow-800";
      case "C": return "bg-yellow-50 text-yellow-700";
      case "D+": return "bg-orange-100 text-orange-800";
      case "D": return "bg-orange-50 text-orange-700";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (detailStatus === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading grade details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !grade) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">
              {detailError || "Grade not found"}
            </p>
            <button
              onClick={() => router.push('/dashboard/grade')}
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Grades
            </button>
          </div>
        </div>
      </div>
    );
  }

  const assessmentInfo = getAssessmentInfo(grade);
  const percentage = calculatePercentage(grade.marksObtained, assessmentInfo.totalMarks);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard/grade')}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => router.push(`/dashboard/grades/${grade._id}/edit`)}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <Edit size={16} />
          Edit Grade
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E] mb-6">Grade Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Student Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Student Name</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {grade.student?.studentName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {grade.student?.email || "N/A"}
                </p>
              </div>
              {grade.student?.rollNumber && (
                <div>
                  <p className="text-xs text-gray-600">Roll Number</p>
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    {grade.student.rollNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Assessment Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Assessment/Assignment</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {assessmentInfo.title}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Subject</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {grade.assignment?.subject || grade.assessment?.subject || "N/A"}
                </p>
              </div>
              {grade.assignment?.class && (
                <div>
                  <p className="text-xs text-gray-600">Class</p>
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    {grade.assignment.class.name || grade.assignment.class.code || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Grade Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Marks Obtained</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {grade.marksObtained} / {assessmentInfo.totalMarks}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Percentage</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {percentage}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Grade</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getGradeColorClass(grade.grade)}`}>
                  {grade.grade || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  grade.status === "Graded" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {grade.status || "Pending"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Graded By</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {grade.gradedBy?.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Graded Date</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(grade.gradedAt || grade.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {grade.feedback && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-3">Feedback</h3>
            <p className="text-sm text-[#1E1E1E]">{grade.feedback}</p>
          </div>
        )}
      </section>
    </div>
  );
}