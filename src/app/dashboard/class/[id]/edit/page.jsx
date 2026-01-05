"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { getClassByIDAction } from "@/redux/slices/classSlices/classSlice";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { updateClassAction } from "@/redux/slices/classSlices/classSlice";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";

const defaultForm = {
  name: "",
  code: "",
  subject: "",
  description: "",
  teacherId: "",
  startDate: "",
  endDate: "",
};

export default function EditClassPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainText } = useTheme();
  const adminId = getAdminId();
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const { classDetails, loading: classLoading } = useSelector(state => state.getClassByID);
  const { teacherNames, loading: teachersLoading } = useSelector(state => state.getTeachersName);
  const { loading: updateLoading } = useSelector(state => state.updateClass);

  const [formData, setFormData] = useState(defaultForm);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (classId) {
      dispatch(getClassByIDAction(classId));
      dispatch(getTeachersName(adminId));
    }
  }, [classId, dispatch]);

  useEffect(() => {
    if (classDetails) {
      setFormData({
        name: classDetails.name || "",
        code: classDetails.code || "",
        subject: classDetails.subject || "",
        description: classDetails.description || "",
        teacherId: classDetails.teacherId?._id || "",
        startDate: classDetails.startDate ? new Date(classDetails.startDate).toISOString().split('T')[0] : "",
        endDate: classDetails.endDate ? new Date(classDetails.endDate).toISOString().split('T')[0] : "",
      });
    }
  }, [classDetails]);

  // Transform teacher data for dropdown
  const teacherOptions = useMemo(() => {
    if (!teacherNames) return [];
    
    return teacherNames.map(teacher => ({
      value: teacher._id,
      label: `${teacher.fullName} - ${teacher.specialization || "Teacher"}`
    }));
  }, [teacherNames]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDropdownToggle = (name) => {
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleDropdownSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDropdownOpen(null);
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Class name is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.teacherId) errors.teacherId = "Teacher is required";
    if (!formData.code.trim()) errors.code = "Class code is required";

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        errors.endDate = "End date cannot be before start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const selectedTeacherLabel = useMemo(() => {
    if (!formData.teacherId || !teacherNames) return "";

    const selected = teacherNames.find((teacher) => teacher._id === formData.teacherId);
    if (!selected) return "";

    return `${selected.fullName} - ${selected.specialization || "Teacher"}`;
}, [formData.teacherId, teacherNames]);

// To this:
const selectedTeacherValue = formData.teacherId;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const updateData = {
        classId,
        name: formData.name,
        code: formData.code,
        subject: formData.subject,
        description: formData.description,
        teacherId: formData.teacherId,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      const result = await dispatch(updateClassAction(updateData)).unwrap();

      if (result) {
        alert("Class updated successfully!");
        router.push("/dashboard/class");
      }
    } catch (error) {
      alert(`Error updating class: ${error}`);
    }
  };

  const isLoading = classLoading || teachersLoading || updateLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</h1>
      <p className="text-[1.75rem] font-medium text-[#000000] mb-4">{mainText || "MaktabOS"}</p>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#0B4B31]">Edit Class</h2>
            <p className="text-sm text-[#6B7280]">Class ID: {classId}</p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            Cancel
          </button>
        </div>

        {classLoading ? (
          <div className="py-20 text-center text-[#0B4B31] font-semibold">Loading class data...</div>
        ) : !classDetails ? (
          <div className="py-20 text-center text-red-600 font-semibold">Class not found</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Class Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Class Name"
              required={true}
              error={formErrors.name}
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              required={true}
              error={formErrors.subject}
            />

            <SimpleDropdown
              label="Teacher"
              name="teacherId"
              value={selectedTeacherValue}
              options={teacherOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder="Select a teacher"
              required={true}
            />

            {formErrors.teacherId && (
              <p className="text-red-500 text-xs mt-1 ml-4">{formErrors.teacherId}</p>
            )}

            <FormInput
              label="Class Code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Class Code"
              required={true}
              error={formErrors.code}
            />

            <div className="sm:col-span-2">
              <label className="block font-normal text-sm text-[#000000] mb-1">
                Description
                {formErrors.description && (
                  <span className="text-red-600 text-xs ml-2">{formErrors.description}</span>
                )}
              </label>
              <textarea
                name="description"
                placeholder="Class Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-[#0B4B3199] text-white text-sm placeholder-[#000000] rounded-2xl px-4 py-4 outline-none resize-none"
              />
            </div>

            <FormInput
              label="Start Date"
              name="startDate"
              placeholder="mm/dd/yyyy"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              error={formErrors.startDate}
            />

            <FormInput
              label="End Date"
              name="endDate"
              placeholder="mm/dd/yyyy"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              error={formErrors.endDate}
            />

            <div className="sm:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#cedbd6] text-[#0B4B31] font-semibold px-8 py-3 rounded-full transition w-full sm:w-auto ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#b8c9c2]"
                  }`}
              >
                {updateLoading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}