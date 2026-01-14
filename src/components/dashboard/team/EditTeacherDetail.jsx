"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { updateTeacher } from "@/redux/slices/teacherSlices/teacherSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";

export default function EditTeacherDetail({ teacher }) {
  const dispatch = useDispatch();
  const { classNames } = useSelector((state) => state.getAllClassesName);
  const { status: updateStatus, error: updateError } = useSelector(
    (state) => state.updateTeacher
  );
  const adminId = getAdminId();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    qualification: "",
    specialization: "",
    experienceYears: "",
    hireDate: "",
    subjects: "",
    languages: "",
    status: "",
    assignedClasses: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const experienceYearsOptions = [
    { label: "1 year", value: "1 year" },
    { label: "2 years", value: "2 years" },
    { label: "3 years", value: "3 years" },
    { label: "4 years", value: "4 years" },
    { label: "5 years", value: "5 years" },
    { label: "6-10 years", value: "6-10 years" },
    { label: "10+ years", value: "10+ years" },
  ];

  const languagesOptions = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Chinese", value: "Chinese" },
    { label: "Arabic", value: "Arabic" },
    { label: "Hindi", value: "Hindi" },
    { label: "Urdu", value: "Urdu" },
  ];

  useEffect(() => {
    dispatch(getAllClassesNameAction(adminId));
  }, [dispatch]);

  useEffect(() => {
    if (teacher) {
      const assignedClassIds =
        teacher.assignedClasses?.map((cls) => cls._id) || [];

      setFormData({
        fullName: teacher.fullName || "",
        gender: teacher.gender || "",
        dateOfBirth: teacher.dateOfBirth
          ? teacher.dateOfBirth.split("T")[0]
          : "",
        address: teacher.address || "",
        phone: teacher.phone || "",
        qualification: teacher.qualification || "",
        specialization: teacher.specialization || "",
        experienceYears: teacher.experienceYears || "",
        hireDate: teacher.hireDate ? teacher.hireDate.split("T")[0] : "",
        subjects: teacher.subjects?.join(", ") || "",
        languages: teacher.languages?.join(", ") || "",
        status: teacher.status || "Active",
        assignedClasses: assignedClassIds,
      });
    }
  }, [teacher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownToggle = (name) => {
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleDropdownSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownOpen(null);
  };

  const handleClassToggle = (classId) => {
    setFormData((prev) => {
      const currentClasses = [...prev.assignedClasses];
      const classIndex = currentClasses.indexOf(classId);

      if (classIndex > -1) {
        currentClasses.splice(classIndex, 1);
      } else {
        currentClasses.push(classId);
      }

      return { ...prev, assignedClasses: currentClasses };
    });
  };

  const isClassSelected = (classId) => {
    return formData.assignedClasses.includes(classId);
  };

  const getSelectedClassNames = () => {
    return (
      classNames
        ?.filter((cls) => formData.assignedClasses.includes(cls._id))
        ?.map((cls) => cls.name)
        ?.join(", ") || "Select classes"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      id: teacher._id,
      fullName: formData.fullName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      phone: formData.phone,
      qualification: formData.qualification,
      specialization: formData.specialization,
      experienceYears: formData.experienceYears,
      hireDate: formData.hireDate,
      assignedClasses: formData.assignedClasses,
      subjects: formData.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter((subject) => subject),
      languages: formData.languages
        .split(",")
        .map((language) => language.trim())
        .filter((language) => language),
      status: formData.status,
    };

    try {
      const result = await dispatch(updateTeacher(submitData)).unwrap();
    } catch (error) {
      console.error("Failed to update teacher:", error);
    }
  };

  if (updateStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <p>Updating teacher data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Edit Teacher
        </h2>

        {updateStatus === "failed" && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {updateError}
          </div>
        )}

        {updateStatus === "succeeded" && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Teacher updated successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />

          <SimpleDropdown
            label="Gender"
            name="gender"
            value={formData.gender}
            options={genderOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownOpen === "gender"}
            onToggle={() => handleDropdownToggle("gender")}
            placeholder="Select Gender"
          />

          <FormInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            placeholder="Date of Birth"
          />

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />

          <FormInput
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            placeholder="Qualification"
          />

          <FormInput
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
          />

          <SimpleDropdown
            label="Experience Years"
            name="experienceYears"
            value={formData.experienceYears}
            options={experienceYearsOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownOpen === "experienceYears"}
            onToggle={() => handleDropdownToggle("experienceYears")}
            placeholder="Select Experience"
          />

          <FormInput
            label="Hire Date"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleInputChange}
            placeholder="Hire Date"
          />

          {/* Assigned Classes Multi-Select Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assigned Classes *
            </label>
            <button
              type="button"
              onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
              className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 text-left flex justify-between items-center"
            >
              <span
                className={
                  formData.assignedClasses.length === 0
                    ? "text-[#0B4B31]/60"
                    : "text-[#0B4B31]"
                }
              >
                {getSelectedClassNames()}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  classesDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {classesDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  {classNames?.length > 0 ? (
                    classNames.map((classItem) => (
                      <label
                        key={classItem._id}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isClassSelected(classItem._id)}
                          onChange={() => handleClassToggle(classItem._id)}
                          className="w-4 h-4 text-[#0B4B31] bg-gray-100 border-gray-300 rounded focus:ring-[#0B4B31]"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {classItem.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No classes available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <FormInput
            label="Subjects (comma separated)"
            name="subjects"
            value={formData.subjects}
            onChange={handleInputChange}
            placeholder="Math, English, Science"
          />

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Languages *
            </label>
            <button
              type="button"
              onClick={() =>
                setDropdownOpen(
                  dropdownOpen === "languages" ? null : "languages"
                )
              }
              className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 text-left flex justify-between items-center"
            >
              <span
                className={
                  !formData.languages ? "text-[#0B4B31]/60" : "text-[#0B4B31]"
                }
              >
                {formData.languages || "Select languages"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen === "languages" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen === "languages" && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  {languagesOptions.map((language) => (
                    <label
                      key={language.value}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language.value)}
                        onChange={() => {
                          const currentLanguages = formData.languages
                            .split(",")
                            .map((lang) => lang.trim())
                            .filter((lang) => lang);
                          const languageIndex = currentLanguages.indexOf(
                            language.value
                          );

                          if (languageIndex > -1) {
                            currentLanguages.splice(languageIndex, 1);
                          } else {
                            currentLanguages.push(language.value);
                          }

                          setFormData((prev) => ({
                            ...prev,
                            languages: currentLanguages.join(", "),
                          }));
                        }}
                        className="w-4 h-4 text-[#0B4B31] bg-gray-100 border-gray-300 rounded focus:ring-[#0B4B31]"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {language.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <SimpleDropdown
            label="Status"
            name="status"
            value={formData.status}
            options={statusOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownOpen === "status"}
            onToggle={() => handleDropdownToggle("status")}
            placeholder="Select Status"
          />
        </form>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={updateStatus === "loading"}
            className="rounded-full bg-[#E5EFEB] px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateStatus === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
