"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const defaultFormState = {
  subjectName: "",
  subjectCode: "",
  roomNumber: "",
  creditHours: "",
  classDuration: "",
  subjectType: "",
  assignedTeacher: "",
  classGrade: "",
};

const selectOptions = {
  subjectType: [
    { label: "Select", value: "" },
    { label: "Core", value: "core" },
    { label: "Elective", value: "elective" },
  ],
  assignedTeacher: [
    { label: "Select", value: "" },
    { label: "Mohamed Karie", value: "1" },
    { label: "Abdirahman Ahmed", value: "2" },
  ],
  classGrade: [
    { label: "Select", value: "" },
    { label: "Grade 4", value: "grade-4" },
    { label: "Grade 5", value: "grade-5" },
  ],
};

const FieldWrapper = ({ label, children }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-[#0B4B31]">
    {label}
    {children}
  </label>
);

const baseInputClasses =
  "w-full rounded-full bg-[#5E8C71] px-4 py-3 text-sm text-white placeholder-white/70 outline-none border border-transparent focus:border-white/60 transition";

export default function AddSubjectPage() {
  const router = useRouter();
  const [formState, setFormState] = useState(defaultFormState);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      formState.subjectName.trim() &&
      formState.subjectCode.trim() &&
      formState.roomNumber.trim()
    );
  }, [formState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSaving(true);
    try {
      // TODO: Integrate with backend endpoint
      console.log("Submitting subject:", formState);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFormState(defaultFormState);
      router.push("/dashboard/subject");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F4] p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000] mb-4">
          MaktabOS
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)]">
        <h2 className="text-lg font-semibold text-[#0B4B31] mb-6">
          Add New Subject
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldWrapper label="Subject Name">
            <input
              type="text"
              name="subjectName"
              value={formState.subjectName}
              onChange={handleChange}
              placeholder="Subject Name"
              className={baseInputClasses}
              required
            />
          </FieldWrapper>

          <FieldWrapper label="Subject Code">
            <input
              type="text"
              name="subjectCode"
              value={formState.subjectCode}
              onChange={handleChange}
              placeholder="Subject Code"
              className={baseInputClasses}
              required
            />
          </FieldWrapper>

          <FieldWrapper label="Room Number">
            <input
              type="text"
              name="roomNumber"
              value={formState.roomNumber}
              onChange={handleChange}
              placeholder="Room Number"
              className={baseInputClasses}
              required
            />
          </FieldWrapper>

          <FieldWrapper label="Credit Hours">
            <input
              type="number"
              min="0"
              name="creditHours"
              value={formState.creditHours}
              onChange={handleChange}
              placeholder="Credit Hours"
              className={baseInputClasses}
            />
          </FieldWrapper>

          <FieldWrapper label="Class Duration">
            <input
              type="text"
              name="classDuration"
              value={formState.classDuration}
              onChange={handleChange}
              placeholder="Class Duration"
              className={baseInputClasses}
            />
          </FieldWrapper>

          <FieldWrapper label="Subject Type">
            <select
              name="subjectType"
              value={formState.subjectType}
              onChange={handleChange}
              className={`${baseInputClasses} text-white`}
            >
              {selectOptions.subjectType.map((option) => (
                <option key={option.value} value={option.value} className="text-[#0B4B31]">
                  {option.label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="Assigned Teacher">
            <select
              name="assignedTeacher"
              value={formState.assignedTeacher}
              onChange={handleChange}
              className={`${baseInputClasses} text-white`}
            >
              {selectOptions.assignedTeacher.map((option) => (
                <option key={option.value} value={option.value} className="text-[#0B4B31]">
                  {option.label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="Class/Grade">
            <select
              name="classGrade"
              value={formState.classGrade}
              onChange={handleChange}
              className={`${baseInputClasses} text-white`}
            >
              {selectOptions.classGrade.map((option) => (
                <option key={option.value} value={option.value} className="text-[#0B4B31]">
                  {option.label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              disabled={!canSubmit || isSaving}
              className="min-w-[220px] rounded-full bg-[#D5E2DB] px-10 py-3 text-base font-semibold text-[#0B4B31] transition hover:bg-[#c3d7ce] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



