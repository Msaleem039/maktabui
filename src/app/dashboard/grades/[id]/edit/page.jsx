"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getGradeById, updateGradeById, clearDetailStatus, clearUpdateStatus } from "@/redux/slices/gradeSlices/gradeSlices";
import { ArrowLeft, Save } from "lucide-react";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";

const gradeOptions = [
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "C+", value: "C+" },
  { label: "C", value: "C" },
  { label: "D+", value: "D+" },
  { label: "D", value: "D" },
  { label: "F", value: "F" },
];

const statusOptions = [
  { label: "Graded", value: "Graded" },
  { label: "Pending", value: "Pending" },
];

export default function EditGradePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentGrade, detailStatus, detailError, updateStatus, updateError } = useSelector((state) => state.grade);
  const [formData, setFormData] = useState({
    marksObtained: "",
    grade: "",
    status: "Graded",
    feedback: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (params?.id) {
      dispatch(getGradeById({ gradeId: params.id }));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (currentGrade) {
      setFormData({
        marksObtained: currentGrade.marksObtained?.toString() || "",
        grade: currentGrade.grade || "",
        status: currentGrade.status || "Graded",
        feedback: currentGrade.feedback || "",
      });
    }
  }, [currentGrade]);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      dispatch(clearDetailStatus());
      dispatch(clearUpdateStatus());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationError) setValidationError("");
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const selectOption = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
    // Clear validation error when user selects an option
    if (validationError) setValidationError("");
  };

  const validateForm = () => {
    if (!formData.marksObtained.trim()) {
      setValidationError("Marks obtained is required");
      return false;
    }

    const marks = parseFloat(formData.marksObtained);
    const totalMarks = currentGrade?.totalMarks || currentGrade?.assignment?.totalMarks;

    if (isNaN(marks) || marks < 0) {
      setValidationError("Marks obtained must be a valid non-negative number");
      return false;
    }

    if (totalMarks && marks > totalMarks) {
      setValidationError(`Marks obtained cannot exceed total marks (${totalMarks})`);
      return false;
    }

    if (!formData.grade.trim()) {
      setValidationError("Grade is required");
      return false;
    }

    if (!formData.status.trim()) {
      setValidationError("Status is required");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(updateGradeById({
        gradeId: params.id,
        marksObtained: parseFloat(formData.marksObtained),
        feedback: formData.feedback,
        gradedBy: currentGrade.gradedBy?._id // Use the original grader or get from auth context
      })).unwrap();

      // If update is successful, navigate back to view page
      if (result) {
        router.push(`/dashboard/grades/${params.id}`);
      }
    } catch (error) {
      // Error is handled by Redux, we'll display it below
      console.error("Failed to update grade:", error);
    }
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

  if (detailStatus === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading grade...</p>
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !currentGrade) {
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

  const assessmentInfo = getAssessmentInfo(currentGrade);

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
          onClick={() => router.push(`/dashboard/grades/${params.id}`)}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E] mb-6">Edit Grade</h2>

        {/* Error Messages */}
        {(validationError || updateError) && (
          <div className="mb-6 rounded-[18px] border border-red-300 bg-red-50 p-4">
            <p className="text-red-700 text-sm">
              {validationError || updateError}
            </p>
          </div>
        )}

        {/* Success Message */}
        {updateStatus === 'succeeded' && (
          <div className="mb-6 rounded-[18px] border border-green-300 bg-green-50 p-4">
            <p className="text-green-700 text-sm">
              Grade updated successfully!
            </p>
          </div>
        )}

        <div className="mb-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
          <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Grade Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-600">Student</p>
              <p className="font-medium text-[#1E1E1E]">{currentGrade.student?.studentName || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Assessment/Assignment</p>
              <p className="font-medium text-[#1E1E1E]">{assessmentInfo.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Marks</p>
              <p className="font-medium text-[#1E1E1E]">{assessmentInfo.totalMarks}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Graded By</p>
              <p className="font-medium text-[#1E1E1E]">{currentGrade.gradedBy?.fullName || "N/A"}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Marks Obtained"
              name="marksObtained"
              type="number"
              value={formData.marksObtained}
              onChange={handleInputChange}
              placeholder="Enter marks"
              required
              min="0"
              max={assessmentInfo.totalMarks}
              step="0.1"
            />

            <SimpleDropdown
              label="Grade"
              name="grade"
              value={formData.grade}
              options={gradeOptions}
              onSelect={selectOption}
              isOpen={openDropdown === "grade"}
              onToggle={toggleDropdown}
              placeholder="Select grade"
              required
            />

            <SimpleDropdown
              label="Status"
              name="status"
              value={formData.status}
              options={statusOptions}
              onSelect={selectOption}
              isOpen={openDropdown === "status"}
              onToggle={toggleDropdown}
              placeholder="Select status"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Enter feedback (optional)"
              rows="4"
              className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-[18px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
            />
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={updateStatus === "loading"}
              className={`flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition ${
                updateStatus === "loading"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
              }`}
            >
              <Save size={16} />
              {updateStatus === "loading" ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}