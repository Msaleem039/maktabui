"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
  getTimetableByIdAction, 
  updateTimetableByIdAction
} from "@/redux/slices/timetableSlices/timetableSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";
import Link from "next/link";

const EditTimetable = () => {
  const adminId = getAdminId();
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const timetableId = params.id;

  // Access both timetable states separately
  const timetableByIdState = useSelector((state) => state.getTimetableById);
  const updateTimetableState = useSelector((state) => state.updateTimetableById);
  
  const {
    loading: timetableLoading,
    timetable: currentTimetable,
    error: timetableError,
  } = timetableByIdState;

  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess
  } = updateTimetableState;

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
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [localUpdateSuccess, setLocalUpdateSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

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
  }, [currentTimetable, formData, updateLoading, updateSuccess, updateError]);

  useEffect(() => {
    if (timetableId) {
      dispatch(getTimetableByIdAction(timetableId));
    }
    if (adminId) {
      dispatch(getAllClassesNameAction(adminId));
      dispatch(getTeachersName(adminId));
    }
  }, [dispatch, timetableId, adminId]);

  useEffect(() => {
    if (currentTimetable && currentTimetable._id === timetableId) {
      setFormData({
        classId: currentTimetable.class?._id || currentTimetable.class || "",
        teacherId: currentTimetable.teacher?._id || currentTimetable.teacher || "",
        dayOfWeek: currentTimetable.dayOfWeek || "",
        startTime: currentTimetable.startTime ? formatTimeForInput(currentTimetable.startTime) : "",
        endTime: currentTimetable.endTime ? formatTimeForInput(currentTimetable.endTime) : "",
        subject: currentTimetable.subject || "",
        topic: currentTimetable.topic || "",
      });
    }
  }, [currentTimetable, timetableId]);

  useEffect(() => {
    if (updateSuccess) {
      setLocalUpdateSuccess(true);
      }
  }, [updateSuccess, router]);

  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";
    if (timeString.includes(':')) {
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }
    return timeString;
  };

  const handleDropdownToggle = (name) => {
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownOpen(null);
    setValidationError(""); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    const { classId, teacherId, dayOfWeek, startTime, endTime, subject } = formData;
    
    if (!classId || !teacherId || !dayOfWeek || !startTime || !endTime || !subject) {
      setValidationError("Please fill all required fields: Class, Teacher, Day, Start Time, End Time, and Subject");
      return;
    }

    if (startTime >= endTime) {
      setValidationError("End time must be after start time");
      return;
    }

    if (!adminId) {
      setValidationError("Admin ID not found. Please log in again.");
      return;
    }

    // Ensure times are in correct format
    const formattedStartTime = startTime.length === 5 ? startTime : `${startTime}:00`;
    const formattedEndTime = endTime.length === 5 ? endTime : `${endTime}:00`;

    const submissionData = {
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      adminId
    };

    dispatch(updateTimetableByIdAction({ 
      timetableId, 
      formData: submissionData 
    })).then((result) => {
      console.log('Update result:', result);
      if (result.error) {
        console.error('Update failed:', result.error);
      } else {
        console.log('Update successful:', result.payload);
      }
    });
  };

  const fetchingTeachers = teachersStatus === "loading";
  const fetchingClasses = classesLoading;

  const classOptions = (classNames || []).map((cls) => ({
    value: cls._id || cls.id,
    label: cls.name,
  }));

  const teacherOptions = (teacherNames || []).map((teacher) => ({
    value: teacher._id || teacher.id,
    label: `${teacher.fullName} - ${teacher.specialization}`,
  }));

  const isSubmitting = updateLoading;
  const isLoadingData = timetableLoading || fetchingTeachers || fetchingClasses;

  if (timetableLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[#0B4B31]">Loading timetable...</p>
        </div>
      </div>
    );
  }

  if (timetableError && !currentTimetable) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading timetable: {timetableError}</p>
          <Link
            href="/dashboard/timetable"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
          >
            <ArrowLeft size={16} />
            Back to Timetables
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">
            Welcome to
          </p>
          <h1 className="text-[1.75rem] font-medium text-[#000000]">
            MaktabOS
          </h1>
        </div>

        <Link
          href="/dashboard/timetable"
          className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back to Timetables
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">
          Edit Timetable
        </h2>

        {/* Status Messages */}
        <div className="space-y-4 mb-6">
          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-700 font-medium">
                  {validationError}
                </span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {localUpdateSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">
                  Timetable updated successfully!
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1 text-center">
                Redirecting you back to timetables page...
              </p>
            </div>
          )}

          {/* Update Progress */}
          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={18} className="animate-spin text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Updating timetable...
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-2 text-center">
                Saving your changes to the database.
              </p>
            </div>
          )}

          {/* Error Messages */}
          {updateError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-700 font-medium">
                  Error updating timetable:
                </span>
              </div>
              <p className="text-sm text-red-600 mt-1 text-center">
                {updateError}
              </p>
            </div>
          )}

          {teachersError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">
                Error loading teachers: {teachersError}
              </p>
            </div>
          )}

          {classesError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">
                Error loading classes: {classesError}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SimpleDropdown
              label="Class"
              name="classId"
              value={formData.classId}
              options={classOptions}
              onSelect={handleSelect}
              isOpen={dropdownOpen === "classId"}
              onToggle={handleDropdownToggle}
              placeholder={fetchingClasses ? "Loading classes..." : "Select a class"}
              required={true}
              disabled={isSubmitting || isLoadingData || fetchingClasses}
            />

            <SimpleDropdown
              label="Teacher"
              name="teacherId"
              value={formData.teacherId}
              options={teacherOptions}
              onSelect={handleSelect}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder={fetchingTeachers ? "Loading teachers..." : "Select a teacher"}
              required={true}
              disabled={isSubmitting || isLoadingData || fetchingTeachers}
            />

            <SimpleDropdown
              label="Day of Week"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              options={dayOptions}
              onSelect={handleSelect}
              isOpen={dropdownOpen === "dayOfWeek"}
              onToggle={handleDropdownToggle}
              placeholder="Select day"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              placeholder="Select start time"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              placeholder="Select end time"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="Topic"
              name="topic"
              type="text"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter topic (optional)"
              className="sm:col-span-2"
              disabled={isSubmitting || isLoadingData}
            />
          </div>

          <div className="flex justify-center pt-6 gap-4">
            <Link
              href="/dashboard/timetable"
              className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                isSubmitting || isLoadingData
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
              onClick={(e) => {
                if (isSubmitting || isLoadingData) e.preventDefault();
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingData}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition flex items-center gap-2 ${
                isSubmitting || isLoadingData
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating Timetable...
                </>
              ) : (
                "Update Timetable"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimetable;