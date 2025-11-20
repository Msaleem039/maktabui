"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecurringPaymentPage({ params }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");

  const parentInfo = {
    name: "Abdi Mohamed",
    phone: "",
    email: "",
  };

  const invoiceInfo = {
    invoiceNumber: "97192",
    amount: "$270.00",
    dueDate: "2025-10-05",
  };

  const handleSetUpRecurring = () => {
    // Handle recurring payment setup
    console.log("Setting up recurring payment");
    // router.push(`/dashboard/finance/invoice/${params.id}/payment-done`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
            MaktabOS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <section className="rounded-[28px] border border-[#E2E7E4] bg-white px-8 py-8 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
            <button
              onClick={handleSetUpRecurring}
              className="w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 mb-6"
            >
              Set Up Recurring Payment
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Card Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">💳</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter Card Number"
                    className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 pl-12 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                  />
                </div>
              </div>

              <button
                onClick={handleSetUpRecurring}
                className="w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Pay $270.00 per month on 12-10-2025
              </button>

              <p className="text-sm text-red-600 font-medium">
                Note: The card will be charged automatically on 10-06-2025.
              </p>
            </div>
          </section>
        </div>

        {/* Information Panel */}
        <div className="lg:col-span-1">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-[#E5EFEB] px-6 py-8 shadow-sm space-y-6">
            {/* Parent Information */}
            <div>
              <div className="bg-[#0B4B31] text-white text-center py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">Parent Information</span>
              </div>
              <div className="space-y-2 text-sm text-[#0B4B31]">
                <p>
                  <span className="font-semibold">Name:</span> {parentInfo.name}
                </p>
                <p>
                  <span className="font-semibold">Phone Number:</span> {parentInfo.phone || ""}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {parentInfo.email || ""}
                </p>
              </div>
            </div>

            {/* Invoice Information */}
            <div>
              <div className="bg-[#0B4B31] text-white text-center py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">Invoice Information</span>
              </div>
              <div className="space-y-2 text-sm text-[#0B4B31]">
                <p>
                  <span className="font-semibold">Invoice#:</span> {invoiceInfo.invoiceNumber}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> {invoiceInfo.amount}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {invoiceInfo.dueDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

