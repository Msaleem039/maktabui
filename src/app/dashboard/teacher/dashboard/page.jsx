"use client";

import React from "react";
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

const teacherStats = [
  {
    label: "Active Classes",
    value: 6,
    sublabel: "This semester",
    icon: BookOpen,
  },
  {
    label: "Total Students",
    value: 142,
    sublabel: "Across classes",
    icon: Users,
  },
  {
    label: "Assignments Due",
    value: 4,
    sublabel: "This week",
    icon: ClipboardList,
  },
];

const upcomingLessons = [
  {
    time: "08:30 AM",
    title: "Arabic Literature",
    className: "Grade 8 • Room 204",
    focus: "Poetry analysis & discussion",
  },
  {
    time: "11:15 AM",
    title: "Qur'an Studies",
    className: "Grade 9 • Room 310",
    focus: "Surah Al-Mulk review",
  },
  {
    time: "02:00 PM",
    title: "Islamic History",
    className: "Grade 7 • Room 112",
    focus: "Ottoman Empire timeline",
  },
];

const assessments = [
  {
    title: "Weekly Tajweed Quiz",
    className: "Grade 9",
    due: "Tomorrow",
    submissions: "12/28",
    status: "In Progress",
  },
  {
    title: "History Essay Draft",
    className: "Grade 7",
    due: "Oct 14",
    submissions: "6/24",
    status: "Not Started",
  },
  {
    title: "Arabic Vocabulary Test",
    className: "Grade 8",
    due: "Oct 18",
    submissions: "0/26",
    status: "Scheduled",
  },
];

const studentFocus = [
  {
    name: "Fatima Ali",
    className: "Grade 7 • Islamic History",
    status: "Absent twice this week",
  },
  {
    name: "Yusuf Ibrahim",
    className: "Grade 8 • Arabic",
    status: "Assignment missing",
  },
  {
    name: "Layla Hassan",
    className: "Grade 9 • Qur'an Studies",
    status: "Parent meeting Monday",
  },
];

export default function TeacherDashboardPage() {
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
        {teacherStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E2E7E4] bg-white px-5 py-6 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0B4B31]/10 flex items-center justify-center">
              <stat.icon size={20} className="text-[#0B4B31]" />
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
              Today’s Schedule
            </h2>
            <button className="text-sm text-[#0B4B31] font-semibold">See Weekly ↗</button>
          </div>

          <div className="space-y-4">
            {upcomingLessons.map((lesson, idx) => (
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
            ))}
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
            {studentFocus.map((student, idx) => (
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
            ))}
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
              {assessments.map((item, idx) => (
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
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "Not Started"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

