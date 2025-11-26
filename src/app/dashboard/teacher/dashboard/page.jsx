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
  PenLine,
  Clock4,
  ArrowUpRight,
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
    if (user?.id) {
      dispatch(getTeacherDashboard(user.id));
    }
  }, [dispatch, user?.id]);

  const defaultStats = [
    {
      label: "Active Courses",
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

  const displayStats = stats?.data?.length ? stats.data : defaultStats;
  const displayLessons = upcomingLessons?.data || [];
  const displayAssessments = assessments?.data || [];
  const displayStudentFocus = studentFocus?.data || [];

  const metricCards = [
    {
      title: "Total Students",
      value: displayStats[1]?.value ?? 0,
      icon: Users,
      helper: "Enrolled across classes",
    },
    {
      title: "Active Courses",
      value: displayStats[0]?.value ?? 0,
      icon: BookOpen,
      helper: "Running this term",
    },
    {
      title: "Assignments",
      value: String(displayAssessments.length).padStart(2, "0"),
      icon: ClipboardList,
      helper: "Created so far",
    },
    {
      title: "Grades",
      value: "04",
      icon: PenLine,
      helper: "To review",
    },
  ];

  const weeklyAssignmentData = [
    { month: "Jan", completed: 80, incomplete: 20 },
    { month: "Feb", completed: 68, incomplete: 32 },
    { month: "Mar", completed: 74, incomplete: 26 },
    { month: "Apr", completed: 40, incomplete: 60 },
    { month: "May", completed: 82, incomplete: 18 },
    { month: "Jun", completed: 55, incomplete: 45 },
    { month: "Jul", completed: 70, incomplete: 30 },
    { month: "Aug", completed: 65, incomplete: 35 },
    { month: "Sep", completed: 78, incomplete: 22 },
    { month: "Oct", completed: 32, incomplete: 68 },
    { month: "Nov", completed: 86, incomplete: 14 },
    { month: "Dec", completed: 60, incomplete: 40 },
  ];

  const topStudents = [
    { name: "Milad Hersi", joinedOn: "06 Jun, 2025", grade: "A" },
    { name: "Milad Hersi", joinedOn: "04 Jun, 2025", grade: "A" },
    { name: "Milad Hersi", joinedOn: "03 Jun, 2025", grade: "A" },
    { name: "Milad Hersi", joinedOn: "02 Jun, 2025", grade: "A" },
  ];

  const attentionStudents =
    displayStudentFocus.length > 0
      ? displayStudentFocus.map((student) => ({
        name: student.name,
        joinedOn: student.joinedOn || "—",
        grade: student.status || "Needs Support",
      }))
      : [
        { name: "Ayan Nur", joinedOn: "06 Jun, 2025", grade: "D" },
        { name: "Muhommad Hasan", joinedOn: "04 Jun, 2025", grade: "E" },
        { name: "Ayesha Nur", joinedOn: "03 Jun, 2025", grade: "D" },
        { name: "Fariha Hasan", joinedOn: "02 Jun, 2025", grade: "F" },
      ];

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
      <header className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 py-2 sm:py-4">
        <div className="text-center sm:text-left">
          <p className="text-3xl sm:text-[2.5rem] font-semibold text-[#0B4B31] leading-tight">
            Welcome to
          </p>
          <h1 className="text-xl sm:text-[1.75rem] font-medium text-[#000000]">
            MaktabOS — Teacher Dashboard
          </h1>
        </div>
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
                Ahmed J.
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white border border-[#E2E7E4] px-5 py-6 shadow-sm flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F0F7F2] flex items-center justify-center text-[#0B4B31]">
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-[#5E6C64]">{card.helper}</p>
              <p className="text-3xl font-semibold text-[#0B4B31]">{card.value}</p>
              <p className="text-base font-medium text-[#1E1E1E]">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[28px] bg-white border border-[#E2E7E4] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-lg font-semibold text-[#0B4B31]">
                Weekly Assignment Overview
              </p>
              <p className="text-sm text-[#5E6C64]">
                Completion trend for the active term
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#5E6C64]">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-[#10B981]" />
                Completed 82.1%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-[#F87171]" />
                Incomplete 13.9%
              </span>
            </div>
          </div>
          <div className="flex items-end gap-4 overflow-x-auto pb-2">
            {weeklyAssignmentData.map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-2">
                <div className="w-6 sm:w-8 h-44 bg-[#EEF2EF] rounded-full flex flex-col justify-end overflow-hidden">
                  <div
                    className="bg-[#F87171]"
                    style={{ height: `${item.incomplete}%` }}
                  />
                  <div
                    className="bg-[#10B981]"
                    style={{ height: `${item.completed}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[#5E6C64]">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] bg-gradient-to-br from-[#0B4B31] to-[#0F6A44] text-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-wide opacity-80">Class Average</p>
            <p className="text-4xl font-semibold mt-4">90.7%</p>
            <p className="mt-2 text-white/90">Overall academic performance</p>
            <button className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
              See details
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="rounded-[28px] bg-gradient-to-br from-[#0B4B31]/90 to-[#0B4B31]/60 text-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-wide opacity-80">
              Current Term Performance
            </p>
            <p className="text-3xl font-semibold mt-4">82.5%</p>
            <p className="text-sm mt-1 opacity-80">Compared to last month</p>
            <button className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
              Details
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-[28px] bg-white border border-[#E2E7E4] p-6 shadow-sm">
          <header className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-[#0B4B31]">
                Top Performing Students
              </p>
              <p className="text-sm text-[#5E6C64]">Students with highest grade</p>
            </div>
            <button className="text-sm font-semibold text-[#0B4B31]">
              See All ↗
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#5E6C64]">
                  <th className="pb-3 font-medium">Names</th>
                  <th className="pb-3 font-medium">Joined On</th>
                  <th className="pb-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EF]">
                {topStudents.map((student, idx) => (
                  <tr key={student.name + idx} className="text-[#1E1E1E]">
                    <td className="py-3 font-semibold">{student.name}</td>
                    <td className="py-3">{student.joinedOn}</td>
                    <td className="py-3 font-semibold text-[#0B4B31]">
                      {student.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] bg-white border border-[#E2E7E4] p-6 shadow-sm">
          <header className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-[#0B4B31]">
                Students Needing Attention
              </p>
              <p className="text-sm text-[#5E6C64]">Students with lowest grades</p>
            </div>
            <button className="text-sm font-semibold text-[#0B4B31]">
              See All ↗
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#5E6C64]">
                  <th className="pb-3 font-medium">Names</th>
                  <th className="pb-3 font-medium">Joined On</th>
                  <th className="pb-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EF]">
                {attentionStudents.map((student, idx) => (
                  <tr key={student.name + idx} className="text-[#1E1E1E]">
                    <td className="py-3 font-semibold">{student.name}</td>
                    <td className="py-3">{student.joinedOn}</td>
                    <td className={`py-3 font-semibold ${/^[A-F]/.test(student.grade)
                        ? "text-[#DC2626]"
                        : "text-[#B91C1C]"}`}>
                      {student.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

    </div>
  );
}