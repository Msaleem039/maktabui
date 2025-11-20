"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomField } from "@/components/CustomField";
import { DropdownField } from "@/components/DropdownField";

const defaultForm = {
  name: "",
  code: "",
  subject: "",
  description: "",
  teacherId: "",
  startDate: "",
  endDate: "",
};

const mockTeachers = [
  { _id: "1", id: "1", fullName: "John Doe", specialization: "Mathematics" },
  { _id: "2", id: "2", fullName: "Jane Smith", specialization: "English" },
  { _id: "3", id: "3", fullName: "Ahmed Ali", specialization: "Science" },
  { _id: "4", id: "4", fullName: "Fatima Khan", specialization: "History" },
];

export default function EditClassPage({ params }) {
  const router = useRouter();
  const classId = params?.id ?? "class-1";
  const [formData, setFormData] = useState(defaultForm);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);

  useEffect(() => {
    setPrefilling(true);
    const timer = setTimeout(() => {
      setFormData({
        name: "203 Abdirahman Jama Class",
        code: "CLS-203",
        subject: "Quran",
        description: "Weekly Quran memorization lessons.",
        teacherId: "2",
        startDate: "2024-02-01",
        endDate: "2024-06-30",
      });
      setPrefilling(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [classId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  };

  const selectedTeacherLabel = useMemo(() => {
    const selected = mockTeachers.find((teacher) => teacher._id === formData.teacherId);
    if (!selected) return "";
    return `${selected.fullName} - ${selected.specialization}`;
  }, [formData.teacherId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("Class updated successfully! (UI Testing Mode)");
      router.push("/dashboard/class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</h1>
      <p className="text-[1.75rem] font-medium text-[#000000] mb-4">MaktabOS</p>

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

        {prefilling ? (
          <div className="py-20 text-center text-[#0B4B31] font-semibold">Loading class data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomField
              label="Class Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Class Name"
              required={true}
            />

            <CustomField
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              required={true}
            />

            <DropdownField
              label="Teacher"
              name="teacherId"
              value={selectedTeacherLabel || "Select a teacher"}
              options={mockTeachers}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder="Select a teacher"
              required={true}
            />

            <CustomField
              label="Class Code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Class Code"
            />

            <div className="sm:col-span-2">
              <label className="block font-normal text-sm text-[#000000] mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Class Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-[#0B4B3199] text-white text-sm placeholder-[#000000] rounded-2xl px-4 py-4 outline-none resize-none"
              />
            </div>

            <CustomField
              label="Start Date"
              name="startDate"
              placeholder="mm/dd/yyyy"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />

            <CustomField
              label="End Date"
              name="endDate"
              placeholder="mm/dd/yyyy"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
            />

            <div className="sm:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#cedbd6] text-[#0B4B31] font-semibold px-8 py-3 rounded-full transition w-full sm:w-auto ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}



