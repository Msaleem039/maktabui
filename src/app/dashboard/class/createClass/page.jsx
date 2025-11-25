"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClassAction } from "@/redux/slices/classSlices/classSlice";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices"; 
import CustomDatePicker from "@/components/DatePicker";

const CustomField = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
  if (type === "textarea") {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows="3"
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-2xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#0B4B31]/30"
        />
      </div>
    );
  }

  if (type === "date") {
    return (
      <CustomDatePicker
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    );
  }

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

const DropdownField = ({ label, name, value, options, onSelect, isOpen, onToggle, placeholder, required = false, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div
        className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        onClick={() => onToggle(name)}
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
              key={option._id || option.id}
              onClick={() => onSelect(name, option._id || option.id, option)}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === (option._id || option.id) ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"
              }`}
            >
              {option.fullName} - {option.specialization}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Page = () => {
    const dispatch = useDispatch();
    const { loading, class: createdClass, error } = useSelector((state) => state.createClass);
    const { teacherNames, status: teachersStatus, error: teachersError } = useSelector((state) => state.getTeachersName);
    
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        subject: "",
        description: "",
        teacherId: "",
        startDate: "",
        endDate: ""
    });
    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(() => {
        dispatch(getTeachersName());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDropdownToggle = (name) => {
        setDropdownOpen(prev => prev === name ? null : name);
    };

    const handleDropdownSelect = (name, value, selectedTeacher) => {
        setFormData(prev => ({
            ...prev,
            [name]: value, // This stores the teacher ID
            teacherName: selectedTeacher ? `${selectedTeacher.fullName} - ${selectedTeacher.specialization}` : "" // Store display name
        }));
        setDropdownOpen(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.subject || !formData.teacherId) {
            alert('Please fill all required fields: Name, Subject, and Teacher');
            return;
        }

        const classData = {
            name: formData.name,
            code: formData.code,
            subject: formData.subject,
            description: formData.description,
            teacherId: formData.teacherId, // This is the ID that gets sent to the backend
            startDate: formData.startDate || null,
            endDate: formData.endDate || null
        };

        dispatch(createClassAction(classData));
    };

    useEffect(() => {
        if (createdClass) {
            setFormData({
                name: "",
                code: "",
                subject: "",
                description: "",
                teacherId: "",
                teacherName: "",
                startDate: "",
                endDate: ""
            });
        }
    }, [createdClass]);

    // Get loading state for teachers
    const fetchingTeachers = teachersStatus === "loading";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">Welcome to</h1>
            <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">MaktabOS</p>

            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
                <h2 className="text-lg font-semibold mb-6 text-[#000000]">Create Class</h2>

                {/* Status Messages */}
                {loading && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center mb-6">
                        Creating class...
                    </div>
                )}

                {createdClass && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-full text-center mb-6">
                        Class created successfully! (UI Testing Mode)
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
                        Error: {error}
                    </div>
                )}

                {teachersError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
                        Error loading teachers: {teachersError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <CustomField
                            label="Class Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Class Name"
                            required={true}
                        />

                        <CustomField
                            label="Subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Subject"
                            required={true}
                        />

                        <DropdownField
                            label="Teacher"
                            name="teacherId"
                            value={formData.teacherName} // Display the stored teacher name
                            options={teacherNames}
                            onSelect={handleDropdownSelect}
                            isOpen={dropdownOpen === "teacherId"}
                            onToggle={handleDropdownToggle}
                            placeholder={fetchingTeachers ? "Loading teachers..." : "Select a teacher"}
                            required={true}
                        />

                        <CustomField
                            label="Class Code"
                            name="code"
                            type="text"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="Class Code (optional)"
                        />

                        <CustomField
                            label="Start Date"
                            name="startDate"
                            placeholder="MM-DD-YYYY"
                            type="date"
                            value={formData.startDate}
                            onChange={handleInputChange}
                        />

                        <CustomField
                            label="End Date"
                            name="endDate"
                            placeholder="MM-DD-YYYY"
                            type="date"
                            value={formData.endDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <CustomField
                        label="Description"
                        name="description"
                        type="textarea"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Class Description (optional)"
                        className="sm:col-span-2"
                    />

                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={loading || fetchingTeachers}
                            className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                                loading || fetchingTeachers
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
                            }`}
                        >
                            {loading ? 'Creating Class...' : 'Create Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;