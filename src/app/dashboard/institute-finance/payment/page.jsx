"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  getAllInstitutePaymentStatsAction,
  setCurrentPage,
} from "@/redux/slices/paymentSlices/paymentSlices";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function PaymentPage() {
  const dispatch = useDispatch();
  const {
    loading,
    stats,
    tableData,
    paymentMethodsData,
    monthlyTrendsData,
    pagination,
    error,
  } = useSelector((state) => state.getAllPaymentStats);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );

  useEffect(() => {
    const filters = {
      page: pagination?.currentPage || 1,
      limit: pagination?.limit || 10,
      search: searchValue,
      startDate: selectedDate,
      status: selectedStatus,
      year: selectedYear,
    };

    dispatch(getAllInstitutePaymentStatsAction(filters));
  }, [
    dispatch,
    pagination?.currentPage,
    pagination?.limit,
    searchValue,
    selectedDate,
    selectedStatus,
    selectedYear,
  ]);

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    dispatch(setCurrentPage(1)); // Reset to first page when searching
  };

  // Handle year change for monthly trends
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Handle date filter change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Chart options
  const paymentMethodsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  const monthlyTrendsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max:
          Math.max(...(monthlyTrendsData?.datasets?.[0]?.data || [])) + 5 || 30,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + "K";
          },
        },
      },
    },
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const buttons = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!pagination.hasPrev}
        className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50"
      >
        ‹
      </button>,
    );

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 4 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              currentPage === i
                ? "bg-[#0B4B31] font-semibold text-white"
                : "border border-[#C5D2CD] bg-white text-[#0B4B31] hover:bg-[#F3F6F5]"
            }`}
          >
            {i}
          </button>,
        );
      } else if (i === 5 && totalPages > 5) {
        buttons.push(
          <span key="ellipsis" className="px-2 text-[#0B4B31]">
            ...
          </span>,
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!pagination.hasNext}
        className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50"
      >
        ›
      </button>,
    );

    return buttons;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            placeholder="Select the date"
          />
        </div>
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
          >
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">
            ▾
          </span>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] transition whitespace-nowrap"
        >
          Manage
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-[#0B4B31]">Loading payment statistics...</p>
        </div>
      )}

      {error && (
        <div className="rounded-[18px] bg-red-50 px-8 py-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {!loading && !error && stats && (
        <div className="relative rounded-[18px] bg-[#E5EFEB] px-8 py-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url(/invoices.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-[1.5rem] font-semibold text-[#000000]">
                {stats.totalPayments?.toLocaleString() || 0}
              </p>
              <p className="text-[0.8125rem] font-normal text-[#979699] mt-1">
                Total Payments
              </p>
            </div>
            <div>
              <p className="text-[1.5rem] font-semibold text-[#000000]">
                ${stats.totalAmount || "0.00"}
              </p>
              <p className="text-[0.8125rem] font-normal text-[#979699] mt-1">
                Total Amount
              </p>
            </div>
            <div>
              <p className="text-[1.5rem] font-semibold text-[#000000]">
                ${stats.averagePayment?.toLocaleString() || "0.00"}
              </p>
              <p className="text-[0.8125rem] font-normal text-[#979699] mt-1">
                Average Payment
              </p>
            </div>
            <div>
              <p className="text-[1.5rem] font-semibold text-[#000000]">
                {stats.lastPaymentDate || "No payments"}
              </p>
              <p className="text-[0.8125rem] font-normal text-[#979699] mt-1">
                Last Payment Date
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <h3 className="text-[0.8125rem] font-medium text-[#0000008C] mb-4">
              Payment Methods Distribution
            </h3>
            <div className="relative h-64 flex items-center justify-center">
              <Doughnut
                data={paymentMethodsData}
                options={paymentMethodsOptions}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col gap-3 items-center">
                  {paymentMethodsData.labels.map((label, i) => {
                    const value = paymentMethodsData.datasets[0].data[i];
                    const color =
                      paymentMethodsData.datasets[0].backgroundColor[i];
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs" style={{ fontSize: "12px" }}>
                          <span style={{ color: "#737373" }}>{label}: </span>
                          <span style={{ color: "#0A0A0A" }}>{value}%</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">
                Monthly Payment Trends
              </h3>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="h-64">
              <Bar data={monthlyTrendsData} options={monthlyTrendsOptions} />
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[0.8125rem] font-medium text-[#0000008C]">
              All Payment Records
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative flex w-full max-w-xl items-center">
                <span className="absolute left-4 text-[#979699]">🔍</span>
                <input
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder="Search by receipt number"
                  className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
              <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
                <tr>
                  <th className="px-4 font-normal text-[#0000008C]">
                    Receipt #
                  </th>
                  <th className="px-4 font-normal text-[#0000008C]">
                    Payment Date
                  </th>
                  <th className="px-4 font-normal text-[#0000008C]">
                    Payment Amount
                  </th>
                  <th className="px-4 font-normal text-[#0000008C]">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((record) => (
                  <tr
                    key={record.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {record.receiptNumber}
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {record.paymentDate}
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {record.paymentAmount}
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {record.paymentType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalRecords > 0 && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[0.8125rem] font-normal text-[#979699]">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalRecords,
                )}{" "}
                of {pagination.totalRecords} entries
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.8125rem] font-normal text-[#979699]">
                  Display {pagination.limit}
                </span>
                <div className="flex items-center gap-2">
                  {renderPaginationButtons()}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}