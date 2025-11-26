"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Search,
  Grid,
  Moon,
  ChevronDown,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  MessageSquareText,
  PenLine,
  Clock4,
} from "lucide-react";
import { getTeacherDashboard } from "@/redux/slices/teacherSlices/teacherSlices";
import { getCookie } from "cookies-next";

export default function TeacherDashboardPage() {
  const dispatch = useDispatch();
  const {
    stats,
    upcomingLessons,
    assessments,
    studentFocus,
    loading,
    error
  } = useSelector(state => state.teacherDashboard);


  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);
  useEffect(() => {
    dispatch(getTeacherDashboard(user.id));
  }, [dispatch, user.id]);

  const defaultStats = [
    {
      label: "Active Classes",
      value: 0,
      sublabel: "This semester",
      icon: BookOpen,
    },
    {
      label: "Total Students",
      value: 0,
      sublabel: "Across classes",
      icon: Users,
    },
    {
      label: "Assignments Due",
      value: 0,
      sublabel: "This week",
      icon: ClipboardList,
    },
  ];

  const displayStats = stats?.data || defaultStats;
  const displayLessons = upcomingLessons?.data || [];
  const displayAssessments = assessments?.data || [];
  const displayStudentFocus = studentFocus?.data || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#0B4B31]">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search students or classes..."
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
                  src="/teacher-profile.jpg"
                  alt="teacher"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">
                Ustadh Kareem
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</p>
          <h1 className="text-[1.75rem] font-medium text-[#000000]">
            MaktabOS — Teacher Dashboard
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayStats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E2E7E4] bg-white px-5 py-6 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0B4B31]/10 flex items-center justify-center">
              {index === 0 && <BookOpen size={20} className="text-[#0B4B31]" />}
              {index === 1 && <Users size={20} className="text-[#0B4B31]" />}
              {index === 2 && <ClipboardList size={20} className="text-[#0B4B31]" />}
            </div>
            <div>
              <p className="text-sm text-[#5E6C64]">{stat.sublabel}</p>
              <p className="text-2xl font-semibold text-[#0B4B31]">{stat.value}</p>
              <p className="text-sm font-medium text-[#123629]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="xl:col-span-2 rounded-[28px] border border-[#E2E7E4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0B4B31] flex items-center gap-2">
              <Calendar size={18} />
              Today's Schedule
            </h2>
            <button className="text-sm text-[#0B4B31] font-semibold">See Weekly ↗</button>
          </div>

          <div className="space-y-4">
            {displayLessons.length > 0 ? (
              displayLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#D2E2DB] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 w-full sm:w-48">
                    <div className="w-12 h-12 rounded-full bg-[#0B4B31]/10 flex items-center justify-center text-[#0B4B31] font-semibold">
                      {lesson.time.split(" ")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0B4B31]">{lesson.time}</p>
                      <p className="text-xs text-gray-500">Start</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0B4B31]">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.className}</p>
                    <p className="text-xs text-gray-600 mt-1">{lesson.focus}</p>
                  </div>
                  <button className="text-xs font-semibold text-[#0B4B31] rounded-full border border-[#0B4B31]/20 px-4 py-1">
                    View Lesson
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No lessons scheduled for today
              </div>
            )}
          </div>
        </div>

        {/* Student Focus */}
        <div className="rounded-[28px] border border-[#E2E7E4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0B4B31] flex items-center gap-2">
              <Users size={18} />
              Student Focus
            </h2>
            <button className="text-sm text-[#0B4B31] font-semibold">Manage ↗</button>
          </div>

          <div className="space-y-4">
            {displayStudentFocus.length > 0 ? (
              displayStudentFocus.map((student, idx) => (
                <div key={idx} className="rounded-2xl border border-[#D2E2DB] px-4 py-3">
                  <p className="text-sm font-semibold text-[#0B4B31]">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.className}</p>
                  <p className="text-xs text-[#C43B30] mt-2">{student.status}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs flex items-center gap-1 rounded-full border border-[#0B4B31]/30 px-3 py-1 text-[#0B4B31]">
                      <MessageSquareText size={12} />
                      Message
                    </button>
                    <button className="text-xs flex items-center gap-1 rounded-full border border-[#0B4B31]/30 px-3 py-1 text-[#0B4B31]">
                      <PenLine size={12} />
                      Notes
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students need focus at the moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assessments */}
      <section className="rounded-[28px] border border-[#E2E7E4] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0B4B31] flex items-center gap-2">
            <ClipboardList size={18} />
            Assessment Tracker
          </h2>
          <button className="text-sm text-[#0B4B31] font-semibold">Create Assessment ↗</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#0B4B31] text-white">
                <th className="px-4 py-2 text-left rounded-tl-2xl">Assessment</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Due</th>
                <th className="px-4 py-2 text-left">Submissions</th>
                <th className="px-4 py-2 text-left rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayAssessments.length > 0 ? (
                displayAssessments.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#E2E7E4]">
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{item.title}</td>
                    <td className="px-4 py-3 text-[#5E6C64]">{item.className}</td>
                    <td className="px-4 py-3 text-[#5E6C64] flex items-center gap-1">
                      <Clock4 size={14} />
                      {item.due}
                    </td>
                    <td className="px-4 py-3 text-[#5E6C64]">{item.submissions}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${item.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "Not Started"
                              ? "bg-gray-100 text-gray-600"
                              : item.status === "Scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No assessments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}