"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { CustomField } from "@/components/CustomField";
import { DropdownField } from "@/components/DropdownField";

const Page = () => {
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
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    // API COMMENTED OUT FOR UI TESTING - Using mock data
    // fetchClasses();
    setClasses([
      { _id: "1", id: "1", name: "Class 1A" },
      { _id: "2", id: "2", name: "Class 1B" },
      { _id: "3", id: "3", name: "Class 2A" },
      { _id: "4", id: "4", name: "Class 2B" },
    ]);
  }, []);

  // API COMMENTED OUT FOR UI TESTING
  // const fetchClasses = async () => {
  //   try {
  //     console.log("Fetching classes...");
  //     const response = await axios.post("/api/teacher/getAllClassesName");
  //     console.log("API Response:", response);

  //     if (response.data && response.data.classes) {
  //       setClasses(response.data.classes);
  //       console.log("Classes set:", response.data.classes);
  //     } else if (response.data) {
  //       if (Array.isArray(response.data)) {
  //         setClasses(response.data);
  //       } else {
  //         console.error("Unexpected response structure:", response.data);
  //         setClasses([]);
  //       }
  //     } else {
  //       console.error("No data in response");
  //       setClasses([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching classes:", error);
  //     if (error.response) {
  //       console.error("Error response data:", error.response.data);
  //       console.error("Error response status:", error.response.status);
  //     }
  //     setClasses([]);
  //   }
  // };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const selectOption = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleClassSelection = (classId, className) => {
    setSelectedClasses(prev => {
      const isAlreadySelected = prev.find(cls => cls.id === classId);

      if (isAlreadySelected) {
        const updated = prev.filter(cls => cls.id !== classId);
        updateAssignedClassesInput(updated);
        return updated;
      } else {
        const updated = [...prev, { id: classId, name: className }];
        updateAssignedClassesInput(updated);
        return updated;
      }
    });
  };

  const updateAssignedClassesInput = (classArray) => {
    const classNames = classArray.map(cls => cls.name).join(", ");
    setFormData(prev => ({
      ...prev,
      assignedClasses: classNames
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { fullName, email, password, phone } = formData;
    if (!fullName || !email || !password || !phone) {
      alert("Full name, email, password, and phone are required.");
      setLoading(false);
      return;
    }

    try {
      // API COMMENTED OUT FOR UI TESTING - Simulating success
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      
      // const payload = {
      //   ...formData,
      //   assignedClasses: selectedClasses.map(cls => cls.id),
      //   assignedClassIds: selectedClasses.map(cls => cls.id),
      //   subjects: formData.subjects
      //     ? formData.subjects.split(",").map((item) => item.trim())
      //     : [],
      //   languages: formData.languages
      //     ? formData.languages.split(",").map((item) => item.trim())
      //     : [],
      // };

      // console.log("Submitting payload:", payload);

      // const response = await fetch("/api/teacher/createTeacher", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // const result = await response.json();
      // if (response.ok) {
        alert("Teacher created successfully! (UI Testing Mode)");
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
      // } else {
      //   alert(result.message || "Error creating teacher");
      // }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error creating teacher");
    } finally {
      setLoading(false);
    }
  };

  const isClassSelected = (classId) => {
    return selectedClasses.some(cls => cls.id === classId);
  };

  const genderOptions = ["Male", "Female", "Other"];

  const qualificationOptions = ["B.Ed", "M.Ed", "B.Sc", "M.Sc", "PhD"];

  const experienceOptions = [...Array(31).keys()].map(num => ({
    label: `${num} years`,
    value: `${num} years`
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">
        Welcome to
      </h1>
      <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">
        MaktabOS
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl ">
        <h2 className="text-sm font-semibold mb-6 text-gray-700">
          Create Teacher
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative"
        >
          {/* Full Name */}
          <CustomField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required={true}
          />

          {/* Gender Dropdown */}
          <DropdownField
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
          <CustomField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />

          {/* Address */}
          <CustomField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
          />

          {/* Phone */}
          <CustomField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required={true}
          />

          {/* Email */}
          <CustomField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required={true}
          />

          {/* Password */}
          <CustomField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required={true}
          />

          {/* Qualification Dropdown */}
          <DropdownField
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
          <CustomField
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="e.g. Mathematics"
          />

          {/* Experience Years Dropdown */}
          <DropdownField
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
          <CustomField
            label="Hire Date"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleInputChange}
          />

          {/* Assigned Classes Dropdown - Custom render */}
          <DropdownField
            label="Assigned Classes"
            name="assignedClasses"
            value={formData.assignedClasses}
            options={classes}
            onSelect={() => {}} // Not used for this custom dropdown
            isOpen={openDropdown === "assignedClasses"}
            onToggle={toggleDropdown}
            placeholder="Select classes"
            renderOption={(classItem) => (
              <div
                key={classItem._id || classItem.id}
                onClick={() => handleClassSelection(classItem._id || classItem.id, classItem.name)}
                className={`px-4 py-3 cursor-pointer hover:bg-[#bdc9c4] flex items-center ${
                  isClassSelected(classItem._id || classItem.id) ? "bg-[#0e6b49] text-white" : ""
                }`}
              >
                <span className="flex-1">{classItem.name}</span>
                {isClassSelected(classItem._id || classItem.id) && (
                  <span className="ml-2 text-sm">✓</span>
                )}
              </div>
            )}
          />

          {/* Selected Classes Display */}
          {selectedClasses.length > 0 && (
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Selected Classes:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedClasses.map((classItem) => (
                  <span
                    key={classItem.id}
                    className="bg-[#0e6b49] text-white px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {classItem.name}
                    <button
                      type="button"
                      onClick={() => handleClassSelection(classItem.id, classItem.name)}
                      className="ml-2 hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          <CustomField
            label="Subjects"
            name="subjects"
            value={formData.subjects}
            onChange={handleInputChange}
            placeholder="e.g. English, Math"
          />

          {/* Languages */}
          <CustomField
            label="Languages"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            placeholder="e.g. English, Urdu"
          />

          {/* Submit Button */}
          <div className="sm:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#cedbd6] text-green-900 font-semibold px-8 py-3 rounded-full hover:bg-green-300 transition w-full sm:w-auto ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Teacher..." : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;