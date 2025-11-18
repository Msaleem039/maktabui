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

export default function InvoiceReportPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `invoice-${index + 1}`,
    parentName: "Abdifatah Soyan",
    phoneNumber: "612-636-6438",
    dueAmount: "$700.00",
    paymentStatus: "UNPAID",
    fundsAction: "Payment",
  }));

  const donutChartData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [10000, 40000],
        backgroundColor: ["#0B4B31", "#CFE6DB"],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const semiCircleData = {
    labels: ["Cash Stripe", "Cash Stripe"],
    datasets: [
      {
        data: [60000, 20000],
        backgroundColor: ["#1D8C6C", "#0B4B31"],
        borderWidth: 0,
      },
    ],
  };

  const semiCircleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Paid",
        data: [0, 0, 0, 0, 0, 10000, 10000, 0, 0, 0, 0, 0],
        backgroundColor: "#A4E4CE",
        stack: "stack1",
        borderRadius: 12,
      },
      {
        label: "Unpaid",
        data: [0, 0, 0, 0, 0, 4000, 4000, 0, 0, 0, 0, 0],
        backgroundColor: "#EF7566",
        stack: "stack1",
        borderRadius: 12,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => `${value / 1000}K`,
        },
        grid: {
          color: "#E5E7EB",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
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
    if (action === "payment") {
      router.push(`/dashboard/finance/invoice/${id}/payment`);
    } else if (action === "view") {
      router.push(`/dashboard/finance/invoice/${id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/finance/invoice/${id}/edit`);
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
          Welcome to
        </p>
        <h1 className="font-medium text-[#000000] sm:text-[1.75rem]">
          MaktabOS
        </h1>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-8 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 px-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            placeholder="dd/mm/yyyy"
          />
          <div className="relative w-full">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            >
              <option value="">Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">
              ▾
            </span>
          </div>
          <button
            type="button"
            className="rounded-full bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90 whitespace-nowrap"
          >
            Manage
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-[18px] bg-[#E5EFEB] px-8 py-6">
          <div>
            <p className="text-[1.5rem] font-semibold text-[#0B4B31]">125</p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Total Invoices</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold text-[#0B4B31]">$48,620.00</p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Total Amount</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold text-[#0B4B31]">$333,090.00</p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Paid Amount</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold text-[#0B4B31]">$47,380.00</p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Unpaid Amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Payment Status Distribution</h3>
              <select className="rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
                <option>This month</option>
                <option>Last month</option>
                <option>This year</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="w-48 h-48">
                <Doughnut data={donutChartData} options={donutOptions} />
              </div>

              <div className="space-y-4 text-sm font-medium text-[#0B4B31]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-[#0B4B31]"></span>
                  <div>
                    <p className="text-[0.8125rem] font-normal text-[#979699]">Paid</p>
                    <p className="text-[1.0625rem] font-semibold text-[#000000]">10K</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-[#CFE6DB]"></span>
                  <div>
                    <p className="text-[0.8125rem] font-normal text-[#979699]">Unpaid</p>
                    <p className="text-[1.0625rem] font-semibold text-[#000000]">40K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Payment Status Distribution</h3>
              <select className="rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
                <option>This month</option>
                <option>Last month</option>
                <option>This year</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="w-48 h-48">
                <Doughnut data={semiCircleData} options={semiCircleOptions} />
              </div>
              <div className="space-y-3 text-[0.8125rem] font-normal text-[#0000008C]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: "#0B4B31" }}></span>
                  <span className="text-[0.8125rem] font-normal text-[#0000008C]">Cash Stripe</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: "#32C66B" }}></span>
                  <span className="text-[0.8125rem] font-normal text-[#0000008C]">Cash Stripe (Alt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Payment Status Distribution</h3>
            <select className="rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-xs text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold text-[#0B4B31]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#A4E4CE]"></span>
                <div>
                  <p className="text-[0.8125rem] font-normal text-[#0000008C]">Paid</p>
                  <p className="text-xl font-bold text-[#1B1464]">10K</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#EF7566]"></span>
                <div>
                  <p className="text-[0.8125rem] font-normal text-[#0000008C]">Unpaid</p>
                  <p className="text-xl font-bold text-[#1B1464]">4K</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[0.8125rem] font-medium text-[#0000008C]">Unpaid Invoices Report</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-normal text-[#0B4B31] whitespace-nowrap">
              Filter By :
            </label>
            <div className="relative flex-1">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">
                ▾
              </span>
            </div>
            <button
              type="button"
              className="rounded-full bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90"
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
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
            />
          </label>

          <div>
            <button
              type="button"
              className="rounded-full border border-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B3138]"
            >
              See All ↗
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Amount</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((invoice) => {
                const isDropdownOpen = openDropdownId === invoice.id;
                return (
                  <tr
                    key={invoice.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="font-normal text-[#1e1e1e]">{invoice.parentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{invoice.phoneNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#1e1e1e]">{invoice.dueAmount}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-[#C43B30] px-4 py-2 text-sm font-normal text-white">
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleActionClick("payment", invoice.id, e)}
                        className="inline-flex items-center rounded-full bg-[#C43B30] px-4 py-2 text-sm font-normal text-[#FFFFFF] transition hover:bg-[#a03024]"
                      >
                        {invoice.fundsAction}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(invoice.id, e)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B31]/90"
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
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("edit", invoice.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#E2E7E4] transition-all duration-150 hover:bg-[#E5EFEB]"
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-normal text-[#0000008C]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
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


