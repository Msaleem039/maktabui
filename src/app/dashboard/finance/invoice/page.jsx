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
import { getAllInvoicesAction } from "@/redux/slices/invoiceSlices/invoiceSlices";

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
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const { invoices, loading, error } = useSelector((state) => state.getAllInvoices);

  useEffect(() => {
    dispatch(getAllInvoicesAction());
  }, [dispatch]);

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
    event.preventDefault();
    event.stopPropagation();

    if (action === "addFunds" || action === "payment") {
      router.push(`/dashboard/finance/invoice/${id}/payment`);
    } else if (action === "view") {
      router.push(`/dashboard/student/${id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/student/${id}/edit`);
    } else {
      console.log(`${action} clicked for invoice ${id}`);
    }

    setOpenDropdownId(null);
  };

  const filteredTableData = tableData.filter((invoice) => {
    const matchesSearch = searchValue === "" ||
      invoice.parentName.toLowerCase().includes(searchValue.toLowerCase()) ||
      invoice.studentName.toLowerCase().includes(searchValue.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase());

    const matchesFilter = filterBy === "" ||
      (filterBy === "paid" && invoice.paymentStatus === "PAID") ||
      (filterBy === "unpaid" && invoice.paymentStatus === "UNPAID");

    return matchesSearch && matchesFilter;
  });

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

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31]"></div>
          <p className="mt-2 text-[#0B4B31]">Loading invoices...</p>
        </div>
      )}

      {error && (
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
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white px-4 py-2 text-sm font-normal bg-[#0B4B31] text-white transition"
            >
              <Download size={16} className="text-white" />
              Export Data
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
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
              onClick={() => dispatch(getAllInvoicesAction())}
              className="rounded-full border-2 border-white bg-[#0B4B3138] px-6 py-3 text-sm font-normal text-[#0B4B31] whitespace-nowrap"
            >
              Refresh
            </button>
          </div>

          <label className="relative flex w-full items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by invoice number, parent or student name..."
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>

          <div>
            <button
              type="button"
              className="rounded-full text-[#0B4B31] px-4 py-2 text-sm font-normal transition bg-[#0B4B3138]"
            >
              See All ↗
            </button>
          </div>
        </div>

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
              {filteredTableData.map((invoice) => {
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
                            <button
                              type="button"
                              onClick={(e) => handleActionClick("payment", invoice.id, invoice.originalInvoice, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            >
                              {isUnpaid ? "Make Payment" : "Add Funds"}
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

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-normal text-[#0000008C]">
            Showing 1 to {filteredTableData.length} of {invoices?.length || 0} entries
          </div>
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