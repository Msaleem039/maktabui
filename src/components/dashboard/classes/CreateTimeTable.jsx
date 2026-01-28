"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTimetableAction } from "@/redux/slices/timetableSlices/timetableSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

const CreateTimeTable = () => {
  const adminId = getAdminId();
  const dispatch = useDispatch();
  const { mainText } = useTheme();
  const {
    loading: creatingTimetable,
    timetable: createdTimetable,
    error: timetableError,
  } = useSelector((state) => state.createTimetable);
  const {
    classNames,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.getAllClassesName);
  const {
    teacherNames,
    status: teachersStatus,
    error: teachersError,
  } = useSelector((state) => state.getTeachersName);

  const [formData, setFormData] = useState({
    classId: "",
    teacherId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    subject: "",
    topic: "",
    adminId: adminId,
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  
  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  useEffect(() => {
    dispatch(getAllClassesNameAction(adminId));
    dispatch(getTeachersName(adminId));
  }, [dispatch]);

  const handleDropdownToggle = (name) => {
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownOpen(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { classId, teacherId, dayOfWeek, startTime, endTime, subject,adminId } =
      formData;
    if (
      !classId ||
      !teacherId ||
      !dayOfWeek ||
      !startTime ||
      !endTime ||
      !subject ||
      !adminId
    ) {
      alert(
        "Please fill all required fields: Class, Teacher, Day, Start Time, End Time, and Subject"
      );
      return;
    }

    dispatch(createTimetableAction(formData));
  };

  useEffect(() => {
    if (createdTimetable) {
      setFormData({
        classId: "",
        teacherId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        subject: "",
        topic: "",
      });
    }
  }, [createdTimetable]);

  const fetchingTeachers = teachersStatus === "loading";
  const fetchingClasses = classesLoading;

  const classOptions = classNames.map((cls) => ({
    value: cls._id || cls.id,
    label: cls.name,
  }));

  const teacherOptions = teacherNames.map((teacher) => ({
    value: teacher._id || teacher.id,
    label: `${teacher.fullName} - ${teacher.specialization}`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#104D2E] mb-1">
        Welcome to
      </h1>
      <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">
        {mainText || "MaktabOS"}
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">
          Create Timetable
        </h2>

        {/* Status Messages */}
        {creatingTimetable && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center mb-6">
            Creating timetable...
          </div>
        )}

        {createdTimetable && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-full text-center mb-6">
            Timetable created successfully!
          </div>
        )}

        {timetableError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error: {timetableError}
          </div>
        )}

        {teachersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error loading teachers: {teachersError}
          </div>
        )}

        {classesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error loading classes: {classesError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SimpleDropdown
              label="Class"
              name="classId"
              value={formData.classId}
              options={classOptions}
              isOpen={dropdownOpen === "classId"}
              onToggle={handleDropdownToggle}
              placeholder={
                fetchingClasses ? "Loading classes..." : "Select a class"
              }
              required
              onSelect={handleSelect}
              disabled={fetchingClasses}
            />

            <SimpleDropdown
              label="Teacher"
              name="teacherId"
              value={formData.teacherId}
              options={teacherOptions}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder={
                fetchingTeachers ? "Loading teachers..." : "Select a teacher"
              }
              required
              onSelect={handleSelect}
              disabled={fetchingTeachers}
            />

            <SimpleDropdown
              label="Day of Week"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              options={dayOptions}
              isOpen={dropdownOpen === "dayOfWeek"}
              onToggle={handleDropdownToggle}
              placeholder="Select day"
              required
              onSelect={handleSelect}
            />

            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              required
            />

            <FormInput
              label="Topic"
              name="topic"
              type="text"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter topic (optional)"
              className="sm:col-span-2"
            />
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={
                creatingTimetable || fetchingTeachers || fetchingClasses
              }
              className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                creatingTimetable || fetchingTeachers || fetchingClasses
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
              }`}
            >
              {creatingTimetable ? "Creating Timetable..." : "Create Timetable"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTimeTable;
