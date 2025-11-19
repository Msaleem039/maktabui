"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createStudent, resetCreateStudentState } from "../../../redux/slices/studentSlices/studentSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";

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

const FormCheckbox = ({ label, name, checked, onChange, className = "" }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-[#0B4B31] bg-[#D5E2DB] border-gray-300 rounded focus:ring-[#0B4B31]"
        />
      </div>
      <label className="ml-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
    </div>
  );
};

const FormDropdown = ({ label, name, value, options, onChange, placeholder = "Select", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

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
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-[#0B4B31]">▾</span>
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange({ target: { name, value: option.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === option.value ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DateInput = ({ label, name, value, onChange, placeholder, required = false, className = "" }) => {
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${month}-${day}-${year}`;
    }
    
    return dateString;
  };

  const handleDateChange = (e) => {
    let input = e.target.value;
    
    input = input.replace(/\D/g, '');
    
    if (input.length > 2) {
      input = input.substring(0, 2) + '-' + input.substring(2);
    }
    if (input.length > 5) {
      input = input.substring(0, 5) + '-' + input.substring(5, 9);
    }
    
    onChange({
      target: {
        name: e.target.name,
        value: input
      }
    });
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={formatDateForDisplay(value)}
          onChange={handleDateChange}
          placeholder={placeholder}
          required={required}
          maxLength={10}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        />
        <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]/60 pointer-events-none" />
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-2">Format: MM-DD-YYYY (e.g., 05-15-2010)</p>
    </div>
  );
};

const convertToISODate = (dateString) => {
  if (!dateString) return null;
  
  const [month, day, year] = dateString.split('-');
  if (!month || !day || !year) return null;
  
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900 || yearNum > 2100) {
    return null;
  }
  
  const isoDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  return isoDate.toISOString();
};

export default function AddStudentSimpleForm() {
  const dispatch = useDispatch();
  const { status, error, student, parent, existingParent } = useSelector((state) => state.createStudent);
  const { classNames, loading: classesLoading, error: classesError } = useSelector((state) => state.getAllClassesName);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    spouse: "",
    spousePhone: "",
    emergencyPhone: "",
    parentEmail: "",
    parentPassword: "",
    identityNumber: "",
    addToWaitList: false,

    studentName: "",
    studentPhone: "",
    studentAddress: "",
    dateOfBirth: "",
    gender: "",
    enrollDate: "",
    fee: "",
    studentEmail: "",
    studentPassword: "",
    class: "", 
    studentAddToWaitList: false, 
  });

  useEffect(() => {
    dispatch(getAllClassesNameAction());
  }, [dispatch]);

  const classOptions = classNames.map(classItem => ({
    label: classItem.name,
    value: classItem._id 
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName) {
      alert("Student Name is required");
      return;
    }

    if (!formData.class) {
      alert("Please select a class");
      return;
    }

    const studentData = {
      // Parent data
      fullName: formData.fullName,
      address: formData.address,
      phone: formData.phone,
      spouse: formData.spouse,
      spousePhone: formData.spousePhone,
      emergencyPhone: formData.emergencyPhone,
      addToWaitList: formData.addToWaitList ? "yes" : "no",
      email: formData.parentEmail,
      password: formData.parentPassword,
      identityNumber: formData.identityNumber,

      // Student data
      studentName: formData.studentName,
      studentPhone: formData.studentPhone,
      studentAddress: formData.studentAddress,
      addToWaitList: formData.studentAddToWaitList ? "yes" : "no",
      dateOfBirth: convertToISODate(formData.dateOfBirth),
      gender: formData.gender,
      enrollDate: convertToISODate(formData.enrollDate),
      fee: formData.fee,
      studentEmail: formData.studentEmail,
      studentPassword: formData.studentPassword,
      class: formData.class, // This now contains the class ID
    };

    dispatch(createStudent(studentData));
  };

  useEffect(() => {
    if (status === "succeeded") {
      setFormData({
        fullName: "",
        address: "",
        phone: "",
        spouse: "",
        spousePhone: "",
        emergencyPhone: "",
        parentEmail: "",
        parentPassword: "",
        identityNumber: "",
        addToWaitList: false,
        studentName: "",
        studentPhone: "",
        studentAddress: "",
        dateOfBirth: "",
        gender: "",
        enrollDate: "",
        fee: "",
        studentEmail: "",
        studentPassword: "",
        class: "", // Reset class selection
        studentAddToWaitList: false,
      });

      console.log("Student created successfully:", { student, parent, existingParent });

      setTimeout(() => {
        dispatch(resetCreateStudentState());
      }, 3000);
    }
  }, [status, student, parent, existingParent, dispatch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status Messages */}
      {status === "loading" && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center">
          Creating student...
        </div>
      )}

      {status === "succeeded" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-full text-center">
          {existingParent
            ? "Existing parent found. New student linked successfully!"
            : "New student and parent created successfully!"}
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center">
          Error: {error}
        </div>
      )}

      {/* Classes Loading/Error Messages */}
      {classesLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center">
          Loading classes...
        </div>
      )}

      {classesError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-full text-center">
          Warning: Could not load classes - {classesError}
        </div>
      )}

      {/* Parent Information Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Parent Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Parent Full Name"
          />
          <FormInput
            label="Identity Number"
            name="identityNumber"
            value={formData.identityNumber}
            onChange={handleChange}
            placeholder="Identity Number"
          />
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Parent Address"
          />
          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Parent Phone"
          />
          <FormInput
            label="Spouse Name"
            name="spouse"
            value={formData.spouse}
            onChange={handleChange}
            placeholder="Spouse Name"
          />
          <FormInput
            label="Spouse Phone"
            name="spousePhone"
            value={formData.spousePhone}
            onChange={handleChange}
            placeholder="Spouse Phone"
          />
          <FormInput
            label="Emergency Phone"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="Emergency Phone"
          />
          <FormInput
            label="Email"
            name="parentEmail"
            type="email"
            value={formData.parentEmail}
            onChange={handleChange}
            placeholder="Parent Email"
          />
          <FormInput
            label="Password"
            name="parentPassword"
            type="password"
            value={formData.parentPassword}
            onChange={handleChange}
            placeholder="Parent Password"
          />
          <div className="flex items-center md:col-span-2">
            <FormCheckbox
              label="Add To Waiting List"
              name="addToWaitList"
              checked={formData.addToWaitList}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Student Information Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Student Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Student Name"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />
          <FormInput
            label="Student Address"
            name="studentAddress"
            value={formData.studentAddress}
            onChange={handleChange}
            placeholder="Student Address"
          />
          <DateInput
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="MM-DD-YYYY"
            required
          />
          <DateInput
            label="Enroll Date"
            name="enrollDate"
            value={formData.enrollDate}
            onChange={handleChange}
            placeholder="MM-DD-YYYY"
          />
          <FormInput
            label="Fee"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            placeholder="Fee"
          />
          <FormInput
            label="Student Phone"
            name="studentPhone"
            value={formData.studentPhone}
            onChange={handleChange}
            placeholder="Student Phone"
          />
          <FormInput
            label="Student Email"
            name="studentEmail"
            type="email"
            value={formData.studentEmail}
            onChange={handleChange}
            placeholder="Student Email"
          />
          <FormInput
            label="Student Password"
            name="studentPassword"
            type="password"
            value={formData.studentPassword}
            onChange={handleChange}
            placeholder="Student Password"
          />
          <FormDropdown
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]}
            placeholder="Select Gender"
          />
          <FormDropdown
            label="Class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            options={classOptions}
            placeholder={classesLoading ? "Loading classes..." : "Select Class"}
            className={classesLoading ? "opacity-50 cursor-not-allowed" : ""}
          />
          <div className="flex items-center md:col-span-2">
            <FormCheckbox
              label="Add To Waiting List"
              name="studentAddToWaitList"
              checked={formData.studentAddToWaitList}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Create Student Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={status === "loading" || classesLoading}
          className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
            status === "loading" || classesLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
          }`}
        >
          {status === "loading" ? "Creating Student..." : "Create Student"}
        </button>
      </div>
    </form>
  );
}