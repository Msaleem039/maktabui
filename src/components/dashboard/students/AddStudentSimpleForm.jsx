"use client";

import { useState } from "react";
import { Calendar, Edit } from "lucide-react";

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
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
        className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
      />
    </div>
  );
};

const FormDropdown = ({ label, name, value, options, onChange, placeholder = "Select", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-[#0B4B31]" : "text-[#0B4B31]/60"}>
          {value || placeholder}
        </span>
        <span className="text-[#0B4B31]">▾</span>
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value || option}
              onClick={() => {
                onChange({ target: { name, value: option.value || option } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === (option.value || option) ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"
              }`}
            >
              {option.label || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DateInput = ({ label, name, value, onChange, placeholder, required = false, className = "" }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        />
        <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]/60 pointer-events-none" />
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-2">Format: MM-DD-YYYY (e.g., 05-15-2010)</p>
    </div>
  );
};

export default function AddStudentSimpleForm() {
  const [studentData, setStudentData] = useState({
    studentName: "",
    address: "",
    dateOfBirth: "",
    phone: "",
    addToWaitingList: "",
    gender: "",
    enrolDate: "",
    fee: "",
    password: "",
    class: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", studentData);
    // Handle save logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Children</h3>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#E5EFEB] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
          >
            <Edit size={16} />
            Add Student
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <FormInput
            label="Student Name"
            name="studentName"
            value={studentData.studentName}
            onChange={handleChange}
            placeholder="Name"
          />
          <FormInput
            label="Address"
            name="address"
            value={studentData.address}
            onChange={handleChange}
            placeholder="Your Address"
          />
          <DateInput
            label="Date of Birth"
            name="dateOfBirth"
            value={studentData.dateOfBirth}
            onChange={handleChange}
            placeholder="MM-DD-YYYY"
            required
          />
          <DateInput
            label="Enrol Date"
            name="enrolDate"
            value={studentData.enrolDate}
            onChange={handleChange}
            placeholder="MM-DD-YYYY"
          />
          <FormInput
            label="Fee"
            name="fee"
            value={studentData.fee}
            onChange={handleChange}
            placeholder="Fee"
          />

          {/* Right Column */}
          <FormInput
            label="Phone"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <FormDropdown
            label="Add To Waiting List"
            name="addToWaitingList"
            value={studentData.addToWaitingList}
            onChange={handleChange}
            options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
            placeholder="Select"
          />
          <FormDropdown
            label="Gender"
            name="gender"
            value={studentData.gender}
            onChange={handleChange}
            options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
            placeholder="Select"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={studentData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <FormDropdown
            label="Class"
            name="class"
            value={studentData.class}
            onChange={handleChange}
            options={[
              { label: "Class Name 1", value: "class1" },
              { label: "Class Name 2", value: "class2" },
              { label: "Class Name 3", value: "class3" },
            ]}
            placeholder="Select"
          />
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="rounded-full bg-[#E5EFEB] px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

