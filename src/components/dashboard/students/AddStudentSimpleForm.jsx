"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStudent, resetCreateStudentState } from "../../../redux/slices/studentSlices/studentSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { FormInput } from "@/components/FormInput";
import { FormCheckbox } from "@/components/FormCheckbox";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import CustomDatePicker from "@/components/DatePicker";
import { getAdminId,getUserBranch } from "@/utils/getCookies";

export default function AddStudentSimpleForm() {
  const dispatch = useDispatch();
  const { status, error, student, parent, existingParent } = useSelector((state) => state.createStudent);
  const { classNames, loading: classesLoading, error: classesError } = useSelector((state) => state.getAllClassesName);
  const adminId = getAdminId();
  const branch = getUserBranch();

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

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    class: false
  });

  useEffect(() => {
    dispatch(getAllClassesNameAction(adminId));
  }, [dispatch]);

  const classOptions = classNames.map(classItem => ({
    label: classItem.name,
    value: classItem._id 
  }));

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdownSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownStates((prev) => ({ ...prev, [name]: false }));
  };

  const toggleDropdown = (name) => {
    setDropdownStates((prev) => ({ 
      ...prev, 
      [name]: !prev[name] 
    }));
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
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender,
      enrollDate: formData.enrollDate || null,
      fee: formData.fee,
      studentEmail: formData.studentEmail,
      studentPassword: formData.studentPassword,
      class: formData.class,
      adminId,branch

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

      // Reset dropdown states
      setDropdownStates({
        gender: false,
        class: false
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
          <CustomDatePicker
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="Select date of birth"
            required
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            dateFormat="MM/dd/yyyy"
          />
          <CustomDatePicker
            label="Enroll Date"
            name="enrollDate"
            value={formData.enrollDate}
            onChange={handleChange}
            placeholder="Select enroll date"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            dateFormat="MM/dd/yyyy"
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
          <SimpleDropdown
            label="Gender"
            name="gender"
            value={formData.gender}
            options={genderOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownStates.gender}
            onToggle={() => toggleDropdown('gender')}
            placeholder="Select Gender"
            required
          />
          <SimpleDropdown
            label="Class"
            name="class"
            value={formData.class}
            options={classOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownStates.class}
            onToggle={() => toggleDropdown('class')}
            placeholder={classesLoading ? "Loading classes..." : "Select Class"}
            required
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