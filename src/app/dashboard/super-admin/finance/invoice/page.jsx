"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";
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

const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);

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
      router.push(`/dashboard/finance/invoice/${id}/payment`);
    } else {
      console.log(`${action} clicked for invoice ${id}`);
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] sm:text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      {/* Removed summary widgets per new design */}

      {/* Invoice Table Section */}
      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        {/* Title + Export Button */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#104D2E]">Invoices</h2>

        </div>


        <div className="mt-6 space-y-4">
          {/* Filter and Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-normal text-[#0B4B31] whitespace-nowrap">
              Filter By:
            </label>
            <div className="relative flex-1">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
            </div>
            <button
              type="button"
              className="rounded-full border-2 border-white bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="relative flex w-full items-center">
              <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
              />
            </label>

            {/* See All Button */}
            {/* <div>
              <button
                type="button"
                className="rounded-full text-[#0B4B31] px-4 py-2 text-sm font-normal transition bg-[#0B4B3138]"
              >
                See All ↗
              </button>
            </div> */}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Amont</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
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
                        <span className="font-medium text-[#1e1e1e]">{invoice.parentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{invoice.phoneNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#1e1e1e]">{invoice.dueAmount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-normal ${isUnpaid ? "bg-[#F71735] text-white" : "bg-[#0B4B31] text-[#71DD8C]"
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
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-normal transition ${isUnpaid ? "bg-[#F71735] hover:bg-[#F71735]/90 text-white" : "bg-[#0B4B31] text-[#71DD8C]"
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
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal text-[#0B4B31] transition bg-[#0B4B3138]"
                        >
                          Action
                          <span>▾</span>
                        </button>

                        {isDropdownOpen && (
                          <div
                            ref={(el) => (dropdownRefs.current[invoice.id] = el)}
                            className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#00000040] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("view", invoice.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 bg-[#0B4B3138]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("edit", invoice.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
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
