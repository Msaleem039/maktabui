"use client";

import { useState } from "react";
import { Trash2, Calendar } from "lucide-react";

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

export default function AddStudentForm() {
  const [parentData, setParentData] = useState({
    fullName: "",
    address: "",
    spouse: "",
    emergencyPhone: "",
    createOrChoose: "",
    phone: "",
    addToWaitingList: "",
    spousePhone: "",
  });

  const [children, setChildren] = useState([
    {
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
    },
  ]);

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (index, e) => {
    const { name, value } = e.target;
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const addMoreStudents = () => {
    setChildren((prev) => [
      ...prev,
      {
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
      },
    ]);
  };

  const removeStudent = (index) => {
    if (children.length > 1) {
      setChildren((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Parent Data:", parentData);
    console.log("Children Data:", children);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Parent/Guardian Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Parent/Guardian</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="fullName"
            value={parentData.fullName}
            onChange={handleParentChange}
            placeholder="Your First Name"
          />
          <FormDropdown
            label="Create New Parent or Choose a Parent"
            name="createOrChoose"
            value={parentData.createOrChoose}
            onChange={handleParentChange}
            options={[{ label: "Create New", value: "create" }, { label: "Choose Existing", value: "choose" }]}
            placeholder="Choose"
          />
          <FormInput
            label="Address"
            name="address"
            value={parentData.address}
            onChange={handleParentChange}
            placeholder="Your Address"
          />
          <FormInput
            label="Phone"
            name="phone"
            value={parentData.phone}
            onChange={handleParentChange}
            placeholder="Phone"
          />
          <FormInput
            label="Spouse"
            name="spouse"
            value={parentData.spouse}
            onChange={handleParentChange}
            placeholder="Name"
          />
          <FormDropdown
            label="Add To Waiting List"
            name="addToWaitingList"
            value={parentData.addToWaitingList}
            onChange={handleParentChange}
            options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
            placeholder="Select"
          />
          <FormInput
            label="Emergency Phone Number"
            name="emergencyPhone"
            value={parentData.emergencyPhone}
            onChange={handleParentChange}
            placeholder="Phone"
          />
          <FormInput
            label="Spouse Phone"
            name="spousePhone"
            value={parentData.spousePhone}
            onChange={handleParentChange}
            placeholder="Phone"
          />
        </div>
      </div>

      {/* Children Section */}
      {children.map((child, index) => (
        <div key={index} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Children</h3>
            {children.length > 1 && (
              <button
                type="button"
                onClick={() => removeStudent(index)}
                className="flex items-center gap-2 rounded-full bg-[#F16957] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F16957]/90"
              >
                <Trash2 size={16} />
                Remove Student
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Student Name"
              name="studentName"
              value={child.studentName}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="Name"
            />
            <FormInput
              label="Phone"
              name="phone"
              value={child.phone}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="Phone"
            />
            <FormInput
              label="Address"
              name="address"
              value={child.address}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="Your Address"
            />
            <FormDropdown
              label="Add To Waiting List"
              name="addToWaitingList"
              value={child.addToWaitingList}
              onChange={(e) => handleChildChange(index, e)}
              options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
              placeholder="Select"
            />
            <DateInput
              label="Date of Birth"
              name="dateOfBirth"
              value={child.dateOfBirth}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="MM-DD-YYYY"
              required
            />
            <FormDropdown
              label="Gender"
              name="gender"
              value={child.gender}
              onChange={(e) => handleChildChange(index, e)}
              options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
              placeholder="Select"
            />
            <DateInput
              label="Enrol Date"
              name="enrolDate"
              value={child.enrolDate}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="MM-DD-YYYY"
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={child.password}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="Password"
            />
            <FormInput
              label="Fee"
              name="fee"
              value={child.fee}
              onChange={(e) => handleChildChange(index, e)}
              placeholder="Fee"
            />
            <FormDropdown
              label="Class"
              name="class"
              value={child.class}
              onChange={(e) => handleChildChange(index, e)}
              options={[
                { label: "Class Name 1", value: "class1" },
                { label: "Class Name 2", value: "class2" },
                { label: "Class Name 3", value: "class3" },
              ]}
              placeholder="Select"
            />
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="button"
          onClick={addMoreStudents}
          className="flex-1 rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
        >
          Add More Students
        </button>
        <button
          type="button"
          className="flex-1 rounded-full border border-[#0B4B31] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          Save
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          Add Family
        </button>
      </div>
    </form>
  );
}