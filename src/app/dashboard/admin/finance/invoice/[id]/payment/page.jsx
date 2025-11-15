"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, Phone } from "lucide-react";

export default function PaymentPage({ params }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manual");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedDate, setSelectedDate] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const parentInfo = {
    name: "Abdalla Mumin",
    phone: "612-636-6438",
    email: "abdalla@example.com",
  };

  const handleMakePayment = () => {
    router.push(`/dashboard/admin/finance/invoice/${params.id}/payment-done`);
  };

  const handleSetUpRecurring = () => {
    router.push(`/dashboard/admin/finance/invoice/${params.id}/recurring-payment`);
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
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  activeTab === "manual"
                    ? "bg-[#0B4B31] text-white"
                    : "bg-[#E5EFEB] text-[#0B4B31]"
                }`}
              >
                Make Manual Payment
              </button>
              <button
                onClick={() => setActiveTab("onetime")}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  activeTab === "onetime"
                    ? "bg-[#0B4B31] text-white"
                    : "bg-[#E5EFEB] text-[#0B4B31]"
                }`}
              >
                Make One time Payment
              </button>
            </div>

            {activeTab === "manual" ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Amount
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter Amount"
                      className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 px-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cash</label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleMakePayment}
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Make a Payment
                </button>
              </>
            ) : (
              <>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cash</label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleMakePayment}
                    className="w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Pay $270.00 at One time
                  </button>

                  <div className="text-center text-sm text-gray-500">OR</div>

                  <button
                    onClick={handleSetUpRecurring}
                    className="w-full rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Set Up Recurring Payment
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* User Contact Card */}
        <div className="lg:col-span-1">
          <div className="rounded-[18px] border border-[#E2E7E4] bg-[#E5EFEB] px-6 py-8 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24 mb-4">
                <Image
                  src="/user-icon.svg"
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg font-bold text-[#0B4B31] mb-6 text-center">
                {parentInfo.name}
              </h3>
              <div className="w-full space-y-3">
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  <MessageSquare size={16} />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B4B31] to-[#1C6A45] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  <Phone size={16} />
                  Call the Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

