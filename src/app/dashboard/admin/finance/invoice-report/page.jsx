"use client";

import { useState } from "react";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function InvoiceReportPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Donut Chart Data
  const donutChartData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [10000, 4000],
        backgroundColor: ["#0B4B31", "#E5EFEB"],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    cutout: "70%",
  };

  // Semi-circle Chart Data
  const semiCircleData = {
    labels: ["Cash Stripe", "Cash Stripe"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#0B4B31", "#E5EFEB"],
        borderWidth: 0,
      },
    ],
  };

  const semiCircleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    cutout: "70%",
    rotation: -90,
    circumference: 180,
  };

  // Bar Chart Data
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Paid",
        data: [0, 0, 0, 0, 0, 10000, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#E5EFEB",
      },
      {
        label: "Unpaid",
        data: [0, 0, 0, 0, 0, 4000, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#EF4444",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30000,
        ticks: {
          stepSize: 10000,
          callback: function (value) {
            return value / 1000 + "K";
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
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
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            placeholder="Select the date"
          />
        </div>
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
          >
            <option value="">Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
        </div>
        <button
          type="button"
          className="rounded-full border-2 border-white bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 whitespace-nowrap"
        >
          Manage
        </button>
      </div>

      {/* Key Metrics Banner */}
      <div className="rounded-[18px] bg-[#E5EFEB] px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">125</p>
            <p className="text-sm text-[#627169] mt-1">Total Invoices</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">$48,620.00</p>
            <p className="text-sm text-[#627169] mt-1">Total Amount</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">$333,090.00</p>
            <p className="text-sm text-[#627169] mt-1">Paid Amount</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">$47,380.00</p>
            <p className="text-sm text-[#627169] mt-1">Unpaid Amount</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0B4B31]">Payment Status Distribution</h3>
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64">
            <Doughnut data={donutChartData} options={donutOptions} />
          </div>
        </div>

        {/* Semi-circle Chart */}
        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0B4B31]">Payment Status Distribution</h3>
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64">
            <Doughnut data={semiCircleData} options={semiCircleOptions} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0B4B31]">Payment Status Distribution</h3>
          <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>
        <div className="h-64">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

