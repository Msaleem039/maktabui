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

export default function PaymentPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Payment Methods Distribution Chart
  const paymentMethodsData = {
    labels: ["CARD", "CASH", "STRIPE", "ZELLE"],
    datasets: [
      {
        data: [39, 38, 27, 22],
        backgroundColor: ["#14B8A6", "#0B4B31", "#3B82F6", "#000000"],
        borderWidth: 0,
      },
    ],
  };

  const paymentMethodsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${value}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },
    cutout: "70%",
  };

  // Monthly Payment Trends Chart
  const monthlyTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Payments",
        data: [18, 30, 22, 31, 13, 25, 18, 29, 22, 32, 14, 25],
        backgroundColor: [
          "#0B4B31",
          "#14B8A6",
          "#000000",
          "#3B82F6",
          "#3B82F6",
          "#14B8A6",
          "#0B4B31",
          "#14B8A6",
          "#000000",
          "#3B82F6",
          "#3B82F6",
          "#14B8A6",
        ],
        borderWidth: 0,
      },
    ],
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
        max: 30,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + "K";
          },
        },
      },
    },
  };

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `record-${index + 1}`,
    receiptNumber: "57595",
    paymentDate: "01 Jan 2025",
    paymentAmount: "$700",
    paymentMethod: "Card",
  }));

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
            <p className="text-3xl font-bold text-[#0B4B31]">125</p>
            <p className="text-sm text-[#627169] mt-1">Total Payments</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">$48,620.00</p>
            <p className="text-sm text-[#627169] mt-1">Total Amount</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">$333,090.00</p>
            <p className="text-sm text-[#627169] mt-1">Average Payment</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0B4B31]">21-10-2025</p>
            <p className="text-sm text-[#627169] mt-1">Last Payment Date</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0B4B31] mb-4">Payment Methods Distribution</h3>
          <div className="h-64">
            <Doughnut data={paymentMethodsData} options={paymentMethodsOptions} />
          </div>
        </div>

        {/* Monthly Payment Trends */}
        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0B4B31]">Monthly Payment Trends</h3>
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="h-64">
            <Bar data={monthlyTrendsData} options={monthlyTrendsOptions} />
          </div>
        </div>
      </div>

      {/* All Payment Records Section */}
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">All Payment Records</h2>
        </div>

        <div className="mt-6 space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex w-full max-w-xl items-center">
              <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by date"
                className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} className="text-white" />
              Export Data
            </button>
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 bg-[#E5EFEB] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
            >
              See All ↗
            </button>
          </div>
        </div>

        {/* Payment Records Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4">Receipt #</th>
                <th className="px-4">Payment Date</th>
                <th className="px-4">Payment Amount</th>
                <th className="px-4">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((record) => (
                <tr
                  key={record.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">{record.receiptNumber}</td>
                  <td className="px-4 py-3 text-[#555]">{record.paymentDate}</td>
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">{record.paymentAmount}</td>
                  <td className="px-4 py-3 text-[#555]">{record.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8A928F]">Display 10</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                1
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
                2
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                3
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                4
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
