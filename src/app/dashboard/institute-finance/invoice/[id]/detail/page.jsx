"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminInvoiceById,
  clearCurrentAdminInvoice,
} from "@/redux/slices/adminInvoiceSlices/adminInvoiceSlices";
import { ArrowLeft, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import * as domtoimage from "dom-to-image";

export default function ViewAdminInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    currentInvoice: invoice,
    loading: invoiceLoading,
    error: invoiceError,
  } = useSelector((state) => state.getAdminInvoiceById);

  const [invoiceData, setInvoiceData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (params?.id) {
      dispatch(getAdminInvoiceById(params.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
    }
  }, [invoice]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentAdminInvoice());
    };
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoiceData?.currency || "USD",
    }).format(amount || 0);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending";
      case "overdue":
        return "Overdue";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  const calculateRemainingAmount = () => {
    if (!invoiceData) return 0;
    return (invoiceData.totalAmount || 0) - (invoiceData.paidAmount || 0);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    setIsGeneratingPDF(true);

    try {
      const getStatusColor = (status) => {
        switch (status) {
          case "paid":
            return "#dcfce7";
          case "pending":
            return "#fef9c3";
          case "overdue":
            return "#fee2e2";
          case "cancelled":
            return "#f3f4f6";
          default:
            return "#f3f4f6";
        }
      };

      const getStatusTextColor = (status) => {
        switch (status) {
          case "paid":
            return "#166534";
          case "pending":
            return "#854d0e";
          case "overdue":
            return "#991b1b";
          case "cancelled":
            return "#374151";
          default:
            return "#374151";
        }
      };

      const remainingAmount = calculateRemainingAmount();
      const isFullyPaid = remainingAmount <= 0;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("ADMIN INVOICE", margin, yPos);

      pdf.setFontSize(12);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      yPos += 8;
      pdf.text(
        `#${invoiceData.invoiceNumber || invoiceData._id || "N/A"}`,
        margin,
        yPos,
      );

      const statusText = getStatusText(invoiceData.status);
      const statusTextWidth =
        (pdf.getStringUnitWidth(statusText) * 8) / pdf.internal.scaleFactor;
      const statusX = pageWidth - margin - statusTextWidth - 10;

      pdf.setFillColor(getStatusColor(invoiceData.status));
      pdf.roundedRect(
        statusX - 5,
        margin - 5,
        statusTextWidth + 10,
        8,
        4,
        4,
        "F",
      );

      pdf.setFontSize(8);
      pdf.setTextColor(getStatusTextColor(invoiceData.status));
      pdf.setFont("helvetica", "bold");
      pdf.text(statusText, statusX, margin, { align: "center" });

      yPos += 12;
      pdf.setDrawColor(11, 75, 49);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      const sectionWidth = (contentWidth - 15) / 2;

      const billFromY = yPos;
      pdf.setFillColor(229, 239, 235);
      pdf.roundedRect(margin, billFromY, sectionWidth, 50, 5, 5, "F");
      pdf.setDrawColor(210, 226, 219);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, billFromY, sectionWidth, 50, 5, 5, "S");

      pdf.setFontSize(11);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill From", margin + 8, billFromY + 8);

      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "normal");
      pdf.text("MaktabOS School", margin + 8, billFromY + 16);

      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.text("123 Education Street", margin + 8, billFromY + 22);
      pdf.text("Learning City, LC 12345", margin + 8, billFromY + 27);
      pdf.text("contact@maktabos.edu", margin + 8, billFromY + 32);
      pdf.text("(123) 456-7890", margin + 8, billFromY + 37);

      const billToX = margin + sectionWidth + 15;
      pdf.setFillColor(229, 239, 235);
      pdf.roundedRect(billToX, yPos, sectionWidth, 50, 5, 5, "F");
      pdf.setDrawColor(210, 226, 219);
      pdf.roundedRect(billToX, yPos, sectionWidth, 50, 5, 5, "S");

      pdf.setFontSize(11);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To", billToX + 8, yPos + 8);

      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "normal");
      pdf.text(invoiceData.admin?.name || "N/A", billToX + 8, yPos + 16);

      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.text(invoiceData.admin?.email || "N/A", billToX + 8, yPos + 22);

      pdf.setDrawColor(210, 226, 219);
      pdf.setLineWidth(0.5);
      pdf.line(billToX + 8, yPos + 28, billToX + sectionWidth - 8, yPos + 28);

      pdf.setFontSize(9);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Role", billToX + 8, yPos + 35);

      pdf.setFontSize(10);
      pdf.setTextColor(30, 30, 30);
      pdf.text("Administrator", billToX + 8, yPos + 41);

      yPos += 60;

      pdf.setFontSize(12);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Invoice Summary", margin, yPos);
      yPos += 8;

      pdf.setFillColor(229, 239, 235);
      pdf.roundedRect(margin, yPos, contentWidth, 35, 5, 5, "F");
      pdf.setDrawColor(210, 226, 219);
      pdf.roundedRect(margin, yPos, contentWidth, 35, 5, 5, "S");

      const summaryYStart = yPos + 10;

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Total Amount", margin + 10, summaryYStart);
      pdf.setFontSize(11);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatCurrency(invoiceData.totalAmount),
        pageWidth - margin - 10,
        summaryYStart,
        { align: "right" },
      );

      pdf.setDrawColor(210, 226, 219);
      pdf.setLineWidth(0.5);
      pdf.line(
        margin + 10,
        summaryYStart + 5,
        pageWidth - margin - 10,
        summaryYStart + 5,
      );

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Paid Amount", margin + 10, summaryYStart + 13);
      pdf.setFontSize(11);
      pdf.setTextColor(22, 163, 74);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatCurrency(invoiceData.paidAmount || 0),
        pageWidth - margin - 10,
        summaryYStart + 13,
        { align: "right" },
      );

      pdf.line(
        margin + 10,
        summaryYStart + 18,
        pageWidth - margin - 10,
        summaryYStart + 18,
      );

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Currency", margin + 10, summaryYStart + 26);
      pdf.setFontSize(11);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        invoiceData.currency || "USD",
        pageWidth - margin - 10,
        summaryYStart + 26,
        { align: "right" },
      );

      yPos += 45;

      const paymentSectionWidth = (contentWidth - 15) / 2;

      pdf.setFontSize(12);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Payment Information", margin, yPos);
      yPos += 8;

      pdf.setFillColor(229, 239, 235);
      pdf.roundedRect(margin, yPos, paymentSectionWidth, 65, 5, 5, "F");
      pdf.setDrawColor(210, 226, 219);
      pdf.roundedRect(margin, yPos, paymentSectionWidth, 65, 5, 5, "S");

      const paymentYStart = yPos + 10;

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Due Date", margin + 10, paymentYStart);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatDate(invoiceData.dueDate),
        margin + paymentSectionWidth - 10,
        paymentYStart,
        { align: "right" },
      );

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Invoice Date", margin + 10, paymentYStart + 12);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatDate(invoiceData.createdAt),
        margin + paymentSectionWidth - 10,
        paymentYStart + 12,
        { align: "right" },
      );

      if (invoiceData.notes && invoiceData.notes.trim()) {
        pdf.setDrawColor(210, 226, 219);
        pdf.setLineWidth(0.5);
        pdf.line(
          margin + 10,
          paymentYStart + 24,
          margin + paymentSectionWidth - 10,
          paymentYStart + 24,
        );

        pdf.setFontSize(9);
        pdf.setTextColor(102, 102, 102);
        pdf.setFont("helvetica", "bold");
        pdf.text("Notes", margin + 10, paymentYStart + 31);

        pdf.setFontSize(9);
        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "normal");

        const notes = pdf.splitTextToSize(
          invoiceData.notes,
          paymentSectionWidth - 20,
        );
        notes.forEach((line, index) => {
          pdf.text(line, margin + 10, paymentYStart + 37 + index * 4);
        });
      }

      const amountX = margin + paymentSectionWidth + 15;
      const amountY = yPos - 8;
      pdf.setFontSize(12);
      pdf.setTextColor(11, 75, 49);
      pdf.setFont("helvetica", "bold");
      pdf.text("Amount Summary", amountX, amountY);
      yPos += 8;

      pdf.setFillColor(229, 239, 235);
      pdf.roundedRect(amountX, yPos, paymentSectionWidth, 65, 5, 5, "F");
      pdf.setDrawColor(210, 226, 219);
      pdf.roundedRect(amountX, yPos, paymentSectionWidth, 65, 5, 5, "S");

      const amountYStart = yPos + 10;

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Total Amount", amountX + 10, amountYStart);
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatCurrency(invoiceData.totalAmount),
        amountX + paymentSectionWidth - 10,
        amountYStart,
        { align: "right" },
      );

      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont("helvetica", "normal");
      pdf.text("Amount Paid", amountX + 10, amountYStart + 12);
      pdf.setFontSize(11);
      pdf.setTextColor(22, 163, 74);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatCurrency(invoiceData.paidAmount || 0),
        amountX + paymentSectionWidth - 10,
        amountYStart + 12,
        { align: "right" },
      );

      pdf.save(
        `admin-invoice-${invoiceData.invoiceNumber || invoiceData._id}.pdf`,
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = () => {
    generatePDF();
  };

  if (invoiceLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading invoice details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (invoiceError || !invoiceData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">
              {invoiceError || "Invoice not found"}
            </p>
            <button
              onClick={() =>
                router.push("/dashboard/institute-finance/invoice")
              }
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Admin Invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remainingAmount = calculateRemainingAmount();
  const isFullyPaid = remainingAmount <= 0;

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

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => router.push("/dashboard/institute-finance/invoice")}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() =>
            router.push(
              `/dashboard/institute-finance/invoice/${invoiceData._id}/edit`,
            )
          }
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <Edit size={16} />
          Edit Invoice
        </button>
        <button
          onClick={handleDownload}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              <Download size={16} />
              Download PDF
            </>
          )}
        </button>
      </div>

      <section
        ref={invoiceRef}
        className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10 print:shadow-none print:border-none print:rounded-none"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-[#E2E7E4]">
          <div>
            <h2 className="text-2xl font-bold text-[#104D2E]">ADMIN INVOICE</h2>
            <p className="text-sm text-gray-600 mt-1">
              #{invoiceData.invoiceNumber}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getStatusColorClass(
                invoiceData.status,
              )}`}
            >
              {getStatusText(invoiceData.status)}
            </span>
            <p className="text-sm text-gray-600 mt-2">
              Created: {formatDate(invoiceData.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
              Bill From
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1E1E1E]">
                MaktabOS School
              </p>
              <p className="text-xs text-gray-600">123 Education Street</p>
              <p className="text-xs text-gray-600">Learning City, LC 12345</p>
              <p className="text-xs text-gray-600">contact@maktabos.edu</p>
              <p className="text-xs text-gray-600">(123) 456-7890</p>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
              Bill To
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1E1E1E]">
                {invoiceData.admin?.name || "N/A"}
              </p>
              <p className="text-xs text-gray-600">
                {invoiceData.admin?.email || "N/A"}
              </p>
              <div className="pt-2 border-t border-[#D2E2DB]">
                <p className="text-xs font-medium text-[#0B4B31]">Role</p>
                <p className="text-sm text-[#1E1E1E]">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
            Invoice Summary
          </h3>
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <div className="flex justify-between items-center py-3 border-b border-[#D2E2DB]">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-sm font-medium text-[#0B4B31]">
                {formatCurrency(invoiceData.totalAmount)}
              </p>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#D2E2DB]">
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-sm font-medium text-green-600">
                {formatCurrency(invoiceData.paidAmount || 0)}
              </p>
            </div>
            <div className="flex justify-between items-center py-3">
              <p className="text-sm text-gray-600">Currency</p>
              <p className="text-sm font-medium text-[#0B4B31]">
                {invoiceData.currency || "USD"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-xs text-gray-600">Due Date</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(invoiceData.dueDate)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-600">Invoice Date</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(invoiceData.createdAt)}
                </p>
              </div>
              {invoiceData.notes && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Notes</p>
                  <p className="text-sm text-[#1E1E1E]">{invoiceData.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
              Amount Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatCurrency(invoiceData.totalAmount)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-sm font-medium text-green-600">
                  {formatCurrency(invoiceData.paidAmount || 0)}
                </p>
              </div>
              <div className="flex justify-between border-t border-[#D2E7E4] pt-3">
                <p className="text-sm font-semibold text-[#0B4B31]">
                  {isFullyPaid ? "Amount Paid" : "Balance Due"}
                </p>
                <p
                  className={`text-sm font-bold ${
                    isFullyPaid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    isFullyPaid ? invoiceData.paidAmount : remainingAmount,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}