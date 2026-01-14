"use client";

import { useState, useEffect } from "react";
import { Calendar, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateStudentById,
  resetUpdateStudentState,
  clearUpdateStudentError,
  resetSuccessStatus,
} from "@/redux/slices/studentSlices/studentSlices";

import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getAdminId } from "@/utils/getCookies";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
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

export default function EditStudentForm({ studentId, student }) {
  const dispatch = useDispatch();

  const {
    status: updateStatus,
    error: updateError,
    success: updateSuccess,
  } = useSelector((state) => state.updateStudent);
  const { classNames, loading: classesLoading } = useSelector(
    (state) => state.getAllClassesName
  );
  const adminId = getAdminId();

  const [studentData, setStudentData] = useState({
    name: "",
    phone: "",
    address: "",
    classes: [],
    fee: "",
  });

  const [dropdownStates, setDropdownStates] = useState({
    classes: false,
  });

  useEffect(() => {
    dispatch(getAllClassesNameAction(adminId));
  }, [dispatch]);

  useEffect(() => {
    if (student) {
      setStudentData({
        id: studentId,
        name: student.name || "",
        phone: student.phone || "",
        address: student.address || "",
        classes: Array.isArray(student.classes)
          ? student.classes.map((cls) =>
              typeof cls === "string" ? cls : cls._id
            )
          : student.class
          ? [
              typeof student.class === "string"
                ? student.class
                : student.class._id,
            ]
          : [],
        fee: student.fee?.toString() || "",
      });
    }
  }, [student]);

  useEffect(() => {
    if (updateSuccess) {
      console.log("Student updated successfully!");
      setTimeout(() => {
        dispatch(resetSuccessStatus());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownToggle = (name) => {
    setDropdownStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleItemToggle = (itemId, itemLabel) => {
    setStudentData((prev) => {
      const currentClasses = prev.classes || [];
      const isSelected = currentClasses.includes(itemId);

      if (isSelected) {
        return {
          ...prev,
          classes: currentClasses.filter((id) => id !== itemId),
        };
      } else {
        return {
          ...prev,
          classes: [...currentClasses, itemId],
        };
      }
    });
  };

  const isItemSelected = (itemId) => {
    return (studentData.classes || []).includes(itemId);
  };

  const getDisplayValue = () => {
    const selectedClasses = studentData.classes || [];
    if (selectedClasses.length === 0) return "";

    const classMap = {};
    classOptions.forEach((option) => {
      if (option.value) classMap[option.value] = option.label || option.name;
    });

    const selectedNames = selectedClasses
      .map((classId) => classMap[classId])
      .filter(Boolean);

    if (selectedNames.length === 0) return "";
    if (selectedNames.length === 1) return selectedNames[0];
    if (selectedNames.length === 2) return selectedNames.join(" and ");
    return `${selectedNames[0]} and ${selectedNames.length - 1} more`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      id: studentId,
      name: studentData.name,
      phone: studentData.phone,
      address: studentData.address,
      classes: studentData.classes,
      fee: studentData.fee ? parseInt(studentData.fee) : 0,
    };

    dispatch(updateStudentById(submitData));
  };

  const classOptions = classNames.map((cls) => ({
    label: cls.name || cls.className || "Unnamed Class",
    value: cls._id || cls.id || cls.name,
    name: cls.name || cls.className || "Unnamed Class",
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Edit Student Information
          </h3>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#E5EFEB] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
          >
            <Edit size={16} />
            Edit Student
          </button>
        </div>

        {/* Error Message */}
        {updateError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{updateError}</p>
            <button
              type="button"
              onClick={() => dispatch(clearUpdateStudentError())}
              className="text-red-500 hover:text-red-700 text-xs mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Message */}
        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm">Student updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Name */}
          <FormInput
            label="Student Name"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
            className="md:col-span-2"
          />

          <FormInput
            label="Phone"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />

          <FormInput
            label="Address"
            name="address"
            value={studentData.address}
            onChange={handleChange}
            placeholder="Your Address"
            required
          />

          <MultiSelectDropdown
            label="Classes"
            name="classes"
            value={studentData.classes}
            options={classOptions}
            isOpen={dropdownStates.classes}
            onToggle={handleDropdownToggle}
            onItemToggle={handleItemToggle}
            isItemSelected={isItemSelected}
            getDisplayValue={getDisplayValue}
            placeholder={
              classesLoading ? "Loading classes..." : "Select Classes"
            }
            required
          />

          <FormInput
            label="Monthly Fee"
            name="fee"
            type="number"
            value={studentData.fee}
            onChange={handleChange}
            placeholder="15000"
            required
          />
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={updateStatus === "loading"}
          className={`rounded-full bg-[#E5EFEB] px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] ${
            updateStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {updateStatus === "loading" ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}