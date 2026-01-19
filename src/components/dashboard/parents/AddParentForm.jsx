"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createParent, resetAllParentsState } from "@/redux/slices/parentSlices/parentSlice";
import CustomDatePicker from "@/components/DatePicker";
import { getAdminId } from "@/utils/getCookies";

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

export default function AddParentForm() {
  const dispatch = useDispatch();
  const { status, error, parent, student } = useSelector((state) => state.createParent);
  const adminId = getAdminId();

  const [parentData, setParentData] = useState({
    fullName: "",
    address: "",
    spouse: "",
    emergencyPhone: "",
    phone: "",
    spousePhone: "",
    email: "",
    password: "",
    identityNumber: "",
    addToWaitList: false,
  });

  const [children, setChildren] = useState([
    {
      studentName: "",
      address: "",
      dateOfBirth: "",
      phone: "",
      addToWaitList: false,
      gender: "",
      enrollDate: "",
      fee: "",
      password: "",
      class: "",
      email: "",
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChildChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: type === 'checkbox' ? checked : value
      };
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
        addToWaitList: false,
        gender: "",
        enrollDate: "",
        fee: "",
        password: "",
        class: "",
        email: "",
      },
    ]);
  };

  const removeStudent = (index) => {
    if (children.length > 1) {
      setChildren((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const submissionData = {
        parent: {
          ...parentData,
          fee: parentData.fee ? Number(parentData.fee) : 0,
        },
        children: children.map(child => ({
          ...child,
          dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null,
          enrollDate: child.enrollDate ? new Date(child.enrollDate) : new Date(),
          fee: child.fee ? Number(child.fee) : 0,
          gender: child.gender === "male" ? "Male" :
            child.gender === "female" ? "Female" : "Other",
        })),
        adminId
      };

      const result = await dispatch(createParent(submissionData)).unwrap();

      if (result) {
        setShowSuccess(true);
        resetForm();

        setTimeout(() => {
          setShowSuccess(false);
          dispatch(resetAllParentsState());
        }, 5000);
      }
    } catch (error) {
      console.error('Error creating parent:', error);
      setFormError(error.message || "An error occurred while processing your request.");
    }
  };

  const resetForm = () => {
    setParentData({
      fullName: "",
      address: "",
      spouse: "",
      emergencyPhone: "",
      phone: "",
      spousePhone: "",
      email: "",
      password: "",
      identityNumber: "",
      addToWaitList: false,
    });
    setChildren([
      {
        studentName: "",
        address: "",
        dateOfBirth: "",
        phone: "",
        addToWaitList: false,
        gender: "",
        enrollDate: "",
        fee: "",
        password: "",
        class: "",
        email: "",
      },
    ]);
    setFormError("");
  };

  return (
    <>
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="font-semibold">Family added successfully!</p>
          <p>Parent and student records have been created.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {formError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Form Error:</p>
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">Parent/Guardian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="fullName"
              value={parentData.fullName}
              onChange={handleParentChange}
              placeholder="Your Full Name"
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={parentData.email}
              onChange={handleParentChange}
              placeholder="your.email@example.com"
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={parentData.password}
              onChange={handleParentChange}
              placeholder="Password"
              required
            />
            <FormInput
              label="Identity Number"
              name="identityNumber"
              value={parentData.identityNumber}
              onChange={handleParentChange}
              placeholder="Identity Number"
              required
            />
            <FormInput
              label="Address"
              name="address"
              value={parentData.address}
              onChange={handleParentChange}
              placeholder="Your Address"
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              value={parentData.phone}
              onChange={handleParentChange}
              placeholder="Phone"
              required
            />
            <FormInput
              label="Spouse"
              name="spouse"
              value={parentData.spouse}
              onChange={handleParentChange}
              placeholder="Spouse Name"
            />
            <FormInput
              label="Spouse Phone"
              name="spousePhone"
              value={parentData.spousePhone}
              onChange={handleParentChange}
              placeholder="Spouse Phone"
            />
            <FormInput
              label="Emergency Phone Number"
              name="emergencyPhone"
              value={parentData.emergencyPhone}
              onChange={handleParentChange}
              placeholder="Emergency Phone"
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="addToWaitList"
                checked={parentData.addToWaitList}
                onChange={handleParentChange}
                className="rounded border-gray-300 text-[#0B4B31] focus:ring-[#0B4B31]"
              />
              <label className="text-sm font-semibold text-gray-700">
                Add To Waiting List
              </label>
            </div>
          </div>
        </div>

        {/* Students Section */}
        {children.map((child, index) => (
          <div key={index} className="space-y-6 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Student {index + 1}</h3>
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
                placeholder="Student Name"
                required
              />
              <FormInput
                label="Student Email"
                name="email"
                type="email"
                value={child.email}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="student.email@example.com"
                required
              />
              <FormInput
                label="Student Password"
                name="password"
                type="password"
                value={child.password}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Password"
                required
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
                placeholder="Student Address"
                required
              />
              <CustomDatePicker
                label="Date of Birth"
                name="dateOfBirth"
                value={child.dateOfBirth}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Select Date"
                maxDate={new Date()}
              />
              <FormDropdown
                label="Gender"
                name="gender"
                value={child.gender}
                onChange={(e) => handleChildChange(index, e)}
                options={[
                  { label: "Male", value: "male" }, 
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" }
                ]}
                placeholder="Select Gender"
              />
              <CustomDatePicker
                label="Enroll Date"
                name="enrollDate"
                value={child.enrollDate}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="Select Date"
              />
              <FormInput
                label="Fee"
                name="fee"
                type="number"
                value={child.fee}
                onChange={(e) => handleChildChange(index, e)}
                placeholder="0.00"
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
                placeholder="Select Class"
              />
              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  name="addToWaitList"
                  checked={child.addToWaitList}
                  onChange={(e) => handleChildChange(index, e)}
                  className="rounded border-gray-300 text-[#0B4B31] focus:ring-[#0B4B31]"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Add Student To Waiting List
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={addMoreStudents}
            className="flex-1 rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
          >
            Add More Students
          </button>
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Adding Family..." : "Add Family"}
          </button>
        </div>
      </form>
    </>
  );
}