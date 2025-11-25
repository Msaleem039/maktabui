"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getGrades, createGrade } from "@/redux/slices/gradeSlices/gradeSlices";
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
  const { grades, status, createStatus } = useSelector((state) => state.grade);
  const [grade, setGrade] = useState(null);
  const [formData, setFormData] = useState({
    marksObtained: "",
    grade: "",
    status: "Graded",
    feedback: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    dispatch(getGrades());
  }, [dispatch]);

  useEffect(() => {
    if (grades && grades.length > 0 && params?.id) {
      const foundGrade = grades.find((g) => g._id === params.id);
      if (foundGrade) {
        setGrade(foundGrade);
        setFormData({
          marksObtained: foundGrade.marksObtained || "",
          grade: foundGrade.grade || "",
          status: foundGrade.status || "Graded",
          feedback: foundGrade.feedback || "",
        });
      }
    }
  }, [grades, params?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const selectOption = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement update grade API call
    console.log("Update grade:", params.id, formData);
    // After successful update, navigate back
    router.push(`/dashboard/grades/${params.id}`);
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

  if (status === 'loading') {
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

  if (!grade) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Grade not found</p>
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

        <div className="mb-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
          <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Grade Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-600">Student</p>
              <p className="font-medium text-[#1E1E1E]">{grade.student?.studentName || "N/A"}</p>
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
              <p className="font-medium text-[#1E1E1E]">{grade.gradedBy?.fullName || "N/A"}</p>
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
              disabled={createStatus === "loading"}
              className={`flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition ${
                createStatus === "loading"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
              }`}
            >
              <Save size={16} />
              {createStatus === "loading" ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

