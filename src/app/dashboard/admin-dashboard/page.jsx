"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Grid, Moon, ChevronDown } from "lucide-react";
import StatsCards from "@/components/StatsCard";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardStatsAction } from "@/redux/slices/adminSlices/adminSlices";
import Cookies from "js-cookie";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toISOString().split("T")[0];
};

const Page = () => {
  const dispatch = useDispatch();
  const { themeColor, secondaryColor, mainText } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const adminId = getAdminId();

  const {
    loading,
    stats,
    yearlyPayments,
    topPayingParents,
    topOutstandingParents,
    error,
  } = useSelector((state) => state.getAdminDashboard);

  useEffect(() => {
    if (!adminId) return;

    dispatch(
      getAdminDashboardStatsAction({
        adminId,
        year: selectedYear,
      }),
    );
  }, [dispatch, adminId, selectedYear]);

  return (
    <>
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 mt-1 lg:mt-1">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          {/* <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div> */}
        </div>
      </header>
      <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
        {/* Welcome */}
        <h1
          className="text-[2.5rem] font-semibold mb-1"
          style={{ color: themeColor }}
        >
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000] mb-8">
          {mainText || "MaktabOS"}
        </p>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-gray-500 mb-4">Loading dashboard…</p>
        )}
        {error && (
          <p className="text-center text-red-500 mb-4">
            Error loading dashboard: {error}
          </p>
        )}

        {!loading && stats && (
          <div className="flex flex-col xl:flex-row gap-6 pb-6">
            <div className="flex-1 flex flex-col gap-6">
              <StatsCards stats={stats} />

              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                  <h3
                    className="font-semibold text-[14px] leading-[20px]"
                    style={{ color: themeColor }}
                  >
                    Yearly Payment Volume ({selectedYear})
                    <span style={{ color: themeColor, opacity: 0.7 }}>
                      (${stats?.totalPaidAmount || 0})
                    </span>
                  </h3>

                  <select
                    className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>

                {/* Chart */}
                <div className="flex items-end justify-between gap-2 w-full overflow-x-auto">
                  {yearlyPayments?.map((b, i) => {
                    const maxPayment =
                      Math.max(...yearlyPayments.map((m) => m.totalPaid)) || 1;
                    const heightPercent =
                      maxPayment > 0 ? (b.totalPaid / maxPayment) * 100 : 0;
                    const heightPx = (heightPercent / 100) * 256;

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1 min-w-[24px]"
                      >
                        <div
                          className="w-full bg-emerald-600 transition-all duration-300 relative rounded-t-md"
                          style={{
                            height: `${heightPx}px`,
                            minHeight: b.totalPaid > 0 ? "4px" : "0px",
                          }}
                          title={`${b.month}: $${b.totalPaid}`}
                        >
                          {b.totalPaid > 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-semibold whitespace-nowrap">
                              ${b.totalPaid.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          {b.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 sm:gap-8 mt-6 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>{" "}
                    Paid Volume
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>{" "}
                    Unpaid
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT CARDS */}
            <div className="w-full xl:w-80 flex flex-col gap-4">
              {/* Total Unpaid */}
              <div
                className="rounded-2xl p-4 sm:p-6 shadow-md"
                style={{
                  background: `linear-gradient(53.14deg, ${hexToRgba(
                    themeColor,
                    0.93,
                  )} 13.66%, ${hexToRgba(
                    secondaryColor || themeColor,
                    0.965,
                  )} 99.29%)`,
                }}
              >
                <h3 className="text-white text-[1.125rem] mb-4 font-extrabold">
                  Total Unpaid
                </h3>

                <div className="bg-white rounded-xl p-4 sm:p-5 flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  >
                    <img
                      src="/Dollar Coin.png"
                      alt="Dollar Coin"
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  <div>
                    <h2
                      className="text-[1.5rem] font-extrabold"
                      style={{ color: themeColor }}
                    >
                      ${stats?.totalUnpaidAmount || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Current Income */}
              <div
                className="rounded-2xl p-4 sm:p-6 text-white shadow-md"
                style={{
                  background: `linear-gradient(53.14deg, ${hexToRgba(
                    themeColor,
                    0.93,
                  )} 29.92%, ${hexToRgba(
                    secondaryColor || themeColor,
                    0.965,
                  )} 99.29%)`,
                }}
              >
                <h3 className="font-extrabold text-[18px] mb-1">
                  Current Income This Month
                </h3>
                <p className="text-xs opacity-80 mb-4">
                  Payments this month vs last month
                </p>

                <p className="font-extrabold text-[24px]">
                  ${stats?.currentMonthIncome || 0}
                </p>
                <p className="text-xs opacity-80">
                  Last Month: ${stats?.lastMonthIncome || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tables Section */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardTable
              title="Top Paying Parents"
              subtitle="Parents who contributed the most"
              btnColor={`text-[var(--theme-color)] bg-[var(--theme-color)]/20`}
              rows={topPayingParents}
            />
            <DashboardTable
              title="Top Outstanding Balances"
              subtitle="Parents with highest unpaid invoices"
              btnColor="text-[#F14336] bg-[#fde1df]"
              rows={topOutstandingParents}
            />
          </div>
        )}
      </div>
    </>
  );
};

// Table Component
const DashboardTable = ({ title, subtitle, btnColor, rows }) => {
  const { themeColor } = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-3">
        <h3
          className="text-[18px] font-semibold uppercase tracking-wide"
          style={{ color: themeColor }}
        >
          {title}
        </h3>
      </div>
      <p className="text-[#000000] text-sm mb-4">{subtitle}</p>

      <table className="w-full text-sm min-w-[400px]">
        <thead>
          <tr style={{ backgroundColor: themeColor }} className="text-white">
            <th className="text-left px-3 py-2 rounded-tl-md">Name ↕</th>
            <th className="text-left px-3 py-2">Date ↕</th>
            <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-3 px-3">{row.name}</td>
              <td className="py-3 px-3">{formatDate(row.date)}</td>
              <td
                className={`py-3 px-3 text-right font-medium ${"text-red-500"}`}
              >
                ${row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;