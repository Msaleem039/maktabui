"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    getInvoiceByIdAction,
    clearInvoiceData
} from "@/redux/slices/invoiceSlices/invoiceSlices";
import { ArrowLeft, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";
import * as domtoimage from 'dom-to-image';

export default function ViewInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { invoice, loading: invoiceLoading, error: invoiceError } = useSelector(
        (state) => state.getInvoiceById
    );

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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case "paid": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "overdue": return "bg-red-100 text-red-800";
            case "cancelled": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "paid": return "Paid";
            case "pending": return "Pending";
            case "overdue": return "Overdue";
            case "cancelled": return "Cancelled";
            default: return status || "Unknown";
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
            // Create a container for PDF generation
            const pdfContainer = document.createElement('div');
            pdfContainer.style.width = '794px';
            pdfContainer.style.padding = '40px';
            pdfContainer.style.backgroundColor = '#ffffff';
            pdfContainer.style.fontFamily = 'Arial, sans-serif';
            pdfContainer.style.color = '#000000';
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0';

            const getStatusColor = (status) => {
                switch (status) {
                    case "paid": return "#dcfce7";
                    case "pending": return "#fef9c3";
                    case "overdue": return "#fee2e2";
                    case "cancelled": return "#f3f4f6";
                    default: return "#f3f4f6";
                }
            };

            const getStatusTextColor = (status) => {
                switch (status) {
                    case "paid": return "#166534";
                    case "pending": return "#854d0e";
                    case "overdue": return "#991b1b";
                    case "cancelled": return "#374151";
                    default: return "#374151";
                }
            };

            const remainingAmount = calculateRemainingAmount();
            const isFullyPaid = remainingAmount <= 0;

            // Build PDF HTML content
            pdfContainer.innerHTML = `
                <div style="margin-bottom: 30px; border-bottom: 2px solid #0B4B31; padding-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h1 style="font-size: 28px; font-weight: bold; color: #0B4B31; margin: 0 0 5px 0;">INVOICE</h1>
                            <p style="color: #666666; margin: 0; font-size: 14px;">#${invoiceData.invoiceNumber || invoiceData._id || 'N/A'}</p>
                        </div>
                        <div style="text-align: right;">
                            <span style="background-color: ${getStatusColor(invoiceData.status)}; color: ${getStatusTextColor(invoiceData.status)}; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; text-align: center;">
                                ${getStatusText(invoiceData.status)}
                            </span>
                            <p style="color: #666666; margin: 10px 0 0 0; font-size: 12px;">
                                Created: ${formatDate(invoiceData.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Bill From</h3>
                        <p style="font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">MaktabOS School</p>
                        <p style="color: #666666; margin: 0 0 4px 0; font-size: 12px;">123 Education Street</p>
                        <p style="color: #666666; margin: 0 0 4px 0; font-size: 12px;">Learning City, LC 12345</p>
                        <p style="color: #666666; margin: 0 0 4px 0; font-size: 12px;">contact@maktabos.edu</p>
                        <p style="color: #666666; margin: 0; font-size: 12px;">(123) 456-7890</p>
                    </div>

                    <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Bill To</h3>
                        <p style="font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">${invoiceData.parent?.fullName || "N/A"}</p>
                        <p style="color: #666666; margin: 0 0 4px 0; font-size: 12px;">${invoiceData.parent?.email || "N/A"}</p>
                        <p style="color: #666666; margin: 0 0 4px 0; font-size: 12px;">${invoiceData.parent?.phone || "N/A"}</p>
                        <div style="border-top: 1px solid #D2E2DB; padding-top: 12px; margin-top: 12px;">
                            <p style="color: #0B4B31; font-size: 12px; font-weight: bold; margin: 0 0 6px 0;">Student</p>
                            <p style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${invoiceData.student?.studentName || "N/A"}</p>
                            <p style="color: #666666; margin: 0; font-size: 12px;">${invoiceData.student?.email || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Invoice Items</h3>
                    <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; border-radius: 12px; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #D2E2DB;">
                                    <th style="padding: 12px 16px; text-align: left; color: #0B4B31; font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #D2E2DB;">Description</th>
                                    <th style="padding: 12px 16px; text-align: center; color: #0B4B31; font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #D2E2DB; width: 80px;">Qty</th>
                                    <th style="padding: 12px 16px; text-align: right; color: #0B4B31; font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #D2E2DB; width: 100px;">Amount</th>
                                    <th style="padding: 12px 16px; text-align: right; color: #0B4B31; font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #D2E2DB; width: 120px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoiceData.items?.map((item, index) => `
                                    <tr style="${index < invoiceData.items.length - 1 ? 'border-bottom: 1px solid #D2E2DB;' : ''}">
                                        <td style="padding: 12px 16px; color: #000000; font-size: 12px; vertical-align: top;">${item.description || 'N/A'}</td>
                                        <td style="padding: 12px 16px; text-align: center; color: #000000; font-size: 12px; vertical-align: top;">${item.quantity || 1}</td>
                                        <td style="padding: 12px 16px; text-align: right; color: #000000; font-size: 12px; vertical-align: top;">${formatCurrency(item.amount)}</td>
                                        <td style="padding: 12px 16px; text-align: right; color: #000000; font-size: 12px; font-weight: bold; vertical-align: top;">${formatCurrency((item.amount || 0) * (item.quantity || 1))}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Payment Information</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="color: #666666; font-size: 12px;">Due Date</span>
                            <span style="font-weight: bold; font-size: 12px;">${formatDate(invoiceData.dueDate)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${invoiceData.notes ? '12px' : '0'};">
                            <span style="color: #666666; font-size: 12px;">Invoice Date</span>
                            <span style="font-weight: bold; font-size: 12px;">${formatDate(invoiceData.createdAt)}</span>
                        </div>
                        ${invoiceData.notes ? `
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #D2E2DB;">
                                <p style="color: #666666; font-size: 12px; font-weight: bold; margin: 0 0 6px 0;">Notes</p>
                                <p style="font-size: 12px; margin: 0; line-height: 1.4;">${invoiceData.notes}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; padding: 20px; border-radius: 12px;">
                        <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Amount Summary</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="color: #666666; font-size: 13px;">Subtotal</span>
                            <span style="font-weight: bold; font-size: 13px;">${formatCurrency(invoiceData.totalAmount)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <span style="color: #666666; font-size: 13px;">Amount Paid</span>
                            <span style="color: #16a34a; font-weight: bold; font-size: 13px;">${formatCurrency(invoiceData.paidAmount || 0)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #D2E2DB; padding-top: 15px; margin-top: 10px;">
                            <span style="color: #0B4B31; font-weight: bold; font-size: 14px;">
                                ${isFullyPaid ? "Amount Paid" : "Balance Due"}
                            </span>
                            <span style="color: ${isFullyPaid ? '#16a34a' : '#dc2626'}; font-weight: bold; font-size: 14px;">
                                ${formatCurrency(isFullyPaid ? invoiceData.paidAmount : remainingAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                ${invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0 ? `
                    <div style="margin-top: 30px;">
                        <h3 style="color: #0B4B31; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">Payment History</h3>
                        <div style="border: 1px solid #D2E2DB; background-color: #E5EFEB; padding: 20px; border-radius: 12px;">
                            <div style="display: grid; gap: 12px;">
                                ${invoiceData.paymentHistory.map((payment, index) => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; ${index < invoiceData.paymentHistory.length - 1 ? 'border-bottom: 1px solid #D2E2DB;' : ''}">
                                        <div>
                                            <p style="font-weight: bold; margin: 0 0 4px 0; font-size: 13px;">${formatCurrency(payment.amount)}</p>
                                            <p style="color: #666666; margin: 0; font-size: 11px;">${formatDate(payment.date)}</p>
                                        </div>
                                        <span style="background-color: ${payment.status === "completed" ? '#dcfce7' : '#fef9c3'}; color: ${payment.status === "completed" ? '#166534' : '#854d0e'}; padding: 6px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; text-align: center;">
                                            ${payment.status}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E7E4; text-align: center;">
                    <p style="color: #666666; font-size: 11px; margin: 0;">
                        Thank you for your business! If you have any questions, please contact us at contact@maktabos.edu
                    </p>
                </div>
            `;

            document.body.appendChild(pdfContainer);

            const canvas = await domtoimage.toCanvas(pdfContainer, {
                quality: 1.0,
                bgcolor: '#ffffff',
                width: pdfContainer.offsetWidth,
                height: pdfContainer.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });

            // Clean up
            document.body.removeChild(pdfContainer);

            // Convert to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Save PDF
            pdf.save(`invoice-${invoiceData.invoiceNumber || invoiceData._id}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
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
                            onClick={() => router.push('/dashboard/finance/invoice')}
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
                    onClick={() => router.push('/dashboard/finance/invoice')}
                    className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <button
                    onClick={() => router.push(`/dashboard/finance/invoice/${invoiceData._id}/edit`)}
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
                        <p className="text-sm text-gray-600 mt-1">#{invoiceData.invoiceNumber}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getStatusColorClass(invoiceData.status)}`}>
                            {getStatusText(invoiceData.status)}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                            Created: {formatDate(invoiceData.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
                        <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Bill From</h3>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-[#1E1E1E]">MaktabOS School</p>
                            <p className="text-xs text-gray-600">123 Education Street</p>
                            <p className="text-xs text-gray-600">Learning City, LC 12345</p>
                            <p className="text-xs text-gray-600">contact@maktabos.edu</p>
                            <p className="text-xs text-gray-600">(123) 456-7890</p>
                        </div>
                    </div>

                    <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
                        <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Bill To</h3>
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
                    <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Invoice Items</h3>
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
                        <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Payment Information</h3>
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
                        <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Amount Summary</h3>
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
                                <p className={`text-sm font-bold ${isFullyPaid ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(isFullyPaid ? invoiceData.paidAmount : remainingAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-[#0B4B31] mb-4">Payment History</h3>
                        <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
                            <div className="space-y-3">
                                {invoiceData.paymentHistory.map((payment, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-[#D2E2DB] last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium text-[#1E1E1E]">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {formatDate(payment.date)}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${payment.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}>
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