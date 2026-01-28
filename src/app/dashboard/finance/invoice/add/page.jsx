"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInvoiceAction } from "@/redux/slices/invoiceSlices/invoiceSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { getAllParentsWithStudents } from "@/redux/slices/parentSlices/parentSlice";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

export default function CreateInvoice() {
  const dispatch = useDispatch();
  const router = useRouter();
  const adminId = getAdminId();
  const { mainText, themeColor } = useTheme();

  const { loading, invoice, success, error } = useSelector(
    (state) => state.createInvoice,
  );


  const { data: parentsWithStudents } = useSelector(
    (state) => state.getAllParentsWithStudents,
  );

  const paymentTypeOptions = [
    { value: "cash", label: "Cash" },
    { value: "stripe", label: "Stripe" },
    { value: "card", label: "Card" },
    { value: "zelle", label: "Zelle" },
  ];

  const [formData, setFormData] = useState({
    parentId: "",
    studentIds: [],
    items: [{ description: "", amount: "", quantity: 1 }],
    totalAmount: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    paymentType: "cash",
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    parentId: false,
    studentIds: false,
    paymentType: false,
  });

  useEffect(() => {
    dispatch(getAllParentsWithStudents(adminId));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      totalAmount: total > 0 ? total : "",
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
    if (name === "parentId") {
      setFormData((prev) => ({
        ...prev,
        parentId: value,
        studentIds: [],
      }));
    } else if (name === "studentIds") {
      setFormData((prev) => {
        const exists = prev.studentIds.includes(value);
        return {
          ...prev,
          studentIds: exists
            ? prev.studentIds.filter((id) => id !== value)
            : [...prev.studentIds, value],
        };
      });
      // Don't close dropdown immediately for multi-select
      return;
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setDropdownOpen((prev) => ({ ...prev, [name]: false }));
  };

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.parentId || formData.studentIds.length === 0) {
      alert("Please select at least one student");
      return;
    }

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

    const payload = {
      parentId: formData.parentId,
      studentIds: formData.studentIds, // This should already be an array
      items: formData.items.map((item) => ({
        description: item.description,
        amount: parseFloat(item.amount),
        quantity: parseInt(item.quantity) || 1,
      })),
      totalAmount: parseFloat(formData.totalAmount) || 0,
      dueDate: formData.dueDate,
      notes: formData.notes,
      paymentType: formData.paymentType,
      adminId,
    };

    console.log("Payload being sent:", payload); // For debugging

    dispatch(createInvoiceAction(payload));
  };

  useEffect(() => {
    if (success) {
      setFormData({
        parentId: "",
        studentIds: [],
        items: [{ description: "", amount: "", quantity: 1 }],
        totalAmount: "",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        notes: "",
        paymentType: "cash",
      });
    }
  }, [success, router]);

  const parentOptions =
    parentsWithStudents?.map((p) => ({
      value: p._id,
      label: `${p.fullName}`,
    })) || [];

  const selectedParent = parentsWithStudents?.find(
    (p) => p._id === formData.parentId,
  );

  const studentOptions =
    selectedParent?.students?.map((s) => ({
      value: s._id,
      label: `${s.studentName}`,
    })) || [];

  // Format selected students for display
  const getSelectedStudentDisplay = () => {
    if (formData.studentIds.length === 0) {
      return formData.parentId ? "Select Students" : "Select parent first";
    }

    const selectedNames = studentOptions
      .filter((student) => formData.studentIds.includes(student.value))
      .map((student) => student.label);

    if (selectedNames.length === 1) {
      return selectedNames[0];
    }
    return `${selectedNames.length} students selected`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className="text-[2.5rem] font-semibold"
            style={{ color: themeColor }}
          >
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            {mainText || "MaktabOS"}
          </h1>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
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
            Invoice created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimpleDropdown
              label="Parent"
              name="parentId"
              value={formData.parentId}
              options={parentOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen.parentId}
              onToggle={toggleDropdown}
              placeholder="Select Parent"
              required
            />

            {/* Custom Multi-Select Dropdown for Students */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Students *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("studentIds")}
                  disabled={!formData.parentId}
                  className={`w-full flex justify-between items-center border border-[#E2E7E4] rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#0B4B31] focus:border-transparent ${!formData.parentId ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
                >
                  <span
                    className={`${formData.studentIds.length === 0 ? "text-gray-400" : "text-gray-900"}`}
                  >
                    {getSelectedStudentDisplay()}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${dropdownOpen.studentIds ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen.studentIds && formData.parentId && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {studentOptions.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No students found
                      </div>
                    ) : (
                      studentOptions.map((student) => (
                        <div
                          key={student.value}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                            formData.studentIds.includes(student.value)
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={() =>
                            handleDropdownSelect("studentIds", student.value)
                          }
                        >
                          <div
                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                              formData.studentIds.includes(student.value)
                                ? "bg-[#0B4B31] border-[#0B4B31]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.studentIds.includes(student.value) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{student.label}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formData.parentId && formData.studentIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {studentOptions
                    .filter((student) =>
                      formData.studentIds.includes(student.value),
                    )
                    .map((student) => (
                      <span
                        key={student.value}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {student.label}
                        <button
                          type="button"
                          onClick={() =>
                            handleDropdownSelect("studentIds", student.value)
                          }
                          className="hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Calculated automatically
              </p>
            </div>
            <div></div>
          </div>

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

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#E5EFEB] px-10 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50"
            >
              {loading ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}