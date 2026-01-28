"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  getInvoiceByIdAction,
  updateInvoiceAction,
  resetUpdateInvoiceState,
  clearUpdateInvoiceError,
} from "@/redux/slices/invoiceSlices/invoiceSlices";
import { FormInput } from "@/components/FormInput";
import { getAllParentsWithStudents } from "@/redux/slices/parentSlices/parentSlice";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";

export default function EditInvoice() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const adminId = getAdminId();

  const { invoice, loading: invoiceLoading } = useSelector(
    (state) => state.getInvoiceById,
  );

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.updateInvoice);

  const { data: parentsWithStudents } = useSelector(
    (state) => state.getAllParentsWithStudents,
  );

  const paymentTypeOptions = [
    { value: "cash", label: "Cash" },
    { value: "stripe", label: "Stripe" },
    { value: "card", label: "Card" },
    { value: "ZELLE", label: "Zelle" },
  ];

  const [formData, setFormData] = useState({
    parentId: "",
    studentId: "",
    items: [{ description: "", amount: "", quantity: 1 }],
    totalAmount: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    status: "pending",
    paidAmount: "",
    paymentType: "cash",
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    parentId: false,
    studentId: false,
    paymentType: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(resetUpdateInvoiceState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearUpdateInvoiceError());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getInvoiceByIdAction(id));
    }
    dispatch(getAllParentsWithStudents(adminId));
  }, [dispatch, id, adminId]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        parentId: invoice.parent?._id || invoice.parent || "",
        studentId: invoice.student?._id || invoice.student || "",
        items: invoice.items?.map((item) => ({
          description: item.description || "",
          amount: item.amount?.toString() || "",
          quantity: item.quantity || 1,
        })) || [{ description: "", amount: "", quantity: 1 }],
        totalAmount: invoice.totalAmount?.toString() || "",
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
        notes: invoice.notes || "",
        status: invoice.status || "pending",
        paidAmount: invoice.paidAmount?.toString() || "",
        paymentType: invoice.paymentType,
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (formData.parentId && parentsWithStudents) {
      const parent = parentsWithStudents.find(
        (p) => p._id === formData.parentId,
      );
      if (parent && parent.students?.length > 0) {
        const currentStudentInParent = parent.students.find(
          (s) => s._id === formData.studentId,
        );
        if (!currentStudentInParent) {
          setFormData((prev) => ({
            ...prev,
            studentId: parent.students[0]._id,
          }));
        }
      } else {
        setFormData((prev) => ({ ...prev, studentId: "" }));
      }
    }
  }, [formData.parentId, formData.studentId, parentsWithStudents]);

  useEffect(() => {
    if (updateSuccess) {
      setShowSuccess(true);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (updateError) {
      setLocalError(updateError);
    } else {
      setLocalError(null);
    }
  }, [updateError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));

    const total = updatedItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + amount * quantity;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      totalAmount: total > 0 ? total.toFixed(2) : "",
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", amount: "", quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));

      const total = updatedItems.reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + amount * quantity;
      }, 0);

      setFormData((prev) => ({
        ...prev,
        totalAmount: total > 0 ? total.toFixed(2) : "",
      }));
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

    setShowSuccess(false);
    setLocalError(null);
    dispatch(clearUpdateInvoiceError());

    const invalidItems = formData.items.filter((item) => {
      const amount = parseFloat(item.amount);
      return !item.description || isNaN(amount) || amount <= 0;
    });

    if (invalidItems.length > 0) {
      alert(
        "Please enter valid description and amount for all items (amount must be greater than 0)",
      );
      return;
    }

    const paidAmount = parseFloat(formData.paidAmount) || 0;
    const totalAmount = parseFloat(formData.totalAmount) || 0;

    if (paidAmount > totalAmount) {
      alert("Paid amount cannot exceed total amount");
      return;
    }

    const payload = {
      parentId: formData.parentId,
      studentId: formData.studentId,
      items: formData.items.map((item) => ({
        description: item.description,
        amount: parseFloat(item.amount) || 0,
        quantity: parseInt(item.quantity) || 1,
      })),
      totalAmount: parseFloat(formData.totalAmount) || 0,
      dueDate: formData.dueDate,
      notes: formData.notes,
      status: formData.status,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      paymentType: formData.paymentType,
    };

    dispatch(updateInvoiceAction({ id, updateData: payload }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetUpdateInvoiceState());
    };
  }, [dispatch]);

  const parentOptions = parentsWithStudents?.map((p) => ({
    value: p._id,
    label: `${p.fullName}`,
  }));

  const studentOptions =
    parentsWithStudents
      ?.find((p) => p._id === formData.parentId)
      ?.students?.map((s) => ({
        value: s._id,
        label: `${s.studentName}`,
      })) || [];

  if (invoiceLoading) {
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
        {invoice && (
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">
              Invoice:{" "}
              <span className="font-semibold">{invoice.invoiceNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Payment Type:{" "}
              <span className="font-semibold capitalize">
                {invoice.paymentType || "cash"}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Edit Invoice
        </h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError}
          </div>
        )}

        {showSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Invoice updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Dropdown */}
            <SimpleDropdown
              label="Parent"
              name="parentId"
              value={formData.parentId}
              options={parentOptions || []}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.parentId}
              onToggle={toggleDropdown}
              placeholder="Select Parent"
              required
            />

            {/* Student Dropdown */}
            <SimpleDropdown
              label="Student"
              name="studentId"
              value={formData.studentId}
              options={studentOptions || []}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.studentId}
              onToggle={toggleDropdown}
              placeholder="Select Student"
              required
            />

            {/* Due Date */}
            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />

            <SimpleDropdown
              label="Payment Type"
              name="paymentType"
              value={formData.paymentType}
              options={paymentTypeOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.paymentType}
              onToggle={toggleDropdown}
              placeholder="Select Payment Type"
              required
            />

            {/* Status */}
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
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Paid Amount */}
            <FormInput
              label="Paid Amount"
              name="paidAmount"
              type="number"
              value={formData.paidAmount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max={parseFloat(formData.totalAmount) || 0}
              placeholder="0.00"
            />

            {/* Total Amount */}
            <div>
              <FormInput
                label="Total Amount"
                name="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                readOnly
                className="bg-gray-50"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Calculated automatically from items
              </p>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Invoice Items
            </h3>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <FormInput
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <FormInput
                      label="Amount"
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="w-full bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-4 bg-[#0B4B31] text-white px-4 py-2 rounded text-sm font-semibold"
            >
              + Add Item
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes (optional)"
              rows="3"
              className="w-full border border-[#E2E7E4] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B4B31] focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={updateLoading || invoiceLoading}
              className="rounded-full bg-[#E5EFEB] px-10 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50"
            >
              {updateLoading ? "Updating Invoice..." : "Update Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}