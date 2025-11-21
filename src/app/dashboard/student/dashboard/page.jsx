"use client";
import React from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown, FileText, FolderCheck, UserCheck, GraduationCap, Clock } from "lucide-react";

const Page = () => {
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
            <div className="flex items-center gap-2 bg-white border border-[#0B4B31 rounded-full px-2 py-1.5 pr-3 cursor-pointer hover:bg-emerald-50 shadow-sm">
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
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">Ahmed J.</span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome */}
      <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</h1>
      <p className="text-[1.75rem] font-medium text-[#000000] mb-8">MaktabOS</p>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Classes</p>
              <p className="text-3xl font-bold text-[#0B4B31]">05</p>
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
              <p className="text-3xl font-bold text-[#0B4B31]">03</p>
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
              <p className="text-3xl font-bold text-[#0B4B31]">90%</p>
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
              <p className="text-3xl font-bold text-[#0B4B31]">04</p>
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
          {/* Monthly Attendance Chart */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
              <h3 className="font-semibold text-[#0B4B31] text-[14px] leading-[20px]">
                Monthly Attendance
              </h3>

              <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-emerald-500">
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>

            <div className="flex items-end justify-between h-48 min-w-[600px] sm:min-w-full overflow-x-auto">
              {[
                { m: "Jan", present: 85, absent: 15 },
                { m: "Feb", present: 90, absent: 10 },
                { m: "Mar", present: 88, absent: 12 },
                { m: "Apr", present: 92, absent: 8 },
                { m: "May", present: 87, absent: 13 },
                { m: "Jun", present: 90, absent: 10 },
                { m: "Jul", present: 85, absent: 15 },
                { m: "Aug", present: 88, absent: 12 },
                { m: "Sep", present: 90, absent: 10 },
                { m: "Oct", present: 92, absent: 8 },
                { m: "Nov", present: 88, absent: 12 },
                { m: "Dec", present: 90, absent: 10 },
              ].map((month, i) => (
                <div key={i} className="flex flex-col items-center mx-1">
                  <div className="w-4 relative" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 w-full bg-[#0B4B31] rounded-t"
                      style={{ height: `${month.present}%` }}
                    ></div>
                    <div
                      className="absolute top-0 w-full bg-red-500 rounded-b"
                      style={{ height: `${month.absent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{month.m}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 sm:gap-8 mt-6 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#0B4B31] rounded-full"></span> Present (52.1%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Absent (13.9%)
              </span>
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
                <span className="font-bold">A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Class Rank:</span>
                <span className="font-bold">5th</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">Total Subjects:</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-90">GPA:</span>
                <span className="font-bold">3.8/4.0</span>
              </div>
            </div>
          </div>

          {/* Academic Performance Card 2 - Schedule */}
          <div
            className="rounded-2xl p-4 sm:p-6 text-white shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 29.92%, rgba(133, 165, 152, 0.965) 99.29%, #FFFFFF 99.3%)",
            }}
          >
            <h3 className="font-outfit font-extrabold text-[18px] leading-[100%] mb-1">Academic Performance</h3>
            <p className="text-xs opacity-80 mb-4">Your daily class schedule</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={14} className="opacity-80" />
                <span className="opacity-90">08:00 AM</span>
                <span className="ml-auto font-semibold">Mathematics</span>
              </div>
              <div className="text-xs opacity-70 pl-6">Mr. Smith | Room 101</div>
              
              <div className="flex items-center gap-2">
                <Clock size={14} className="opacity-80" />
                <span className="opacity-90">09:30 AM</span>
                <span className="ml-auto font-semibold">Science</span>
              </div>
              <div className="text-xs opacity-70 pl-6">Ms. Johnson | Lab 2</div>
              
              <div className="flex items-center gap-2">
                <Clock size={14} className="opacity-80" />
                <span className="opacity-90">11:00 AM</span>
                <span className="ml-auto font-semibold">English</span>
              </div>
              <div className="text-xs opacity-70 pl-6">Mrs. Davis | Room 205</div>
              
              <div className="flex items-center gap-2">
                <Clock size={14} className="opacity-80" />
                <span className="opacity-90">01:00 PM</span>
                <span className="ml-auto font-semibold">History</span>
              </div>
              <div className="text-xs opacity-70 pl-6">Mr. Brown | Room 303</div>
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
                {[
                  { name: "Milad Hersi", date: "06 Jun, 2025", gpa: "3.98" },
                  { name: "Milad Hersi", date: "04 Jun, 2025", gpa: "3.97" },
                  { name: "Milad Hersi", date: "03 Jun, 2025", gpa: "3.81" },
                  { name: "Milad Hersi", date: "02 Jun, 2025", gpa: "3.80" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-600">👤</span>
                      </div>
                      {row.name}
                    </td>
                    <td className="py-3 px-3">{row.date}</td>
                    <td className="py-3 px-3 text-right font-medium text-[#0B4B31]">{row.gpa}</td>
                  </tr>
                ))}
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
                {[
                  { subject: "202 Mohamed Karie Class", assignment: "Chapter 5 Quiz", date: "10 Jan, 2025", isUrgent: false },
                  { subject: "202 Mohamed Karie Class", assignment: "Chapter 5 Quiz", date: "20 Jan, 2025", isUrgent: true },
                  { subject: "202 Mohamed Karie Class", assignment: "Chapter 5 Quiz", date: "20 Jan, 2025", isUrgent: true },
                  { subject: "202 Mohamed Karie Class", assignment: "Chapter 5 Quiz", date: "20 Jan, 2025", isUrgent: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-3">{row.subject}</td>
                    <td className="py-3 px-3">{row.assignment}</td>
                    <td className={`py-3 px-3 text-right font-medium ${row.isUrgent ? "text-red-500" : "text-[#0B4B31]"}`}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

