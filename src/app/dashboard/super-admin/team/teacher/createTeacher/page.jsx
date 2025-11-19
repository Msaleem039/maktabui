"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { createTeacher, resetCreateTeacherState } from "@/redux/slices/teacherSlices/teacherSlices";

const Page = () => {
  const dispatch = useDispatch();
  
  // Use more specific selectors to prevent unnecessary re-renders
  const classNames = useSelector((state) => state.getAllClassesName.classNames);
  const classesLoading = useSelector((state) => state.getAllClassesName.loading);
  const classesError = useSelector((state) => state.getAllClassesName.error);
  const teacherStatus = useSelector((state) => state.createTeacher.status);
  const teacherError = useSelector((state) => state.createTeacher.error);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    qualification: "",
    specialization: "",
    experienceYears: "",
    hireDate: "",
    assignedClasses: "",
    subjects: "",
    languages: "",
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);

  // Memoize classes array
  const classes = useMemo(() => {
    return Array.isArray(classNames) ? classNames : [];
  }, [classNames]);

  // Memoize options
  const genderOptions = useMemo(() => ["Male", "Female", "Other"], []);
  const qualificationOptions = useMemo(() => ["B.Ed", "M.Ed", "B.Sc", "M.Sc", "PhD"], []);
  const experienceOptions = useMemo(() => 
    [...Array(31).keys()].map(num => ({
      label: `${num} years`,
      value: `${num}`
    })), []
  );

  useEffect(() => {
    // Fetch classes using Redux action
    dispatch(getAllClassesNameAction());
  }, [dispatch]);

  // Reset form on successful creation
  useEffect(() => {
    if (teacherStatus === "succeeded") {
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        qualification: "",
        specialization: "",
        experienceYears: "",
        hireDate: "",
        assignedClasses: "",
        subjects: "",
        languages: "",
      });
      setSelectedClasses([]);
      
      setTimeout(() => {
        dispatch(resetCreateTeacherState());
      }, 3000);
    }
  }, [teacherStatus, dispatch]);

  // Optimize input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Optimize dropdown handlers
  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  const selectOption = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  }, []);

  // Optimize class selection
  const handleClassSelection = useCallback((classId, className) => {
    setSelectedClasses(prev => {
      const isAlreadySelected = prev.find(cls => cls.id === classId);

      if (isAlreadySelected) {
        const updated = prev.filter(cls => cls.id !== classId);
        // Update form data separately to avoid re-render during typing
        setTimeout(() => {
          const classNames = updated.map(cls => cls.name).join(", ");
          setFormData(prevForm => ({
            ...prevForm,
            assignedClasses: classNames
          }));
        }, 0);
        return updated;
      } else {
        const updated = [...prev, { id: classId, name: className }];
        // Update form data separately to avoid re-render during typing
        setTimeout(() => {
          const classNames = updated.map(cls => cls.name).join(", ");
          setFormData(prevForm => ({
            ...prevForm,
            assignedClasses: classNames
          }));
        }, 0);
        return updated;
      }
    });
  }, []);

  const isClassSelected = useCallback((classId) => {
    return selectedClasses.some(cls => cls.id === classId);
  }, [selectedClasses]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const { fullName, email, password, phone } = formData;
    if (!fullName || !email || !password || !phone) {
      alert("Full name, email, password, and phone are required.");
      return;
    }

    const payload = {
      ...formData,
      assignedClasses: selectedClasses.map(cls => cls.id),
      assignedClassIds: selectedClasses.map(cls => cls.id),
      subjects: formData.subjects
        ? formData.subjects.split(",").map((item) => item.trim())
        : [],
      languages: formData.languages
        ? formData.languages.split(",").map((item) => item.trim())
        : [],
    };

    console.log("Submitting payload:", payload);
    dispatch(createTeacher(payload));
  }, [formData, selectedClasses, dispatch]);

  // Memoize form components
  const StyledCustomField = useCallback(({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 transition-all duration-200 ease-in-out border border-transparent hover:border-[#0B4B31]/20 focus:border-[#0B4B31]/40"
        />
      </div>
    );
  }, []);

  // Enhanced Date Input Component
  const StyledDateField = useCallback(({ label, name, value, onChange, placeholder, required = false, className = "" }) => {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 transition-all duration-200 ease-in-out border border-transparent hover:border-[#0B4B31]/20 focus:border-[#0B4B31]/40 [color-scheme:light]"
        />
      </div>
    );
  }, []);

  // Enhanced Dropdown Field Component
  const StyledDropdownField = useCallback(({ label, name, value, options, onSelect, isOpen, onToggle, placeholder, required = false, className = "", renderOption, disabled = false }) => {
    return (
      <div className={`relative ${className}`}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <div
          className={`w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30 transition-all duration-200 ease-in-out border border-transparent hover:border-[#0B4B31]/20 ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D0DCD6]"
          }`}
          onClick={() => !disabled && onToggle(name)}
        >
          <span className={value ? "text-[#0B4B31]" : "text-[#0B4B31]/60"}>
            {value || placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-[#0B4B31] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        {isOpen && !disabled && (
          <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto animate-in fade-in-0 zoom-in-95">
            {options.length > 0 ? (
              options.map((option) => 
                renderOption ? (
                  renderOption(option)
                ) : (
                  <div
                    key={option.value || option}
                    onClick={() => onSelect(name, option.value || option)}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                      value === (option.value || option) 
                        ? "bg-[#0B4B31] text-white" 
                        : "text-[#0B4B31] hover:bg-[#E5EFEB]"
                    }`}
                  >
                    {option.label || option}
                  </div>
                )
              )
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">
        Welcome to
      </h1>
      <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">
        MaktabOS
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">
          Create Teacher
        </h2>

        {/* Status Messages */}
        {teacherStatus === "loading" && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            <p className="font-semibold">Creating teacher...</p>
          </div>
        )}

        {teacherStatus === "succeeded" && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-semibold">Teacher created successfully!</p>
            <p>Teacher account has been created with assigned classes.</p>
          </div>
        )}

        {teacherError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{teacherError}</p>
          </div>
        )}

        {/* Classes Loading/Error Messages */}
        {classesLoading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            <p className="font-semibold">Loading classes...</p>
          </div>
        )}

        {classesError && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <p className="font-semibold">Warning:</p>
            <p>Could not load classes - {classesError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <StyledCustomField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required={true}
            />

            {/* Gender Dropdown */}
            <StyledDropdownField
              label="Gender"
              name="gender"
              value={formData.gender}
              options={genderOptions}
              onSelect={selectOption}
              isOpen={openDropdown === "gender"}
              onToggle={toggleDropdown}
              placeholder="Select gender"
            />

            {/* Date of Birth */}
            <StyledDateField
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder="MM-DD-YYYY"
            />

            {/* Address */}
            <StyledCustomField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
            />

            {/* Phone */}
            <StyledCustomField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required={true}
            />

            {/* Email */}
            <StyledCustomField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required={true}
            />

            {/* Password */}
            <StyledCustomField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required={true}
            />

            {/* Qualification Dropdown */}
            <StyledDropdownField
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              options={qualificationOptions}
              onSelect={selectOption}
              isOpen={openDropdown === "qualification"}
              onToggle={toggleDropdown}
              placeholder="Select qualification"
            />

            {/* Specialization */}
            <StyledCustomField
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g. Mathematics"
            />

            {/* Experience Years Dropdown */}
            <StyledDropdownField
              label="Experience (Years)"
              name="experienceYears"
              value={formData.experienceYears}
              options={experienceOptions}
              onSelect={selectOption}
              isOpen={openDropdown === "experienceYears"}
              onToggle={toggleDropdown}
              placeholder="Select years"
            />

            {/* Hire Date */}
            <StyledDateField
              label="Hire Date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              placeholder="MM-DD-YYYY"
            />

            {/* Assigned Classes Dropdown - Custom render */}
            <StyledDropdownField
              label="Assigned Classes"
              name="assignedClasses"
              value={formData.assignedClasses}
              options={classes}
              onSelect={() => {}} // Not used for this custom dropdown
              isOpen={openDropdown === "assignedClasses"}
              onToggle={toggleDropdown}
              placeholder={classesLoading ? "Loading classes..." : "Select classes"}
              renderOption={(classItem) => (
                <div
                  key={classItem._id || classItem.id}
                  onClick={() => handleClassSelection(classItem._id || classItem.id, classItem.name)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center ${
                    isClassSelected(classItem._id || classItem.id) 
                      ? "bg-[#0B4B31] text-white" 
                      : "text-[#0B4B31] hover:bg-[#E5EFEB]"
                  }`}
                >
                  <span className="flex-1">{classItem.name}</span>
                  {isClassSelected(classItem._id || classItem.id) && (
                    <span className="ml-2 text-sm">✓</span>
                  )}
                </div>
              )}
              disabled={classesLoading}
            />

            {/* Subjects */}
            <StyledCustomField
              label="Subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              placeholder="e.g. English, Math"
            />

            {/* Languages */}
            <StyledCustomField
              label="Languages"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="e.g. English, Urdu"
            />
          </div>

          {/* Selected Classes Display */}
          {selectedClasses.length > 0 && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selected Classes:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedClasses.map((classItem) => (
                  <span
                    key={classItem.id}
                    className="bg-[#0B4B31] text-white px-3 py-1 rounded-full text-sm flex items-center transition-all duration-200 hover:bg-[#0B4B31]/90"
                  >
                    {classItem.name}
                    <button
                      type="button"
                      onClick={() => handleClassSelection(classItem.id, classItem.name)}
                      className="ml-2 hover:text-gray-200 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={teacherStatus === "loading" || classesLoading}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200 ${
                teacherStatus === "loading" || classesLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE] hover:shadow-md transform hover:-translate-y-0.5"
              }`}
            >
              {teacherStatus === "loading" ? "Creating Teacher..." : 
               classesLoading ? "Loading Classes..." : 
               "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;