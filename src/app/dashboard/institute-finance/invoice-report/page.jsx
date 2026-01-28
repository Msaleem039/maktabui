"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getAdminInvoicesStats, setInvoicesPage } from "@/redux/slices/adminInvoiceSlices/adminInvoiceSlices";
import { useTheme } from "@/hooks/useTheme";

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
  const dispatch = useDispatch();
  const { themeColor, mainText } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [unpaidSearch, setUnpaidSearch] = useState("");
  const [unpaidFilterBy, setUnpaidFilterBy] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const { 
    stats, 
    invoices: unpaidInvoices, 
    pagination, 
    loading, 
    error 
  } = useSelector((state) => state.adminInvoice || {});

  const unpaidPage = pagination?.currentPage || 1;
  const unpaidLimit = pagination?.itemsPerPage || 10;
  const totalUnpaidCount = pagination?.totalItems || 0;
  const totalUnpaidPages = pagination?.totalPages || 0;

  useEffect(() => {
    const filters = {
      date: selectedDate,
      status: selectedStatus,
      search: searchValue,
      filterBy: filterBy,
      page: unpaidPage,
      limit: unpaidLimit,
      unpaidSearch,
      unpaidStatus: unpaidFilterBy
    };
    dispatch(getAdminInvoicesStats(filters));
  }, [
    dispatch,
    selectedDate,
    selectedStatus,
    searchValue,
    filterBy,
    unpaidPage,
    unpaidLimit,
    unpaidSearch,
    unpaidFilterBy
  ]);
  console.log("unpaidInvoices",unpaidInvoices);

  const tableData = unpaidInvoices?.map((invoice, index) => {
    const dueAmount = invoice.totalAmount - (invoice.paidAmount || 0);
    const isPartiallyPaid = invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalAmount;

    let statusText = "UNPAID";
let statusColor = "#C43B30";

if (invoice.status === "paid") {
  statusText = "PAID";
  statusColor = "#27AE60";
} else if (invoice.status === "overdue") {
  statusText = "OVERDUE";
  statusColor = "#922113";
} else if (isPartiallyPaid) {
  statusText = "PARTIALLY PAID";
  statusColor = "#E67E22";
} else if (invoice.status === "pending") {
  statusText = "PENDING";
  statusColor = "#E67E22";
}

    return {
      id: invoice._id || `invoice-${index + 1}`,
      adminName: invoice.admin?.name || invoice.admin?.email || "N/A",
      phoneNumber: invoice.admin?.phone || "N/A",
      invoiceNumber: invoice.invoiceNumber || "N/A",
      dueAmount: `$${dueAmount.toFixed(2)}`,
      paymentStatus: statusText,
      statusColor: statusColor,
      fundsAction: "Payment",
      originalInvoice: invoice,
      isPartiallyPaid,
    };
  }) || [];
  console.log("tableData",tableData);

  const calculateChartData = () => {
    if (!stats) {
      return {
        totalPaid: 0,
        totalUnpaid: 0,
        paymentMethods: { stripe: 0, other: 0 },
        monthlyData: {
          paid: Array(12).fill(0),
          unpaid: Array(12).fill(0)
        }
      };
    }

    return {
      totalPaid: stats.totalPaidAmount || 0,
      totalUnpaid: stats.totalUnpaidAmount || 0,
      paymentMethods: {
        stripe: stats.stripePayments || 0,
        other: stats.otherPayments || 0
      },
      monthlyData: {
        paid: stats.monthlyPaid || Array(12).fill(0),
        unpaid: stats.monthlyUnpaid || Array(12).fill(0)
      }
    };
  };

  const chartData = calculateChartData();

  const donutChartData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [chartData.totalPaid, chartData.totalUnpaid],
        backgroundColor: [themeColor, "#CFE6DB"],
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
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      },
    },
  };

  const semiCircleData = {
    labels: ["Cash Stripe", "Other Methods"],
    datasets: [
      {
        data: [chartData.paymentMethods.stripe, chartData.paymentMethods.other],
        backgroundColor: ["#1D8C6C", themeColor],
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
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      },
    },
  };

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Paid",
        data: chartData.monthlyData.paid,
        backgroundColor: "#A4E4CE",
        stack: "stack1",
        borderRadius: 12,
      },
      {
        label: "Unpaid",
        data: chartData.monthlyData.unpaid,
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
          callback: (value) => `$${value.toLocaleString()}`,
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
        enabled: true,
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: $${value.toLocaleString()}`;
          }
        }
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

  const handleActionClick = (action, id, originalInvoice, event) => {
    event.stopPropagation();
    if (action === "payment") {
      router.push(`/dashboard/institute-finance/invoice/${id}/payment`);
    } else if (action === "view") {
      router.push(`/dashboard/institute-finance/invoice/${id}/detail`);
    } else if (action === "edit") {
      router.push(`/dashboard/institute-finance/invoice/${id}/edit`);
    }
    setOpenDropdownId(null);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUnpaidSearchChange = (e) => {
    setUnpaidSearch(e.target.value);
    dispatch(setInvoicesPage(1)); // Reset to first page when searching
  };

  const handleUnpaidFilterChange = (e) => {
    setUnpaidFilterBy(e.target.value);
    dispatch(setInvoicesPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setInvoicesPage(newPage));
  };

  const handleLimitChange = (e) => {

    const newLimit = Number(e.target.value);
    const filters = {
      date: selectedDate,
      status: selectedStatus,
      search: searchValue,
      filterBy: filterBy,
      page: 1, 
      limit: newLimit,
      unpaidSearch,
      unpaidStatus: unpaidFilterBy
    };
    dispatch(getAdminInvoicesStats(filters));
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, unpaidPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalUnpaidPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Calculate display range
  const startIndex = (unpaidPage - 1) * unpaidLimit + 1;
  const endIndex = Math.min(unpaidPage * unpaidLimit, totalUnpaidCount);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
          Welcome to
        </p>
        <h1 className="font-medium text-[#000000] sm:text-[1.75rem]">
          {mainText}
        </h1>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeColor }}></div>
          <p className="mt-2" style={{ color: themeColor }}>Loading admin invoice statistics...</p>
        </div>
      )}

      {error && (
        <div className="rounded-[36px] border border-red-300 bg-red-50 px-6 py-6 text-red-700">
          <p>Error loading admin invoice statistics: {error}</p>
          <button
            onClick={() => {
              const filters = {
                date: selectedDate,
                status: selectedStatus,
                search: searchValue,
                filterBy,
                page: unpaidPage,
                limit: unpaidLimit,
                unpaidSearch,
                unpaidStatus: unpaidFilterBy
              };
              dispatch(getAdminInvoicesStats(filters));
            }}
            className="mt-2 rounded-full px-4 py-2 text-white"
            style={{ backgroundColor: themeColor }}
          >
            Retry
          </button>
        </div>
      )}

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-8 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10 space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-[18px] bg-[#E5EFEB] px-8 py-6">
          <div>
            <p className="text-[1.5rem] font-semibold" style={{ color: themeColor }}>
              {stats?.totalInvoices || 0}
            </p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Total Invoices</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold" style={{ color: themeColor }}>
              ${stats?.totalAmount?.toLocaleString() || '0.00'}
            </p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Total Amount</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold" style={{ color: themeColor }}>
              ${stats?.totalPaidAmount?.toLocaleString() || '0.00'}
            </p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Paid Amount</p>
          </div>
          <div>
            <p className="text-[1.5rem] font-semibold" style={{ color: themeColor }}>
              ${stats?.totalUnpaidAmount?.toLocaleString() || '0.00'}
            </p>
            <p className="text-[1.5rem] font-normal text-[#0000008C] mt-1">Unpaid Amount</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status Distribution */}
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Payment Status Distribution</h3>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="rounded-full border bg-white px-4 py-2 text-xs outline-none"
                style={{ borderColor: themeColor, color: themeColor }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
              >
                <option value="">All Time</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="this_year">This year</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="w-48 h-48">
                <Doughnut data={donutChartData} options={donutOptions} />
              </div>

              <div className="space-y-4 text-sm font-medium" style={{ color: themeColor }}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  <div>
                    <p className="text-[0.8125rem] font-normal text-[#979699]">Paid</p>
                    <p className="text-[1.0625rem] font-semibold text-[#000000]">
                      ${chartData.totalPaid.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-[#CFE6DB]"></span>
                  <div>
                    <p className="text-[0.8125rem] font-normal text-[#979699]">Unpaid</p>
                    <p className="text-[1.0625rem] font-semibold text-[#000000]">
                      ${chartData.totalUnpaid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Payment Methods</h3>
              <select
                value={selectedDate}
                onChange={handleDateChange}
                className="rounded-full border bg-white px-4 py-2 text-xs outline-none"
                style={{ borderColor: themeColor, color: themeColor }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
              >
                <option value="">All Time</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="this_year">This year</option>
              </select>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="w-48 h-48">
                <Doughnut data={semiCircleData} options={semiCircleOptions} />
              </div>
              <div className="space-y-3 text-[0.8125rem] font-normal text-[#0000008C]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: "#1D8C6C" }}></span>
                  <span className="text-[0.8125rem] font-normal text-[#0000008C]">Cash Stripe</span>
                  <span className="text-[0.8125rem] font-semibold text-[#000000]">
                    ${chartData.paymentMethods.stripe.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  <span className="text-[0.8125rem] font-normal text-[#0000008C]">Other Methods</span>
                  <span className="text-[0.8125rem] font-semibold text-[#000000]">
                    ${chartData.paymentMethods.other.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[0.8125rem] font-medium text-[#0000008C]">Monthly Revenue</h3>
            <select
              value={filterBy}
              onChange={handleFilterChange}
              className="rounded-full border bg-white px-4 py-2 text-xs outline-none"
              style={{ borderColor: themeColor, color: themeColor }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
            >
              <option value="">All Time</option>
              <option value="this_year">This Year</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold" style={{ color: themeColor }}>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#A4E4CE]"></span>
                <div>
                  <p className="text-[0.8125rem] font-normal text-[#0000008C]">Paid</p>
                  <p className="text-xl font-bold text-[#1B1464]">
                    ${chartData.totalPaid.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#EF7566]"></span>
                <div>
                  <p className="text-[0.8125rem] font-normal text-[#0000008C]">Unpaid</p>
                  <p className="text-xl font-bold text-[#1B1464]">
                    ${chartData.totalUnpaid.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unpaid Admin Invoices Report Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[0.8125rem] font-medium text-[#0000008C]">Unpaid Admin Invoices Report</h2>
        </div>

        {/* Unpaid Admin Invoices Filters */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-normal whitespace-nowrap" style={{ color: themeColor }}>
              Filter By Status:
            </label>
            <div className="relative flex-1">
              <select
                value={unpaidFilterBy}
                onChange={handleUnpaidFilterChange}
                className="w-full appearance-none rounded-full border bg-white py-3 pl-4 pr-10 text-sm outline-none"
                style={{ borderColor: themeColor, color: themeColor }}
                onFocus={(e) => e.target.style.borderColor = themeColor}
              >
                <option value="">All</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: themeColor }}>
                ▾
              </span>
            </div>
          </div>

          <label className="relative flex w-full items-center">
            <span className="absolute left-4" style={{ color: `${themeColor}99` }}>🔍</span>
            <input
              value={unpaidSearch}
              onChange={handleUnpaidSearchChange}
              placeholder="Search by admin name, or invoice number..."
              className="w-full rounded-full border bg-white py-3 pl-10 pr-4 text-sm outline-none"
              style={{ borderColor: themeColor, color: themeColor }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
            />
          </label>
        </div>

        {/* Unpaid Admin Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Admin Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Invoice Number</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Amount</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Action</th>
                <th className="px-4 font-normal text-[#0000008C]">More</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? tableData.map((invoice) => {
                const isDropdownOpen = openDropdownId === invoice.id;
                return (
                  <tr
                    key={invoice.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm hover:bg-[#F3F6F5] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="font-normal text-[#1e1e1e]">{invoice.adminName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#1e1e1e]">{invoice.dueAmount}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-normal text-white"
                        style={{ backgroundColor: invoice.statusColor }}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleActionClick("payment", invoice.id, invoice.originalInvoice, e)}
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
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal transition"
                          style={{ 
                            backgroundColor: `${themeColor}38`,
                            color: themeColor
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = `${themeColor}90`}
                          onMouseLeave={(e) => e.target.style.backgroundColor = `${themeColor}38`}
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
                              onClick={(e) => handleActionClick("view", invoice.id, invoice.originalInvoice, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("edit", invoice.id, invoice.originalInvoice, e)}
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
              }) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#0000008C]">
                    {loading ? "Loading unpaid admin invoices..." : "No unpaid admin invoices found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-normal text-[#0000008C]">
            Showing {startIndex} to {endIndex} of {totalUnpaidCount} entries
          </div>
          <div className="flex items-center gap-3">
            <select
              value={unpaidLimit}
              onChange={handleLimitChange}
              className="rounded-full border bg-white px-4 py-2 text-sm outline-none"
              style={{ borderColor: themeColor, color: themeColor }}
              onFocus={(e) => e.target.style.borderColor = themeColor}
            >
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(unpaidPage - 1, 1))}
                disabled={unpaidPage === 1}
                className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: themeColor }}
              >
                ‹
              </button>

              {generatePageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    unpaidPage === pageNum
                      ? "text-white"
                      : "border border-[#C5D2CD] bg-white hover:bg-[#F3F6F5]"
                  }`}
                  style={unpaidPage === pageNum ? { backgroundColor: themeColor } : { color: themeColor }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(unpaidPage + 1, totalUnpaidPages))}
                disabled={unpaidPage === totalUnpaidPages || totalUnpaidPages === 0}
                className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: themeColor }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}