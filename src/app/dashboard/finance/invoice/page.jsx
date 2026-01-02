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
import {
  getAllInvoicesAction,
  setInvoicesPage,
  setInvoicesSearch,
  setInvoicesFilter
} from "@/redux/slices/invoiceSlices/invoiceSlices";

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
  const dispatch = useDispatch();
  const [localSearch, setLocalSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownDirections, setDropdownDirections] = useState({});
  const [dropdownPositions, setDropdownPositions] = useState({});
  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});

  const {
    invoices,
    loading,
    error,
    pagination,
    search: storeSearch,
    filters
  } = useSelector((state) => state.getAllInvoices);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  // Sync local search with store search on mount
  useEffect(() => {
    if (storeSearch) {
      setLocalSearch(storeSearch);
    }
  }, [storeSearch]);

  // Fetch invoices when search, filters, or pagination changes
  useEffect(() => {
    dispatch(getAllInvoicesAction({
      search: debouncedSearch,
      status: filters.status,
      page: pagination.currentPage,
      limit: pagination.itemsPerPage
    }));
  }, [dispatch, debouncedSearch, filters.status, pagination.currentPage, pagination.itemsPerPage]);

  const tableData = invoices?.map((invoice, index) => {
    const isUnpaid = invoice.status === "pending" || invoice.status === "unpaid";
    const dueAmount = isUnpaid ? `$${(invoice.totalAmount - (invoice.paidAmount || 0)).toFixed(2)}` : "$0.00";
    const paymentStatus = isUnpaid ? "UNPAID" : "PAID";

    return {
      id: invoice._id || `invoice-${index + 1}`,
      invoiceNumber: invoice.invoiceNumber || "N/A",
      parentName: invoice.parent?.fullName || "N/A",
      studentName: invoice.student?.name || "N/A",
      totalAmount: `$${invoice.totalAmount?.toFixed(2) || "0.00"}`,
      paidAmount: `$${invoice.paidAmount?.toFixed(2) || "0.00"}`,
      dueAmount: dueAmount,
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A",
      paymentStatus: paymentStatus,
      status: invoice.status || "pending",
      fundsAction: isUnpaid ? "Payment" : "Add Funds",
      originalInvoice: invoice,
    };
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          // Check if click is on the button
          const isButtonClick = Object.values(buttonRefs.current).some(
            (buttonRef) => buttonRef && buttonRef.contains(event.target)
          );
          if (!isButtonClick) {
            setOpenDropdownId(null);
          }
        }
      });
    };

    const handleScroll = () => {
      // Close dropdown on scroll
      setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    const isOpening = openDropdownId !== id;

    if (isOpening && typeof window !== "undefined") {
      const button = event.currentTarget;
      const buttonRect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      const dropdownHeight = 120; // Approximate height of dropdown with 2 items
      const dropdownWidth = 180;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      // Calculate position
      let top, left, right;
      
      if (shouldOpenUp) {
        top = buttonRect.top - dropdownHeight - 8; // 8px margin
      } else {
        top = buttonRect.bottom + 8; // 8px margin
      }

      // Align to right edge of button
      right = viewportWidth - buttonRect.right;
      
      // Ensure dropdown stays within viewport
      if (right + dropdownWidth > viewportWidth) {
        right = viewportWidth - dropdownWidth - 8;
      }
      if (right < 8) {
        right = 8;
      }

      setDropdownDirections((prev) => ({
        ...prev,
        [id]: shouldOpenUp ? "up" : "down",
      }));

      setDropdownPositions((prev) => ({
        ...prev,
        [id]: { top, right },
      }));
    } else {
      setDropdownDirections((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDropdownPositions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }

    setOpenDropdownId(isOpening ? id : null);
  };

  const handleActionClick = (action, id, originalInvoice, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (action === "addFunds" || action === "payment") {
      router.push(`/dashboard/finance/invoice/${id}/payment`);
    } else if (action === "view") {
      router.push(`/dashboard/finance/invoice/${id}/detail`);
    } else if (action === "edit") {
      router.push(`/dashboard/finance/invoice/${id}/edit`);
    } else {
      console.log(`${action} clicked for invoice ${id}`);
    }

    setOpenDropdownId(null);
  };

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    dispatch(setInvoicesSearch(value));
    // Reset to page 1 when searching
    if (value !== debouncedSearch) {
      dispatch(setInvoicesPage(1));
    }
  };

  const handleStatusFilter = (status) => {
    dispatch(setInvoicesFilter({ status }));
    dispatch(setInvoicesPage(1));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setInvoicesPage(newPage));
    }
  };

  const handleLimitChange = (newLimit) => {
    // You can add limit change functionality here
    console.log("Change limit to:", newLimit);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const current = pagination.currentPage;
    const total = pagination.totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  };

  const handlePageButtonClick = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= pagination.totalPages) {
      handlePageChange(page);
    }
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

      {loading && invoices.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31]"></div>
          <p className="mt-2 text-[#0B4B31]">Loading invoices...</p>
        </div>
      )}

      {error && invoices.length === 0 && (
        <div className="rounded-[36px] border border-red-300 bg-red-50 px-6 py-6 text-red-700">
          <p>Error loading invoices: {error}</p>
          <button
            onClick={() => dispatch(getAllInvoicesAction())}
            className="mt-2 rounded-full bg-[#0B4B31] px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Invoices</h2>

          <div className="flex flex-wrap items-center gap-3">
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-normal text-[#0B4B31] whitespace-nowrap">
              Filter By:
            </label>
            <div className="relative flex-1">
              <select
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(getAllInvoicesAction())}
              className="rounded-full border-2 border-white bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] whitespace-nowrap"
            >
              Refresh
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="relative flex w-full items-center">
              <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
              <input
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by invoice number, parent or student name..."
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

        {/* Loading overlay for table */}
        {loading && invoices.length > 0 && (
          <div className="mt-6 flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-[#0B4B31]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B4B31] border-r-transparent"></div>
              <span className="text-sm">Loading invoices...</span>
            </div>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Invoice #</th>
                <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Paid Amount</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Amount</th>
                <th className="px-4 font-normal text-[#0000008C]">Due Date</th>
                <th className="px-4 font-normal text-[#0000008C]">Status</th>
                <th className="px-4 font-normal text-[#0000008C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((invoice) => {
                const isUnpaid = invoice.paymentStatus === "UNPAID";
                const isDropdownOpen = openDropdownId === invoice.id;
                return (
                  <tr
                    key={invoice.id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#1e1e1e]">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="font-medium text-[#1e1e1e]">{invoice.parentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {invoice.paidAmount}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1e1e1e]">
                      {invoice.dueAmount}
                    </td>
                    <td className="px-4 py-3 font-normal text-[#1e1e1e]">
                      {invoice.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-normal ${isUnpaid ? "bg-[#F71735] text-white" : "bg-[#0B4B31] text-[#71DD8C]"
                          }`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <button
                          ref={(el) => (buttonRefs.current[invoice.id] = el)}
                          type="button"
                          onClick={(e) => toggleDropdown(invoice.id, e)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal text-[#0B4B31] transition bg-[#0B4B3138]"
                        >
                          Action
                          <span>▾</span>
                        </button>

                        {isDropdownOpen && (
                          <div
                            ref={(el) => {
                              dropdownRefs.current[invoice.id] = el;
                            }}
                            style={{
                              position: 'fixed',
                              top: `${dropdownPositions[invoice.id]?.top || 0}px`,
                              right: `${dropdownPositions[invoice.id]?.right || 0}px`,
                              zIndex: 9999,
                            }}
                            className="min-w-[180px] rounded-xl border border-[#00000040] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("view", invoice.id, invoice.originalInvoice, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 bg-[#0B4B3138]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("edit", invoice.id, invoice.originalInvoice, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              Edit
                            </button>
                            {/* <button
                              type="button"
                              onClick={(e) => handleActionClick("payment", invoice.id, invoice.originalInvoice, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              {isUnpaid ? "Make Payment" : "Add Funds"}
                            </button> */}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {!loading && (!tableData || tableData.length === 0) && (
            <div className="text-center py-8 text-[#0B4B31]">
              {localSearch || filters.status ? "No invoices match your search criteria" : "No invoices found"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalItems > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-normal text-[#0000008C]">
              Showing {tableData?.length || 0} of {pagination.totalItems} entries
              {(localSearch || filters.status) && " (filtered)"}
            </div>
            <div className="flex items-center gap-3">
              {/* <select 
                value={pagination.itemsPerPage}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                className="rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                <option value="10">Display 10</option>
                <option value="20">Display 20</option>
                <option value="50">Display 50</option>
              </select> */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasPrevPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ‹
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageButtonClick(page)}
                    disabled={page === '...'}
                    className={`rounded-full border border-[#C5D2CD] px-4 py-2 text-sm transition ${page === pagination.currentPage
                      ? 'bg-[#0B4B31] text-white border-[#0B4B31]'
                      : page === '...'
                        ? 'bg-white text-[#0B4B31] cursor-default'
                        : 'bg-white text-[#0B4B31] hover:bg-[#F3F6F5]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasNextPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}