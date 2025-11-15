"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function InvoicePage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `invoice-${index + 1}`,
    parentName: "Abdifatah Soyan",
    phoneNumber: "612-636-6438",
    dueAmount: index === 3 ? "$700.00" : "$0.00",
    paymentStatus: index === 3 ? "UNPAID" : "PAID",
    fundsAction: index === 3 ? "Payment" : "Add Funds",
  }));

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    if (action === "addFunds" || action === "payment") {
      router.push(`/dashboard/admin/finance/invoice/${id}/payment`);
    } else {
      console.log(`${action} clicked for invoice ${id}`);
    }
    setOpenDropdownId(null);
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

      {/* Invoice Table Section */}
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Invoices</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} className="text-white" />
              Export Data
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Filter and Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-semibold text-[#0B4B31] whitespace-nowrap">
              Filter By:
            </label>
            <div className="relative flex-1">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
            </div>
            <button
              type="button"
              className="rounded-full border-2 border-white bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <label className="relative flex w-full items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>

          <div>
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            >
              See All ↗
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4">Parent Name</th>
                <th className="px-4">Phone Number</th>
                <th className="px-4">Due Amont</th>
                <th className="px-4">Status</th>
                <th className="px-4">Status</th>
                <th className="px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((invoice) => {
                const isUnpaid = invoice.paymentStatus === "UNPAID";
                const isDropdownOpen = openDropdownId === invoice.id;
                return (
                  <tr
                    key={invoice.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="font-medium text-[#0B4B31]">{invoice.parentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#555]">{invoice.phoneNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#0B4B31]">{invoice.dueAmount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white ${
                          isUnpaid ? "bg-red-500" : "bg-[#0B4B31]"
                        }`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleActionClick(invoice.fundsAction === "Add Funds" ? "addFunds" : "payment", invoice.id, e);
                        }}
                        className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white transition ${
                          isUnpaid ? "bg-red-500 hover:bg-red-600" : "bg-[#0B4B31] hover:bg-[#0B4B31]/90"
                        }`}
                      >
                        {invoice.fundsAction}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(invoice.id, e)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                        >
                          Action
                          <span>▾</span>
                        </button>

                        {isDropdownOpen && (
                          <div
                            ref={(el) => (dropdownRefs.current[invoice.id] = el)}
                            className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("view", invoice.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("edit", invoice.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] border-t border-[#E2E7E4] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>Display 10</option>
              <option>Display 20</option>
              <option>Display 50</option>
            </select>
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
