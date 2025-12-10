"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAttendance,
  resetAttendanceState
} from "@/redux/slices/attendanceSlices/attendanceSlices";
import { getTeachersName, resetTeachersNameState, getTeacherDetail } from "@/redux/slices/teacherSlices/teacherSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getCookie } from "cookies-next";

// CalendarWidget component remains the same
const CalendarWidget = ({ selectedDate, onDateChange }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate);
  }, [selectedDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const days = Array.from({ length: startingDayOfWeek }, () => null)
      .concat(Array.from({ length: lastDay.getDate() }, (_, i) => i + 1));
    return days;
  };

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const handleDateClick = (day) => {
    if (day !== null) {
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      setViewDate(newDate);
      onDateChange(newDate);
    }
  };
  const isSelected = (day) => selectedDate && day !== null &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewDate.getMonth() &&
    selectedDate.getFullYear() === viewDate.getFullYear();

  const days = getDaysInMonth(viewDate);

  return (
    <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="text-[#0B4B31] hover:text-[#0B4B31]/70 transition"><ChevronLeft size={20} /></button>
        <h3 className="text-lg font-semibold text-[#0B4B31]">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
        <button onClick={handleNextMonth} className="text-[#0B4B31] hover:text-[#0B4B31]/70 transition"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => <div key={day} className="text-center text-xs font-semibold text-[#627169] py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(day)}
            disabled={day === null}
            className={`aspect-square flex items-center justify-center text-sm font-medium rounded-full transition
              ${day === null ? "cursor-default" : "cursor-pointer hover:bg-[#E5EFEB]"}
              ${isSelected(day) ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"}`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

// StatusDropdown component remains the same
const StatusDropdown = ({ studentId, currentStatus, onStatusChange, onReasonChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [reason, setReason] = useState("");

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(studentId, newStatus);
    if (newStatus !== "Absent") {
      setReason("");
      onReasonChange(studentId, "");
    }
  };

  const handleReasonChange = (newReason) => {
    setReason(newReason);
    onReasonChange(studentId, newReason);
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-lg border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
        <option value="Excused">Excused</option>
      </select>

      {status === "Absent" && (
        <input
          type="text"
          placeholder="Reason for absence"
          value={reason}
          onChange={(e) => handleReasonChange(e.target.value)}
          className="rounded-lg border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] placeholder:text-[#627169]"
        />
      )}
    </div>
  );
};

export default function AttendancePage() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState({});
  const [reasons, setReasons] = useState({});
  const datePickerRef = useRef(null);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  const role = user?.role;

  const { classNames, loading: classesLoading } = useSelector((state) => state.getAllClassesName);
  const { teacherNames, loading: teachersLoading } = useSelector((state) => state.getTeachersName);
  const { detail: teacherDetail, loading: teacherDetailLoading } = useSelector((state) => state.getTeacherDetail);
  const { loading: attendanceLoading, success: attendanceSuccess, error: attendanceError } = useSelector((state) => state.attendance);
  console.log("teacherNames",teacherNames);

  // Get students from the selected class
  const getStudentsFromSelectedClass = () => {
    if (!teacherDetail?.assignedClasses || !selectedClass) return [];

    const selectedClassData = teacherDetail.assignedClasses.find(
      cls => cls._id === selectedClass
    );

    return selectedClassData?.students || [];
  };

  const tableData = getStudentsFromSelectedClass();
  const teacherClasses = teacherDetail?.assignedClasses || [];

  useEffect(() => {
    dispatch(getAllClassesNameAction());
    if (role === "Admin" || role === "Super Admin") {
      dispatch(getTeachersName());
    } else if (role === "Teacher" && user?.id) {
      setSelectedTeacher(user.id);
      dispatch(getTeacherDetail(user.id));
    }
    return () => {
      dispatch(resetAttendanceState());
      dispatch(resetTeachersNameState());
    };
  }, [dispatch, role, user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (role === "Admin" || role === "Super Admin"  && selectedTeacher) {
      dispatch(getTeacherDetail(selectedTeacher));
      setSelectedClass("");
    }
  }, [selectedTeacher, dispatch, role]);

  const handleStatusChange = (studentId, status) => {
    setStatusDropdowns(prev => ({ ...prev, [studentId]: status }));
  };

  const handleReasonChange = (studentId, reason) => {
    setReasons(prev => ({ ...prev, [studentId]: reason }));
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${date.getFullYear()}`;
  };

  const handleSaveAttendance = () => {
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const attendanceData = tableData.map(student => ({
      studentId: student._id,
      status: statusDropdowns[student._id] || "Present",
      reason: reasons[student._id] || "",
    }));

    dispatch(markAttendance({
      classId: selectedClass,
      teacherId: selectedTeacher,
      date: selectedDate,
      records: attendanceData
    }));
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] sm:text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        {/* Title + Export Button */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#104D2E]">Attendance</h2>

        </div>


        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {role === "Admin" || role === "Super Admin" && (
              <div className="relative flex-1">
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                >
                  <option value="">Select Teacher</option>
                  {teachersLoading ? (
                    <option disabled>Loading teachers...</option>
                  ) : (
                    teacherNames.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.fullName}
                      </option>
                    ))
                  )}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
              </div>
            )}

            {/* Show teacher name for Teacher role */}
            {role === "Teacher" && (
              <div className="relative flex-1">
                <div className="w-full rounded-full border border-[#C5D2CD] bg-gray-50 py-3 pl-4 pr-10 text-sm text-[#0B4B31]">
                  {user?.fullName || "Teacher"}
                </div>
              </div>
            )}

            <div className="relative flex-1" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] flex items-center justify-between"
              >
                <span>{selectedDate ? formatDate(selectedDate) : "Select the Date"}</span>
                <span className="text-[#0B4B31]">▾</span>
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 z-50 shadow-lg">
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onDateChange={date => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!selectedTeacher || teacherDetailLoading}
                className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] disabled:opacity-50"
              >
                <option value="">Select Class</option>
                {teacherDetailLoading ? (
                  <option disabled>Loading classes...</option>
                ) : (
                  teacherClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))
                )}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
            </div>

            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={attendanceLoading || !selectedTeacher || !selectedClass}
              className="rounded-full border-2 border-white bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 whitespace-nowrap disabled:opacity-50"
            >
              {attendanceLoading ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {attendanceError && <p className="mt-2 text-red-500 text-sm">{attendanceError}</p>}
        {attendanceSuccess && <p className="mt-2 text-green-600 text-sm">Attendance saved successfully!</p>}
      </section>

      {selectedTeacher && selectedClass && (
        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm sm:px-10">
          <h3 className="text-lg font-semibold text-[#104D2E] mb-6">Student Attendance</h3>

          {teacherDetailLoading ? (
            <div className="text-center py-8">
              <p className="text-[#627169]">Loading students...</p>
            </div>
          ) : tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E7E4]">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#627169]">Student ID</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#627169]">Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#627169]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((student, index) => (
                    <tr key={student._id} className="border-b border-[#E2E7E4] last:border-b-0">
                      <td className="py-4 px-4 text-sm text-[#0B4B31]">{student._id}</td>
                      <td className="py-4 px-4 text-sm text-[#0B4B31]">{student.studentName}</td>
                      <td className="py-4 px-4">
                        <StatusDropdown
                          studentId={student._id}
                          currentStatus={statusDropdowns[student._id] || "Present"}
                          onStatusChange={handleStatusChange}
                          onReasonChange={handleReasonChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#627169]">No students found for this class.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}