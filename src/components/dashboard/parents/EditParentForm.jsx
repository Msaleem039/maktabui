"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getParentById,
  updateParent,
  clearUpdateParentError,
  resetUpdateParent,
} from "@/redux/slices/parentSlices/parentSlice";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import CustomDatePicker from "@/components/DatePicker";
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
  disabled = false,
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
        disabled={disabled}
        className={`w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

const FormDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        className={`w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30 ${
          disabled
            ? "opacity-60 cursor-not-allowed pointer-events-none"
            : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? "text-[#0B4B31]" : "text-[#0B4B31]/60"}>
          {value || placeholder}
        </span>
        <span className="text-[#0B4B31]">▾</span>
      </div>
      {isOpen && !disabled && (
        <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value || option._id || option}
              onClick={() => {
                onChange({
                  target: { name, value: option.value || option._id || option },
                });
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === (option.value || option._id || option)
                  ? "bg-[#0B4B31] text-white"
                  : "text-[#0B4B31]"
              }`}
            >
              {option.label || option.name || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditParentForm({ parentId }) {
  const dispatch = useDispatch();
  const { parent, getParentByIdStatus, getParentByIdError } = useSelector(
    (state) => state.getParentById,
  );

  // Get updateParent state from the updateParent slice
  const {
    loading: updateParentLoading,
    success: updateParentSuccess,
    error: updateParentError,
    data: updateParentData,
  } = useSelector(
    (state) =>
      state.updateParent || {
        loading: false,
        success: false,
        error: null,
        data: null,
      },
  );

  const {
    classNames,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.getAllClassesName);

  const adminId = getAdminId();

  const [parentData, setParentData] = useState({
    fullName: "",
    address: "",
    spouse: "",
    emergencyPhone: "",
    phone: "",
    spousePhone: "",
    email: "",
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
      class: "",
      email: "",
      password: "",
      _id: null,
    },
  ]);

  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(clearUpdateParentError());
  }, [dispatch]);

  useEffect(() => {
    if (adminId) {
      dispatch(getAllClassesNameAction(adminId));
    }
  }, [dispatch, adminId]);

  useEffect(() => {
    if (parentId) {
      dispatch(getParentById(parentId));
    }
  }, [dispatch, parentId]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateParent());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateParentSuccess) {
      dispatch(getParentById(parentId));

      const timer = setTimeout(() => {
        dispatch(resetUpdateParent());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [updateParentSuccess, dispatch, parentId]);

  useEffect(() => {
    if (parent) {
      setParentData({
        fullName: parent.fullName || "",
        address: parent.address || "",
        spouse: parent.spouse || "",
        emergencyPhone: parent.emergencyPhone || "",
        phone: parent.phone || "",
        spousePhone: parent.spousePhone || "",
        email: parent.email || "",
        identityNumber: parent.identityNumber || "",
        addToWaitList: parent.addToWaitList || false,
      });

      if (parent.students && parent.students.length > 0) {
        setChildren(
          parent.students.map((student) => ({
            studentName: student.studentName || "",
            address: student.address || "",
            dateOfBirth: student.dateOfBirth || "",
            phone: student.phone || "",
            addToWaitList: student.addToWaitList || false,
            gender: student.gender || "",
            enrollDate: student.enrollDate || "",
            fee: student.fee || "",
            class: student.class || student.classId || "",
            email: student.email || "",
            password: "",
            _id: student._id,
          })),
        );
      }
    }
  }, [parent]);

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChildChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: type === "checkbox" ? checked : value,
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
        class: "",
        email: "",
        password: "",
        _id: null,
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
    dispatch(clearUpdateParentError());

    try {
      const updateData = {
        fullName: parentData.fullName,
        address: parentData.address,
        spouse: parentData.spouse,
        emergencyPhone: parentData.emergencyPhone,
        phone: parentData.phone,
        spousePhone: parentData.spousePhone,
        email: parentData.email,
        identityNumber: parentData.identityNumber,
        addToWaitList: parentData.addToWaitList,
      };

      const studentObjects = children.map((child) => {
        const studentData = {
          _id: child._id || null,
          studentName: child.studentName,
          email: child.email,
          phone: child.phone,
          address: child.address,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
          enrollDate: child.enrollDate,
          fee: child.fee,
          class: child.class,
          addToWaitList: child.addToWaitList,
        };
        
        // Only include password for new students (when _id is null)
        if (!child._id && child.password) {
          studentData.password = child.password;
        }
        
        return studentData;
      });

      updateData.students = studentObjects;

      const submissionData = {
        parentId,
        updateData,
      };

      await dispatch(updateParent(submissionData)).unwrap();
    } catch (error) {
      console.error("Error updating parent:", error);
      setFormError(
        error.message || "An error occurred while processing your request.",
      );
    }
  };

  const classOptions =
    classNames?.map((className) => {
      if (typeof className === "object" && className !== null) {
        return {
          label: className.name || className.label || "Unnamed Class",
          value: className._id || className.value || "",
        };
      }
      return {
        label: className,
        value: className,
      };
    }) || [];

  const getClassNameDisplay = (classId) => {
    if (!classId) return "";

    const classObj = classNames?.find(
      (cls) => (typeof cls === "object" ? cls._id : cls) === classId,
    );

    if (typeof classObj === "object" && classObj !== null) {
      return classObj.name || classObj.label || "";
    }
    return classObj || "";
  };

  if (getParentByIdStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#0B4B31]">Loading parent data...</div>
      </div>
    );
  }

  if (classesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#0B4B31]">Loading classes...</div>
      </div>
    );
  }

  if (getParentByIdError) {
    return (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-semibold">Error loading parent data:</p>
        <p>{getParentByIdError}</p>
      </div>
    );
  }

  if (classesError) {
    return (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-semibold">Error loading classes:</p>
        <p>{classesError}</p>
      </div>
    );
  }

  return (
    <>
      {updateParentSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">
                Parent and students information updated successfully!
              </p>
              <p className="text-sm mt-1">
                All changes have been saved successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {updateParentError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Update Error:</p>
              <p>{updateParentError}</p>
            </div>
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Form Error:</p>
              <p>{formError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Parent/Guardian Information
          </h3>
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

        <div className="space-y-6 pt-6">
          {children.map((child, index) => (
            <div key={index} className="space-y-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-700">
                  Student {index + 1}
                  {!child._id && " (New)"}
                </h4>
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
                  required={!child._id}
                />
                <FormInput
                  label="Student Email"
                  name="email"
                  type="email"
                  value={child.email}
                  onChange={(e) => handleChildChange(index, e)}
                  placeholder="student.email@example.com"
                  required={!child._id}
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
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
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
                  value={getClassNameDisplay(child.class) || child.class}
                  onChange={(e) => handleChildChange(index, e)}
                  options={classOptions}
                  placeholder="Select Class"
                />
                {/* Password Field - Only for new students */}
                {!child._id && (
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    value={child.password}
                    onChange={(e) => handleChildChange(index, e)}
                    placeholder="Enter password for student"
                    required={!child._id}
                    className="md:col-span-2"
                  />
                )}
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
        </div>

        {/* Buttons Section - Add More Students parallel to Update button */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={addMoreStudents}
            className="flex-1 rounded-full border-2 border-[#0B4B31] bg-white px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#0B4B31]/10 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add More Students
          </button>
          
          <button
            type="submit"
            disabled={updateParentLoading}
            className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {updateParentLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Parent & Students"
            )}
          </button>
        </div>
      </form>
    </>
  );
}