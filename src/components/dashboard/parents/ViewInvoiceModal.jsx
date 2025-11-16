"use client";

import { Edit, Trash2, X, Search, Download } from "lucide-react";

const ViewInvoiceModal = ({ invoice, paymentRecords = [], onClose }) => {
  if (!invoice) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <h2 className="text-lg font-semibold text-[#0B4B31] sm:text-xl">
            Welcome to MaktabOS
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-[#0B4B31] transition hover:bg-gray-200 sm:px-4 sm:py-2 sm:text-sm">
              <Edit size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit Invoice</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-[#0B4B31] transition hover:bg-gray-200 sm:px-4 sm:py-2 sm:text-sm">
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Delete</span>
              <span className="sm:hidden">Del</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-1.5 text-gray-600 transition hover:bg-gray-200 sm:p-2"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="p-3 sm:p-5">
          <div className="rounded-[26px] border border-[#D2E2DB] bg-white shadow-sm">
            {/* Invoice Header */}
            <div className="rounded-t-[26px] bg-[#B9F2E3] px-4 py-3 sm:px-6 sm:py-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                      Status:
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 sm:px-3">
                      UnPaid
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B4B31] sm:text-2xl">Invoice</h3>
                </div>
                <div className="text-left sm:text-right">
                  <div className="mb-1 text-xs text-[#0B4B31] sm:text-sm">
                    Invoice No.
                  </div>
                  <div className="text-lg font-bold text-[#0B4B31] sm:text-xl">{invoice.id || "202501"}</div>
                  <div className="mt-1 text-xs text-[#0B4B31]">
                    Issued on August 5, 2025.
                  </div>
                  <div className="text-xs text-[#0B4B31]">
                    Payment Due August 12, 2025.
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                  Billed To: {invoice.billedTo || "Abdifatah Soyan"}
                </div>
                <div className="mt-1 text-xs text-[#0B4B31]/70">
                  Address / Contact Info
                </div>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="px-4 py-3 sm:px-6 sm:py-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-2 text-left text-xs font-semibold text-[#7D8D87] sm:text-sm">
                        Description
                      </th>
                      <th className="pb-2 text-center text-xs font-semibold text-[#7D8D87] sm:text-sm">
                        Qty.
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold text-[#7D8D87] sm:text-sm">
                        Amount
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold text-[#7D8D87] sm:text-sm">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 text-xs font-semibold text-[#123629] sm:text-sm">
                        {invoice.item || "Fee"}
                      </td>
                      <td className="py-2 text-center text-xs font-semibold text-[#123629] sm:text-sm">
                        1
                      </td>
                      <td className="py-2 text-right text-xs font-semibold text-[#123629] sm:text-sm">
                        700
                      </td>
                      <td className="py-2 text-right text-xs font-semibold text-[#123629] sm:text-sm">
                        700
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <div className="w-full space-y-1.5 sm:w-64 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#7D8D87]">Subtotal</span>
                    <span className="font-semibold text-[#123629]">700</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-[#B9F2E3] px-3 py-1.5 sm:px-4 sm:py-2">
                    <span className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                      Total (USD)
                    </span>
                    <span className="text-sm font-bold text-[#0B4B31] sm:text-base">700.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
                <div>
                  <h4 className="mb-1.5 text-sm font-semibold text-[#0B4B31] sm:text-base">
                    Invoice From
                  </h4>
                  <div className="space-y-0.5 text-xs text-[#123629] sm:text-sm">
                    <div>MaktabOS</div>
                    <div>email@company.com</div>
                    <div>ID#1 Label 1234567890-123</div>
                    <div>ID#2 Label ABC-0987654321</div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1.5 text-sm font-semibold text-[#0B4B31] sm:text-base">
                    Additional Notes
                  </h4>
                  <p className="text-xs text-[#123629] sm:text-sm">Have a great day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Records Section */}
          <div className="mt-3 rounded-[26px] border border-[#D2E2DB] bg-white p-4 shadow-sm sm:mt-4 sm:p-5">
            <h3 className="mb-3 text-lg font-semibold text-[#0B4B31] sm:text-xl">
              Payment Records
            </h3>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by date"
                  className="w-full rounded-full border border-gray-200 bg-white px-10 py-1.5 text-xs focus:border-[#0B4B31] focus:outline-none sm:py-2 sm:text-sm"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-full bg-[#0B4B31] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90 sm:px-4 sm:py-2 sm:text-sm">
                <Download size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-xs font-semibold text-gray-500 sm:text-sm">
                      Receipt #
                    </th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-500 sm:text-sm">
                      Payment Date
                    </th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-500 sm:text-sm">
                      Payment Amount
                    </th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-500 sm:text-sm">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRecords.length > 0 ? (
                    paymentRecords.map((record, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-xs text-[#123629] sm:text-sm">
                          {record.receiptNo}
                        </td>
                        <td className="py-2 text-xs text-[#123629] sm:text-sm">
                          {record.paymentDate}
                        </td>
                        <td className="py-2 text-xs text-[#123629] sm:text-sm">
                          {record.paymentAmount}
                        </td>
                        <td className="py-2 text-xs text-[#123629] sm:text-sm">
                          {record.paymentMethod}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-xs text-[#5E6C64] sm:text-sm"
                      >
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;

