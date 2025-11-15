"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentDonePage({ params }) {
  const router = useRouter();

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

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-[#0B4B31] p-6">
              <CheckCircle size={64} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#0B4B31]">Payment Done</h2>
          <p className="text-lg text-gray-600">Your payment has been processed successfully.</p>
          <button
            onClick={() => router.push("/dashboard/super-admin/finance/invoice")}
            className="rounded-full bg-[#0B4B31] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    </div>
  );
}

