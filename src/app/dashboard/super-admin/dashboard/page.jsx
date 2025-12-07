"use client";
import React from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown } from "lucide-react";
import StatsCards from "@/components/StatsCard";

const Page = () => {
  return (
    <>
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 mt-1">
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
      <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">


        {/* Welcome */}
        <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</h1>
        <p className="text-[1.75rem] font-medium text-[#000000] mb-8">MaktabOS</p>

        {/* Stats & Charts */}
        <div className="flex flex-col xl:flex-row gap-6 pb-6">
          <div className="flex-1 flex flex-col gap-6">
            <StatsCards />

            {/* Yearly Payment Overview */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                <h3 className="font-semibold text-[#0B4B31] text-[14px] leading-[20px]">
                  Yearly Payment Overview{" "}
                  <span className="text-[#0B4B31] opacity-70">($336,040)</span>
                </h3>

                <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-emerald-500">
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>

              <div className="flex items-end justify-between h-48 min-w-[600px] sm:min-w-full overflow-x-auto">
                {[
                  { m: "Jan", v: 45, c: "bg-emerald-800" },
                  { m: "Feb", v: 70, c: "bg-emerald-300" },
                  { m: "Mar", v: 50, c: "bg-black" },
                  { m: "Apr", v: 70, c: "bg-blue-400" },
                  { m: "May", v: 30, c: "bg-blue-200" },
                  { m: "Jun", v: 55, c: "bg-emerald-400" },
                  { m: "Jul", v: 40, c: "bg-emerald-800" },
                  { m: "Aug", v: 60, c: "bg-emerald-300" },
                  { m: "Sep", v: 45, c: "bg-black" },
                  { m: "Oct", v: 70, c: "bg-blue-400" },
                  { m: "Nov", v: 30, c: "bg-blue-200" },
                  { m: "Dec", v: 50, c: "bg-emerald-400" },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center mx-1">
                    <div
                      className={`w-4 rounded-full ${b.c}`}
                      style={{ height: `${b.v}%` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-1">{b.m}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 sm:gap-8 mt-6 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-black rounded-full"></span> Paid (52.1%)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-300 rounded-full"></span> Unpaid (13.9%)
                </span>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="w-full xl:w-80 flex flex-col gap-4">
            {/* Total Unpaid */}
            <div
              className="rounded-2xl p-4 sm:p-6 shadow-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 13.66%, rgba(133, 165, 152, 0.965) 99.29%)",
              }}
            >
              <h3 className="text-white text-[1.125rem] leading-[100%] mb-4 font-extrabold">Total Unpaid</h3>

              <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center bg-[#0b4b31] w-12 h-12 rounded-full flex-shrink-0">
                  <img src="/Dollar Coin.png" alt="Dollar Coin" className="w-12 h-12 object-contain" />
                </div>

                <div className="flex flex-col items-center sm:items-start">
                  <h2 className="text-[#0B4B31] text-[1.5rem] leading-[100%] font-extrabold">$33,543.00</h2>
                  <p className="text-[#525967] text-[0.75rem] leading-[100%] mt-2 text-center sm:text-left">90 Voices Left Out of 100</p>
                </div>
              </div>
            </div>

            {/* Current Income */}
            <div
              className="rounded-2xl p-4 sm:p-6 text-white shadow-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 29.92%, rgba(133, 165, 152, 0.965) 99.29%, #FFFFFF 99.3%)",
              }}
            >
              <h3 className="font-outfit font-extrabold text-[18px] leading-[100%] mb-1">Current Income This Month</h3>
              <p className="text-xs opacity-80 mb-4">Payments made this month compared to last month</p>

              <div className="flex flex-col">
                <p className="font-outfit font-extrabold text-[12px] leading-[100%] uppercase">Revenue</p>
                <p className="font-outfit font-extrabold text-[24px] leading-[100%] my-2">$30.00</p>
                <p className="text-xs opacity-80">Compared to Last month</p>
              </div>

              <div className="flex justify-end mt-6">
                <button className="text-sm font-normal hover:underline flex items-center gap-1">
                  Details <ChevronDown size={14} className="rotate-270" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[{
            title: "Top Paying Parents",
            subtitle: "Parents who have contributed the most",
            btnText: "See All ↗",
            btnColor: "text-[#0B4B31] bg-[#c9d7d2] hover:bg-[#E3F1EB]",
            rows: [
              { name: "Milad Hersi", date: "06 Jun, 2025", amount: "-$5,000", color: "text-red-500" },
              { name: "Milad Hersi", date: "04 Jun, 2025", amount: "+$65", color: "text-green-600" },
              { name: "Milad Hersi", date: "03 Jun, 2025", amount: "-$200", color: "text-red-500" },
              { name: "Milad Hersi", date: "02 Jun, 2025", amount: "+$800", color: "text-green-600" },
            ]
          }, {
            title: "Top Outstanding Balances",
            subtitle: "Parents with highest unpaid invoices",
            btnText: "See All ↗",
            btnColor: "text-[#F14336] bg-[#fde1df] hover:bg-[#FADDDD]",
            rows: [
              { name: "Ayan Nur", date: "06 Jun, 2025", amount: "-$5,000", color: "text-red-500" },
              { name: "Muhammad Hasan", date: "04 Jun, 2025", amount: "+$65", color: "text-green-600" },
              { name: "Ayesha Nur", date: "03 Jun, 2025", amount: "-$200", color: "text-red-500" },
              { name: "Fariha Hasan", date: "02 Jun, 2025", amount: "+$800", color: "text-green-600" },
            ]
          }].map((table, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">{table.title}</h3>
                <button className={`text-[12px] px-3 py-[2px] rounded-full transition ${table.btnColor}`}>{table.btnText}</button>
              </div>
              <p className="text-[#000000] text-sm mb-4">{table.subtitle}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px] sm:min-w-full">
                  <thead>
                    <tr className="bg-[#0B4B31] text-white">
                      <th className="text-left px-3 py-2 rounded-tl-md">Names ↕</th>
                      <th className="text-left px-3 py-2">Joined On ↕</th>
                      <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-3 flex items-center gap-2">
                          {row.name}
                        </td>
                        <td className="py-3 px-3">{row.date}</td>
                        <td className={`py-3 px-3 text-right font-medium ${row.color}`}>{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
