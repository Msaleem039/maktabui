"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAdminInvoice, clearAdminInvoiceSuccess } from "@/redux/slices/adminInvoiceSlices/adminInvoiceSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";
import { getAllAdminsNameAction } from "@/redux/slices/adminSlices/adminSlices";

export default function CreateInvoice() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentAdminId = getAdminId();

  const { loading, success, error } = useSelector(
    (state) => state.adminInvoice || {}
  );

  const { adminsName: adminsList = [], loading: adminsLoading } = useSelector(
    (state) => state.getAllAdminsName || {}
  );

  const [formData, setFormData] = useState({
    admin: currentAdminId || "",
    totalAmount: "",
    paymentType: "CASH",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    admin: false,
    paymentType: false,
  });

  const paymentTypeOptions = [
    { value: "CASH", label: "Cash" },
    { value: "STRIPE", label: "Stripe" },
    { value: "CARD", label: "Card" },
    { value: "ZELLE", label: "Zelle" },
  ];

  useEffect(() => {
    dispatch(clearAdminInvoiceSuccess());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAdminsNameAction());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalAmount") {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.admin) {
      alert("Please select an admin");
      return;
    }

    const amount = parseFloat(formData.totalAmount) || 0;
    if (amount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }

    if (!["CASH", "STRIPE", "CARD"].includes(formData.paymentType)) {
      alert("Please select a valid payment type");
      return;
    }

    const payload = {
      adminId: formData.admin,
      totalAmount: amount,
      paymentType: formData.paymentType,
      dueDate: formData.dueDate,
      notes: formData.notes,
    };

    dispatch(createAdminInvoice(payload));
  };

  useEffect(() => {
    if (success) {
      setFormData({
        admin: currentAdminId || "",
        totalAmount: "",
        paymentType: "CASH",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        notes: "",
      });

      const redirectTimer = setTimeout(() => {
        dispatch(clearAdminInvoiceSuccess());
        router.push("/dashboard/institute-finance/invoice");
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [success, router, currentAdminId, dispatch]);

  const adminOptions =
    adminsList?.map((admin) => {
      const adminId = admin.id || admin._id || admin.value;
      const adminName =
        admin.name ||
        admin.email ||
        `Admin ${adminId?.substring(0, 6) || "Unknown"}`;

      return {
        value: adminId,
        label: `${adminName}`,
      };
    }) || [];

  const selectedAdmin = adminOptions.find(
    (option) => option.value === formData.admin
  );
  const selectedAdminName = selectedAdmin ? selectedAdmin.label : "";

  const selectedPaymentType = paymentTypeOptions.find(
    (option) => option.value === formData.paymentType
  );
  const selectedPaymentTypeLabel = selectedPaymentType ? selectedPaymentType.label : "";

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

      <div className="relative mx-auto max-w-4xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Create Invoice
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Invoice created successfully! Redirecting...
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
              disabled={adminsLoading}
            />

            <FormInput
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />

            <SimpleDropdown
              label="Payment Type"
              name="paymentType"
              value={formData.paymentType}
              displayValue={selectedPaymentTypeLabel}
              options={paymentTypeOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.paymentType}
              onToggle={toggleDropdown}
              placeholder="Select Payment Type"
              required
            />

            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
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
              {loading ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}