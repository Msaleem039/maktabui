"use client";

import { Edit, Trash2, X, Search, Download, FileText, Calendar, User, DollarSign, CreditCard } from "lucide-react";

const ViewInvoiceModal = ({ invoice, paymentRecords = [], onClose }) => {
  if (!invoice) return null;

  const {
    _id,
    invoiceNumber = "N/A",
    items = [],
    totalAmount = 0,
    paidAmount = 0,
    currency = "USD",
    status = "unpaid",
    paymentType = "Not Specified",
    dueDate,
    notes = "",
    createdBy = {},
    createdAt,
    students = []
  } = invoice;

  // Calculate remaining amount
  const remainingAmount = totalAmount - paidAmount;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "unpaid":
        return "bg-red-100 text-red-600";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "UnPaid";
      case "partially_paid":
        return "Partially Paid";
      default:
        return status || "Unknown";
    }
  };

  // Get payment type icon
  const getPaymentTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "card":
        return <CreditCard size={14} />;
      case "cash":
        return <DollarSign size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount * (item.quantity || 1)), 0);
  };

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
            Invoice Details
          </h2>
          <div className="flex flex-wrap items-center gap-2">
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
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B4B31] sm:text-2xl">
                    Invoice {invoiceNumber}
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <div className="mb-1 text-xs text-[#0B4B31] sm:text-sm">
                    Invoice ID
                  </div>
                  <div className="text-sm font-mono font-bold text-[#0B4B31] sm:text-base">
                    {_id?.slice(-8) || "N/A"}
                  </div>
                  <div className="mt-2 text-xs text-[#0B4B31]">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      Issued: {formatDate(createdAt)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      Due: {formatDate(dueDate)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Meta Info */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                    Payment Method
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[#0B4B31]">
                    {getPaymentTypeIcon(paymentType)}
                    <span className="capitalize">{paymentType}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                    Currency
                  </div>
                  <div className="mt-1 text-sm text-[#0B4B31]">{currency}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                    Created By
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[#0B4B31]">
                    <User size={14} />
                    <span>{createdBy.name || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="px-4 py-3 sm:px-6 sm:py-4">
              {/* Students Section */}
              {students && students.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-[#0B4B31] sm:text-base">
                    Students ({students.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {students.map((student, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        Student {index + 1}: {student._id?.slice(-6) || "Unknown"}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Table */}
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
                        Unit Price ({currency})
                      </th>
                      <th className="pb-2 text-right text-xs font-semibold text-[#7D8D87] sm:text-sm">
                        Total ({currency})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 text-xs font-semibold text-[#123629] sm:text-sm">
                            {item.description || "Item"}
                          </td>
                          <td className="py-3 text-center text-xs font-semibold text-[#123629] sm:text-sm">
                            {item.quantity || 1}
                          </td>
                          <td className="py-3 text-right text-xs font-semibold text-[#123629] sm:text-sm">
                            {item.amount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-3 text-right text-xs font-semibold text-[#123629] sm:text-sm">
                            {(item.amount * (item.quantity || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-xs text-[#5E6C64] sm:text-sm">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Amount Summary */}
              <div className="mt-4 flex justify-end">
                <div className="w-full space-y-1.5 sm:w-64 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#7D8D87]">Subtotal</span>
                    <span className="font-semibold text-[#123629]">
                      {currency} {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#7D8D87]">Total Amount</span>
                    <span className="font-semibold text-[#123629]">
                      {currency} {totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#7D8D87]">Paid Amount</span>
                    <span className="font-semibold text-green-600">
                      {currency} {paidAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 ${
                    remainingAmount > 0 ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <span className="text-xs font-semibold text-[#0B4B31] sm:text-sm">
                      Remaining Balance
                    </span>
                    <span className={`text-sm font-bold ${
                      remainingAmount > 0 ? 'text-red-600' : 'text-green-600'
                    } sm:text-base`}>
                      {currency} {remainingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice From and Notes */}
              <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
                <div>
                  <h4 className="mb-1.5 text-sm font-semibold text-[#0B4B31] sm:text-base">
                    Invoice From
                  </h4>
                  <div className="space-y-0.5 text-xs text-[#123629] sm:text-sm">
                    <div>{createdBy.name || "MaktabOS"}</div>
                    <div>{createdBy.email || "email@company.com"}</div>
                    <div>Invoice ID: {_id?.slice(-12) || "N/A"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1.5 text-sm font-semibold text-[#0B4B31] sm:text-base">
                    Additional Notes
                  </h4>
                  <p className="text-xs text-[#123629] sm:text-sm whitespace-pre-wrap">
                    {notes || "No additional notes."}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;