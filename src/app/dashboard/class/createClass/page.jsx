"use client";
import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createClassAction } from "@/redux/slices/classSlices/classSlice";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { getCookie } from "cookies-next";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

const Page = () => {
  const dispatch = useDispatch();
  const { themeColor, mainText } = useTheme();
  const {
    loading,
    class: createdClass,
    error,
  } = useSelector((state) => state.createClass);
  const {
    teacherNames,
    status: teachersStatus,
    error: teachersError,
  } = useSelector((state) => state.getTeachersName);
  const adminId = getAdminId();
  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
  }, []);

  const isTeacher = user?.role === "Teacher";

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    subject: "",
    description: "",
    teacherId: "",
    teacherName: "",
    startDate: "",
    endDate: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    dispatch(getTeachersName(adminId));
  }, [dispatch]);

  useEffect(() => {
    if (isTeacher && user?.id) {
      setFormData((prev) => ({
        ...prev,
        teacherId: user.id,
        teacherName: `Teacher - ${user.email.split("@")[0]}`,
      }));
    }
  }, [isTeacher, user]);

  const teacherOptions = useMemo(() => {
    if (!teacherNames || !Array.isArray(teacherNames)) return [];

    return teacherNames.map((teacher) => ({
      value: teacher.id || teacher._id,
      label: `${teacher.fullName} - ${teacher.specialization}`,
      teacherData: teacher,
    }));
  }, [teacherNames]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownToggle = (name) => {
    if (isTeacher) return;
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleDropdownSelect = (name, value) => {
    if (isTeacher) return;

    const selectedTeacher = teacherNames.find(
      (teacher) => teacher.id === value || teacher._id === value
    );

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      teacherName: selectedTeacher
        ? `${selectedTeacher.fullName} - ${selectedTeacher.specialization}`
        : "",
    }));
    setDropdownOpen(null);
  };

  const convertToISODate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalTeacherId = isTeacher ? user.id : formData.teacherId;

    if (!formData.name || !formData.subject || !finalTeacherId) {
      alert("Please fill all required fields: Name, Subject, and Teacher");
      return;
    }

    const classData = {
      name: formData.name,
      code: formData.code,
      subject: formData.subject,
      description: formData.description,
      teacherId: finalTeacherId,
      startDate: convertToISODate(formData.startDate),
      endDate: convertToISODate(formData.endDate),
      adminId,
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
        teacherId: isTeacher ? user.id : "",
        teacherName: isTeacher ? `Teacher - ${user.email.split("@")[0]}` : "",
        startDate: "",
        endDate: "",
      });
    }
  }, [createdClass, isTeacher, user]);

  const fetchingTeachers = teachersStatus === "loading";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-1" style={{ color: themeColor }}>
        Welcome to
      </h1>
      <p className="text-lg sm:text-xl font-semibold text-[#0E0E0E] mb-8">
        {mainText || "MaktabOS"}
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-7xl">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">
          Create Class
        </h2>

        {/* Status Messages */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center mb-6">
            Creating class...
          </div>
        )}

        {createdClass && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-full text-center mb-6">
            Class created successfully!
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
            <FormInput
              label="Class Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Class Name"
              required={true}
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              required={true}
            />

            <SimpleDropdown
              label="Teacher"
              name="teacherId"
              value={formData.teacherId}
              options={teacherOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder={
                isTeacher
                  ? `Teacher - ${user.email.split("@")[0]}`
                  : fetchingTeachers
                  ? "Loading teachers..."
                  : "Select a teacher"
              }
              required={true}
              disabled={isTeacher}
            />

            <FormInput
              label="Class Code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Class Code (optional)"
            />

            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />

            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="sm:col-span-2">
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Class Description (optional)"
              className="w-full"
            />
          </div>

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
              {loading ? "Creating Class..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;