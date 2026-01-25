"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceByIdAction,
  clearInvoiceData,
} from "@/redux/slices/invoiceSlices/invoiceSlices";
import { ArrowLeft, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useTheme } from "@/hooks/useTheme";

export default function ViewInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { themeColor, mainText } = useTheme();

  const {
    invoice,
    loading: invoiceLoading,
    error: invoiceError,
  } = useSelector((state) => state.getInvoiceById);

  const [invoiceData, setInvoiceData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (params?.id) {
      dispatch(getInvoiceByIdAction(params.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
    }
  }, [invoice]);

  useEffect(() => {
    return () => {
      dispatch(clearInvoiceData());
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
      currency: "USD",
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
  if (!invoiceData) return;

  setIsGeneratingPDF(true);

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let margin = 20;
    let yPosition = margin;

    const addText = (
      text,
      size = 12,
      weight = "normal",
      color = "#000000",
      align = "left",
      maxWidth = null,
    ) => {
      pdf.setFontSize(size);
      pdf.setFont("helvetica", weight);
      pdf.setTextColor(color);

      const textLines = pdf.splitTextToSize(
        text,
        maxWidth || pageWidth - 2 * margin,
      );

      textLines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        const xPosition =
          align === "center"
            ? pageWidth / 2
            : align === "right"
              ? pageWidth - margin
              : margin;

        pdf.text(line, xPosition, yPosition, { align });
        yPosition += size / 2.5;
      });

      yPosition += 2;
    };

    pdf.setFontSize(24);
    pdf.setTextColor(11, 75, 49);
    pdf.text("INVOICE", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    pdf.setFontSize(14);
    pdf.setTextColor(102, 102, 102);
    pdf.text(
      `#${invoiceData.invoiceNumber || invoiceData._id || "N/A"}`,
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );
    yPosition += 15;

    const getStatusColor = (status) => {
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

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(getStatusColor(invoiceData.status));
    pdf.text(
      getStatusText(invoiceData.status),
      pageWidth - margin,
      yPosition,
      { align: "right" },
    );

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(102, 102, 102);
    pdf.text(
      `Created: ${formatDate(invoiceData.createdAt)}`,
      pageWidth - margin,
      yPosition + 5,
      { align: "right" },
    );

    yPosition += 20;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Bill From", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("MaktabOS School", margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(102, 102, 102);
    pdf.text("123 Education Street", margin, yPosition);
    yPosition += 5;
    pdf.text("Learning City, LC 12345", margin, yPosition);
    yPosition += 5;
    pdf.text("contact@maktabos.edu", margin, yPosition);
    yPosition += 5;
    pdf.text("(123) 456-7890", margin, yPosition);

    yPosition += 15;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Bill To", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.parent?.fullName || "N/A", margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(102, 102, 102);
    pdf.text(invoiceData.parent?.email || "N/A", margin, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.parent?.phone || "N/A", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Student:", margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.student?.studentName || "N/A", margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(102, 102, 102);
    pdf.text(invoiceData.student?.email || "N/A", margin, yPosition);

    yPosition += 20;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Invoice Items", margin, yPosition);
    yPosition += 10;

    pdf.setFillColor(210, 226, 219);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");

    pdf.setTextColor(11, 75, 49);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    pdf.text("Description", margin + 5, yPosition + 6);
    pdf.text("Qty", margin + 120, yPosition + 6, { align: "center" });
    pdf.text("Amount", margin + 145, yPosition + 6, { align: "right" });
    pdf.text("Total", pageWidth - margin - 5, yPosition + 6, {
      align: "right",
    });

    yPosition += 12;

    invoiceData.items?.forEach((item, index) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin + 10;
      }

      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      const descLines = pdf.splitTextToSize(item.description || "N/A", 100);
      let descHeight = descLines.length * 5;

      pdf.text(descLines, margin + 5, yPosition + 5);
      pdf.text(item.quantity.toString(), margin + 120, yPosition + 5, {
        align: "center",
      });
      pdf.text(formatCurrency(item.amount), margin + 145, yPosition + 5, {
        align: "right",
      });
      pdf.text(
        formatCurrency(item.amount * item.quantity),
        pageWidth - margin - 5,
        yPosition + 5,
        { align: "right" },
      );

      yPosition += Math.max(descHeight, 10);

      if (index < invoiceData.items.length - 1) {
        pdf.setDrawColor(210, 226, 219);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 15;

    const remainingAmount = calculateRemainingAmount();
    const isFullyPaid = remainingAmount <= 0;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Payment Information", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Due Date: ${formatDate(invoiceData.dueDate)}`, margin, yPosition);
    yPosition += 8;
    pdf.text(
      `Invoice Date: ${formatDate(invoiceData.createdAt)}`,
      margin,
      yPosition,
    );

    if (invoiceData.notes) {
      yPosition += 8;
      pdf.text(`Notes: ${invoiceData.notes}`, margin, yPosition);
    }

    yPosition += 15;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 75, 49);
    pdf.text("Amount Summary", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Subtotal: ${formatCurrency(invoiceData.totalAmount)}`,
      margin,
      yPosition,
    );
    yPosition += 8;

    pdf.setTextColor(22, 163, 74);
    pdf.text(
      `Amount Paid: ${formatCurrency(invoiceData.paidAmount || 0)}`,
      margin,
      yPosition,
    );
    yPosition += 10;

    if (invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0) {
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(11, 75, 49);
      pdf.text("Payment History", margin, yPosition);
      yPosition += 10;

      invoiceData.paymentHistory.forEach((payment, index) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin + 10;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const textColor =
          payment.status === "completed" ? [22, 101, 52] : [133, 77, 14];
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(
          `${formatCurrency(payment.amount)} - ${formatDate(payment.date)} - ${payment.status}`,
          margin,
          yPosition,
        );
        yPosition += 8;
      });
    }

    pdf.save(`invoice-${invoiceData.invoiceNumber || invoiceData._id}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);

    const pdf = new jsPDF();
    const remainingAmount = calculateRemainingAmount();
    const isFullyPaid = remainingAmount <= 0;

    pdf.setFontSize(20);
    pdf.setTextColor(11, 75, 49);
    pdf.text("INVOICE", 105, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Invoice #: ${invoiceData.invoiceNumber || invoiceData._id}`,
      20,
      40,
    );
    pdf.text(`Status: ${getStatusText(invoiceData.status)}`, 20, 50);
    pdf.text(`Created: ${formatDate(invoiceData.createdAt)}`, 20, 60);

    pdf.text("Bill From:", 20, 80);
    pdf.text("MaktabOS School", 20, 90);
    pdf.text("123 Education Street, Learning City, LC 12345", 20, 100);

    pdf.text("Bill To:", 20, 120);
    pdf.text(invoiceData.parent?.fullName || "N/A", 20, 130);
    pdf.text(invoiceData.parent?.email || "N/A", 20, 140);
    pdf.text(`Student: ${invoiceData.student?.studentName || "N/A"}`, 20, 150);

    pdf.text("Invoice Items:", 20, 170);
    let yPos = 180;

    invoiceData.items?.forEach((item, index) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.text(
        `${item.description || "N/A"} x${item.quantity} @ ${formatCurrency(item.amount)} = ${formatCurrency(item.amount * item.quantity)}`,
        20,
        yPos,
      );
      yPos += 10;
    });

    yPos += 10;
    pdf.text("Amount Summary:", 20, yPos);
    yPos += 10;
    pdf.text(`Subtotal: ${formatCurrency(invoiceData.totalAmount)}`, 20, yPos);
    yPos += 10;
    pdf.text(
      `Amount Paid: ${formatCurrency(invoiceData.paidAmount || 0)}`,
      20,
      yPos,
    );

    pdf.save(`invoice-${invoiceData.invoiceNumber || invoiceData._id}.pdf`);
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
              onClick={() => router.push("/dashboard/finance/invoice")}
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Invoices
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
          <p className="text-[2.5rem] font-semibold mb-1" style={{ color: themeColor }}>
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            {mainText || "MaktabOS"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => router.push("/dashboard/finance/invoice")}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() =>
            router.push(`/dashboard/finance/invoice/${invoiceData._id}/edit`)
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
            <h2 className="text-2xl font-bold text-[#104D2E]">INVOICE</h2>
            <p className="text-sm text-gray-600 mt-1">
              #{invoiceData.invoiceNumber}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getStatusColorClass(invoiceData.status)}`}
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
                {invoiceData.parent?.fullName || "N/A"}
              </p>
              <p className="text-xs text-gray-600">
                {invoiceData.parent?.email || "N/A"}
              </p>
              <p className="text-xs text-gray-600">
                {invoiceData.parent?.phone || "N/A"}
              </p>
              <div className="pt-2 border-t border-[#D2E2DB]">
                <p className="text-xs font-medium text-[#0B4B31]">Student</p>
                <p className="text-sm text-[#1E1E1E]">
                  {invoiceData.student?.studentName || "N/A"}
                </p>
                <p className="text-xs text-gray-600">
                  {invoiceData.student?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
            Invoice Items
          </h3>
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#D2E2DB]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#0B4B31] uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-[#0B4B31] uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#0B4B31] uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#0B4B31] uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2E2DB]">
                {invoiceData.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-[#1E1E1E]">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E1E1E]">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-[#1E1E1E] font-medium">
                      {formatCurrency(item.amount * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <p className="text-sm text-gray-600">Subtotal</p>
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
                  className={`text-sm font-bold ${isFullyPaid ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(
                    isFullyPaid ? invoiceData.paidAmount : remainingAmount,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {invoiceData.paymentHistory &&
          invoiceData.paymentHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">
                Payment History
              </h3>
              <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
                <div className="space-y-3">
                  {invoiceData.paymentHistory.map((payment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-[#D2E2DB] last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1E1E1E]">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(payment.date)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}