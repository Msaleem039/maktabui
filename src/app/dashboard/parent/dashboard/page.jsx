"use client";
import React from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown, Users, GraduationCap, Calendar, CalendarCheck, TrendingUp, DollarSign, Clock } from "lucide-react";

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
        {/* My Children */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Children</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-[#0B4B31]">02</p>
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <TrendingUp size={12} />
                  <span>+11.01%</span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <Users size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Fees</p>
              <p className="text-3xl font-bold text-[#0B4B31]">$500</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <GraduationCap size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-[#0B4B31]">90%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <Calendar size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Events</p>
              <p className="text-3xl font-bold text-[#0B4B31]">04</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <CalendarCheck size={24} className="text-[#0B4B31]" />
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
          {/* Total Fees Paid */}
          <div
            className="rounded-2xl p-4 sm:p-6 shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 13.66%, rgba(133, 165, 152, 0.965) 99.29%)",
            }}
          >
            <h3 className="text-white text-[1.125rem] leading-[100%] mb-4 font-extrabold">Total Fees Paid</h3>

            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center justify-center bg-[#0b4b31] w-12 h-12 rounded-full flex-shrink-0">
                <DollarSign size={24} className="text-white" />
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-[#0B4B31] text-[1.5rem] leading-[100%] font-extrabold">$35,000</h2>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-white text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Pending Fees:</span>
                <span className="font-semibold">$8,000</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Next Due Date:</span>
                <span className="font-semibold">25 Jan, 2025</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="rounded-2xl p-4 sm:p-6 text-white shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 29.92%, rgba(133, 165, 152, 0.965) 99.29%, #FFFFFF 99.3%)",
            }}
          >
            <h3 className="font-outfit font-extrabold text-[18px] leading-[100%] mb-1">Upcoming Events</h3>
            <p className="text-xs opacity-80 mb-4">Events scheduled for your children</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock size={14} className="opacity-80 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Science Fair</p>
                  <p className="text-xs opacity-80">15 Jan, 2025 | 10:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="opacity-80 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Parent-Teacher Meeting</p>
                  <p className="text-xs opacity-80">18 Jan, 2025 | 14:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="opacity-80 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Sports Day</p>
                  <p className="text-xs opacity-80">22 Jan, 2025 | 09:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fee Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">RECENT FEE PAYMENTS</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#0B4B31] bg-[#c9d7d2] hover:bg-[#E3F1EB]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Your recent fee payment history</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Child Name ↕</th>
                  <th className="text-left px-3 py-2">Joined On ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Milad Hersi", date: "06 Jun, 2025", amount: "-$5,000", color: "text-red-500" },
                  { name: "Milad Hersi", date: "04 Jun, 2025", amount: "+$65", color: "text-green-600" },
                  { name: "Milad Hersi", date: "03 Jun, 2025", amount: "-$200", color: "text-red-500" },
                  { name: "Milad Hersi", date: "02 Jun, 2025", amount: "+$800", color: "text-green-600" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-3">{row.name}</td>
                    <td className="py-3 px-3">{row.date}</td>
                    <td className={`py-3 px-3 text-right font-medium ${row.color}`}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fee Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">PENDING FEE PAYMENTS</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#F14336] bg-[#fde1df] hover:bg-[#FADDDD]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Outstanding fees for your children</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Child Name ↕</th>
                  <th className="text-left px-3 py-2">Joined On ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Ayan Nur", date: "06 Jun, 2025", amount: "-$5,000", color: "text-red-500" },
                  { name: "Muhommad Hasan", date: "04 Jun, 2025", amount: "+$65", color: "text-green-600" },
                  { name: "Ayesha Nur", date: "03 Jun, 2025", amount: "-$200", color: "text-red-500" },
                  { name: "Fariha Hasan", date: "02 Jun, 2025", amount: "+$800", color: "text-green-600" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-3">{row.name}</td>
                    <td className="py-3 px-3">{row.date}</td>
                    <td className={`py-3 px-3 text-right font-medium ${row.color}`}>{row.amount}</td>
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

