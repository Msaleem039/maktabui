"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown, FileText, FolderCheck, UserCheck, GraduationCap, Clock, Calendar } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { getStudentDashboardStats, resetDashboardStatsState } from '@/redux/slices/studentSlices/studentSlices';

const Page = () => {
  const dispatch = useDispatch();

  const { data, status, error } = useSelector(state => state.getStudentDashboardStats);
  console.log("data", data);

  const studentId = "691f9111502b1d990b46066c";

  useEffect(() => {
    if (studentId) {
      dispatch(getStudentDashboardStats(studentId));
    }

    return () => {
      dispatch(resetDashboardStatsState());
    };
  }, [dispatch, studentId]);

  const {
    keyMetrics = {
      todaysClasses: 0,
      assignmentsDue: 0,
      attendancePercentage: 0,
      upcomingExams: 0
    },
    monthlyAttendance = [],
    studentAttendance = {
      attendance: {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
        percentage: 0
      },
      status: "N/A",
      yearlyStats: {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
        percentage: 0
      }
    },
    academicPerformance = {
      currentGrade: "N/A",
      classRank: "N/A",
      totalSubjects: 0,
      gpa: "0.0"
    },
    classSchedule = [],
    topStudents = [],
    assignmentsDueSoon = [],
    studentInfo = {
      name: "Student",
      class: "Not Assigned",
      email: ""
    }
  } = data || {};

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#0B4B31]">Loading dashboard...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Grid size={18} className="text-[#0B4B31]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Moon size={18} className="text-[#0B4B31]" />
            </button>
            <div className="flex items-center gap-2 bg-white border border-[#0B4B31] rounded-full px-2 py-1.5 pr-3 cursor-pointer hover:bg-emerald-50 shadow-sm">
              <div className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden">
                <Image
                  src="/main-dashboard.jpg"
                  alt="user"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">
                {studentInfo.name}
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Classes</p>
              <p className="text-3xl font-bold text-[#0B4B31]">{keyMetrics.todaysClasses}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <FileText size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assignments Due</p>
              <p className="text-3xl font-bold text-[#0B4B31]">{keyMetrics.assignmentsDue}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <FolderCheck size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance</p>
              <p className="text-3xl font-bold text-[#0B4B31]">{keyMetrics.attendancePercentage}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <UserCheck size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Exams</p>
              <p className="text-3xl font-bold text-[#0B4B31]">{keyMetrics.upcomingExams}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <GraduationCap size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Charts */}
      <div className="flex flex-col xl:flex-row gap-6 pb-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* Student Attendance Overview Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[#0B4B31] text-[14px] leading-[20px]">
                My Attendance Overview
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                studentAttendance.status === "Good" ? "bg-green-100 text-green-800" :
                studentAttendance.status === "Average" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                Status: {studentAttendance.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{studentAttendance.attendance.present}</p>
                <p className="text-sm text-green-600">Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{studentAttendance.attendance.absent}</p>
                <p className="text-sm text-red-600">Absent</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{studentAttendance.attendance.late}</p>
                <p className="text-sm text-yellow-600">Late</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{studentAttendance.attendance.total}</p>
                <p className="text-sm text-blue-600">Total Days</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Current Month: </span>
                <span className="font-semibold text-[#0B4B31]">{studentAttendance.attendance.percentage}%</span>
              </div>
              <div>
                <span className="text-gray-600">Yearly: </span>
                <span className="font-semibold text-[#0B4B31]">{studentAttendance.yearlyStats.percentage}%</span>
              </div>
            </div>
          </div>


        </div>

        {/* Right Cards */}
        <div className="w-full xl:w-80 flex flex-col gap-4">
          {/* Academic Performance Card 1 */}
          <div
            className="rounded-2xl p-4 sm:p-6 shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 13.66%, rgba(133, 165, 152, 0.965) 99.29%)",
            }}
          >
            <h3 className="text-white text-[1.125rem] leading-[100%] mb-4 font-extrabold">Academic Performance</h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Current Grade:</span>
                <span className="font-bold">{academicPerformance.currentGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Class Rank:</span>
                <span className="font-bold">{academicPerformance.classRank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Total Subjects:</span>
                <span className="font-bold">{academicPerformance.totalSubjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">GPA:</span>
                <span className="font-bold">{academicPerformance.gpa}/4.0</span>
              </div>
            </div>
          </div>

          {/* Class Schedule Card */}
          <div
            className="rounded-2xl p-4 sm:p-6 text-white shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 29.92%, rgba(133, 165, 152, 0.965) 99.29%, #FFFFFF 99.3%)",
            }}
          >
            <h3 className="font-outfit font-extrabold text-[18px] leading-[100%] mb-1">Today's Schedule</h3>
            <p className="text-xs opacity-80 mb-4">Your daily class schedule</p>

            <div className="space-y-3 text-sm">
              {classSchedule.length > 0 ? (
                classSchedule.map((session, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="opacity-80" />
                      <span className="opacity-90">{session.time}</span>
                      <span className="ml-auto font-semibold">{session.subject}</span>
                    </div>
                    <div className="text-xs opacity-70 pl-6">
                      {session.teacher} | {session.room}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm opacity-80 py-4">
                  No classes scheduled for today
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">TOP PERFORMING STUDENTS</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#0B4B31] bg-[#c9d7d2] hover:bg-[#E3F1EB]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Students with highest academic performance</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Names ↕</th>
                  <th className="text-left px-3 py-2">Joined On ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">GPA ↕</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.length > 0 ? (
                  topStudents.map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">👤</span>
                        </div>
                        {student.name}
                      </td>
                      <td className="py-3 px-3">{student.date}</td>
                      <td className="py-3 px-3 text-right font-medium text-[#0B4B31]">{student.gpa}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-100">
                    <td
                      colSpan={3}
                      className="py-3 px-3 text-center py-4 text-gray-500"
                    >
                      No Data
                    </td>

                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments Due Soon */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">ASSIGNMENTS DUE SOON</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#0B4B31] bg-[#c9d7d2] hover:bg-[#E3F1EB]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Your upcoming assignment deadlines</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Subjects ↕</th>
                  <th className="text-left px-3 py-2">Assignment ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">Due Date ↕</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsDueSoon.length > 0 ? (
                  assignmentsDueSoon.map((assignment, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-3">{assignment.subject}</td>
                      <td className="py-3 px-3">{assignment.assignment}</td>
                      <td className={`py-3 px-3 text-right font-medium ${assignment.isUrgent ? "text-red-500" : "text-[#0B4B31]"}`}>
                        {assignment.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-100">
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Page;