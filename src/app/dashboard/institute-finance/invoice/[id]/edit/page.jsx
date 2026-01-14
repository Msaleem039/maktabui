"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  getAdminInvoiceById,
  updateAdminInvoice,
  clearAdminInvoiceSuccess,
  clearCurrentAdminInvoice,
} from "@/redux/slices/adminInvoiceSlices/adminInvoiceSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAllAdminsNameAction } from "@/redux/slices/adminSlices/adminSlices";

export default function EditAdminInvoice() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  
  const hasShownUpdateSuccess = useRef(false);
  const redirectTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  const { 
    currentInvoice,
    loading,
    error,
    success
  } = useSelector((state) => state.getAdminInvoiceById || {});
  
  const { 
    adminsName: adminsList = [], 
    loading: adminsLoading 
  } = useSelector((state) => state.getAllAdminsName || {});

  const [formData, setFormData] = useState({
    admin: "",
    totalAmount: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    status: "pending",
    paidAmount: 0,
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    admin: false,
  });

  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    dispatch(clearAdminInvoiceSuccess());
    dispatch(clearCurrentAdminInvoice());
    hasShownUpdateSuccess.current = false;
    setIsUpdateSuccess(false);
    setIsSubmitted(false);
    isInitialMount.current = true;
    
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      dispatch(clearAdminInvoiceSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getAdminInvoiceById(id));
    }
    dispatch(getAllAdminsNameAction());
  }, [dispatch, id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (currentInvoice && !isSubmitted) {
      setFormData({
        admin: currentInvoice.admin?._id || "",
        totalAmount: currentInvoice.totalAmount || 0,
        dueDate: currentInvoice.dueDate
          ? new Date(currentInvoice.dueDate).toISOString().split("T")[0]
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
        notes: currentInvoice.notes || "",
        status: currentInvoice.status || "pending",
        paidAmount: currentInvoice.paidAmount || 0,
      });
    }
  }, [currentInvoice, isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalAmount" || name === "paidAmount") {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDropdownSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownOpen((prev) => ({ ...prev, [name]: false }));
  };

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!formData.admin) {
      alert("Please select an admin");
      setIsSubmitted(false);
      return;
    }

    if (formData.totalAmount <= 0) {
      alert("Total amount must be greater than 0");
      setIsSubmitted(false);
      return;
    }

    if (formData.paidAmount > formData.totalAmount) {
      alert("Paid amount cannot exceed total amount");
      setIsSubmitted(false);
      return;
    }

    const payload = {
      admin: formData.admin,
      totalAmount: formData.totalAmount,
      dueDate: formData.dueDate,
      notes: formData.notes,
      status: formData.status,
      paidAmount: formData.paidAmount,
    };
    
    hasShownUpdateSuccess.current = false;
    setIsUpdateSuccess(false);
    
    dispatch(updateAdminInvoice({ id, data: payload }));
  };

  useEffect(() => {
    if (success && isSubmitted && !hasShownUpdateSuccess.current) {
      hasShownUpdateSuccess.current = true;
      setIsUpdateSuccess(true);
      
      redirectTimerRef.current = setTimeout(() => {
        dispatch(clearAdminInvoiceSuccess());
        setIsUpdateSuccess(false);
        setIsSubmitted(false);
        router.push("/dashboard/institute-finance/invoice");
      }, 2000);

      return () => {
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
        }
      };
    }
  }, [success, isSubmitted, router, dispatch]);

  const adminOptions = adminsList?.map((admin) => {
    const adminId = admin._id || admin.id;
    const adminName = admin.name || admin.email || `Admin ${adminId?.substring(0, 6) || "Unknown"}`;

    return {
      value: adminId,
      label: adminName,
    };
  }) || [];

  const selectedAdmin = adminOptions.find(
    (option) => option.value === formData.admin
  );
  const selectedAdminName = selectedAdmin ? selectedAdmin.label : 
    (currentInvoice?.admin?.name || currentInvoice?.admin?.email || "Select Admin");

  if (loading && !currentInvoice) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading invoice data...</div>
      </div>
    );
  }

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
        {currentInvoice && (
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">
              Invoice:{" "}
              <span className="font-semibold">{currentInvoice.invoiceNumber}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Admin: <span className="font-semibold">{currentInvoice.admin?.name || "Unknown"}</span>
            </p>
          </div>
        )}
      </div>

      <div className="relative mx-auto max-w-4xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Edit Admin Invoice
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isUpdateSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Invoice updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimpleDropdown
              label="Admin"
              name="admin"
              value={formData.admin}
              displayValue={selectedAdminName}
              options={adminOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.admin}
              onToggle={toggleDropdown}
              placeholder="Select Admin"
              required
              disabled={adminsLoading || loading}
            />

            <FormInput
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />

            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-[#E2E7E4] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B4B31] focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <FormInput
              label="Paid Amount"
              name="paidAmount"
              type="number"
              value={formData.paidAmount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={formData.totalAmount}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes or description for this invoice..."
              rows="3"
              className="w-full border border-[#E2E7E4] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B4B31] focus:border-transparent"
            />
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#E5EFEB] px-10 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Invoice..." : "Update Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}