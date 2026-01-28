"use client";

import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStatsAction } from "@/redux/slices/superadminSlices/superadminSlices";
import StatsCards from "@/components/StatsCard";
import Cookies from "js-cookie";

/* =======================
   HELPERS
======================= */
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* =======================
   TABLE COMPONENT
======================= */
const DashboardTable = ({
  title,
  subtitle,
  btnColor,
  rows,
  amountType = "paid", // "paid" | "unpaid"
}) => {
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
            <th className="text-left px-3 py-2 rounded-tl-md">Name</th>
            <th className="text-left px-3 py-2">Date</th>
            <th className="text-right px-3 py-2 rounded-tr-md">Amount</th>
          </tr>
        </thead>

        <tbody>
          {rows?.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="text-center py-4 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}

          {rows?.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-3 px-3">{row.name}</td>
              <td className="py-3 px-3">{formatDate(row.date)}</td>
              <td
                className={`py-3 px-3 text-right font-medium ${
                  amountType === "unpaid"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                ${row.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* =======================
   PAGE
======================= */
const Page = () => {
  const dispatch = useDispatch();
  const { themeColor, mainText } = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const user = Cookies.get("user");

  const {
    loading,
    stats,
    yearlyPayments,
    topPayingAdmins,
    topOutstandingAdmins,
    error,
  } = useSelector((state) => state.dashboard);
  console.log("topOutstandingAdmins",topOutstandingAdmins)
  useEffect(() => {
    dispatch(getDashboardStatsAction(selectedYear));
  }, [dispatch, selectedYear]);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      {/* WELCOME */}
      <h1
        className="text-[2.5rem] font-semibold mb-1"
        style={{ color: themeColor }}
      >
        Welcome to
      </h1>
      <p className="text-[1.75rem] font-medium text-black mb-8">
        {mainText || "MaktabOS"}
      </p>

      {/* LOADING / ERROR */}
      {loading && (
        <p className="text-center text-gray-500 mb-4">
          Loading dashboard…
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 mb-4">
          Error loading dashboard: {error}
        </p>
      )}

      {/* MAIN CONTENT */}
      {!loading && stats && (
        <div className="flex flex-col xl:flex-row gap-6 pb-6">
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-6">
            <StatsCards stats={stats} />

            {/* YEARLY PAYMENTS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="font-semibold text-sm"
                  style={{ color: themeColor }}
                >
                  Yearly Payment Volume ({selectedYear}) — $
                  {stats.totalPaidAmount}
                </h3>

                <select
                  className="border border-gray-200 rounded-lg px-3 py-1 text-sm"
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(Number(e.target.value))
                  }
                >
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>

              <div className="flex items-end justify-between gap-2">
                {yearlyPayments.map((b, i) => {
                  const max =
                    Math.max(
                      ...yearlyPayments.map((m) => m.totalPaid)
                    ) || 1;

                  const height =
                    (b.totalPaid / max) * 200;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="w-full bg-emerald-600 rounded-t-md"
                        style={{ height }}
                        title={`$${b.totalPaid}`}
                      />
                      <span className="text-xs text-gray-400 mt-1">
                        {b.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full xl:w-80 flex flex-col gap-4">
            {/* TOTAL UNPAID */}
            <div className="rounded-2xl p-6 shadow-md bg-gradient-to-br from-[#0b4b31] to-[#85a598] text-white">
              <h3 className="font-extrabold mb-4">Total Unpaid</h3>

              <div className="bg-white rounded-xl p-4 text-black">
                <h2 className="text-2xl font-extrabold text-[#0b4b31]">
                  ${stats.totalUnpaidAmount}
                </h2>
                <p className="text-xs mt-2">
                  {stats.totalInvoices} Invoices Pending
                </p>
              </div>
            </div>

            {/* CURRENT INCOME */}
            <div className="rounded-2xl p-6 shadow-md bg-gradient-to-br from-[#0b4b31] to-[#85a598] text-white">
              <h3 className="font-extrabold mb-1">
                Current Month Income
              </h3>
              <p className="text-xl font-extrabold">
                ${stats.currentMonthIncome}
              </p>
              <p className="text-xs opacity-80">
                Last Month: ${stats.lastMonthIncome}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TABLES */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTable
            title="Top Paying Admins"
            subtitle="Admins who contributed the most"
            rows={topPayingAdmins || []}
            amountType="paid"
          />

          <DashboardTable
            title="Top Outstanding Balances"
            subtitle="Admins with highest unpaid invoices"
            rows={topOutstandingAdmins || []}
            amountType="unpaid"
          />
        </div>
      )}
    </div>
  );
};

export default Page;