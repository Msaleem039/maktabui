"use client";

import { ChevronDown } from "lucide-react";

const defaultBars = [
  { month: "Jan", value: 18, className: "bg-[#0B4B31]" },
  { month: "Feb", value: 30, className: "bg-[#7DE0D8]" },
  { month: "Mar", value: 22, className: "bg-[#0C0C0C]" },
  { month: "Apr", value: 30, className: "bg-[#63E28F]" },
  { month: "May", value: 14, className: "bg-[#AFC6F2]" },
  { month: "Jun", value: 24, className: "bg-[#63E28F]" },
  { month: "Jul", value: 18, className: "bg-[#0B4B31]" },
  { month: "Aug", value: 30, className: "bg-[#7DE0D8]" },
  { month: "Sep", value: 22, className: "bg-[#0C0C0C]" },
  { month: "Oct", value: 32, className: "bg-[#63E28F]" },
  { month: "Nov", value: 14, className: "bg-[#AFC6F2]" },
  { month: "Dec", value: 24, className: "bg-[#63E28F]" },
];

const YearlyPaymentOverview = ({
  title = "Yearly Payment Overview",
  year = 2025,
  total = "$336,040",
  bars = defaultBars,
  paidLabel = "Paid",
  paidValue = "52.1%",
  unpaidLabel = "Unpaid",
  unpaidValue = "13.9%",
}) => {
  const maxValue =
    bars.length > 0 ? Math.max(...bars.map((bar) => bar.value)) : 0;

  return (
    <section className="overflow-hidden rounded-[36px] border border-[#E2E7E4] bg-white shadow-[0_24px_60px_-45px_rgba(11,75,49,0.35)]">
      <div className="px-6 pb-8 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[#0B4B31]">
            {title} <span className="text-[#0B4B31]/70">({total})</span>
          </h3>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full border border-[#0B4B31]/30 px-5 py-2 text-sm font-medium text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            aria-label={`Switch year. Current year ${year}`}
          >
            {year}
            <ChevronDown size={16} className="text-[#0B4B31]" />
          </button>
        </div>

        <div className="relative mt-8">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-medium text-[#97A29C]">
            <span>30K</span>
            <span>20K</span>
            <span>10K</span>
            <span>0</span>
          </div>

          <div className="ml-12 flex h-56 items-end gap-6">
            {bars.map((bar) => {
              const heightPercent =
                maxValue === 0 ? 0 : (bar.value / maxValue) * 100;

              return (
                <div
                  key={bar.month}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-8 rounded-[18px] ${bar.className} transition hover:opacity-80`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-medium text-[#9BA2A0]">
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E2E7E4] bg-[#F4F7F6] px-6 py-5 text-sm text-[#0B4B31] sm:flex-row sm:items-center sm:justify-around sm:px-8">
        <span className="flex items-center gap-3 font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-black" />
          {paidLabel} <span className="text-[#3F4A46]">({paidValue})</span>
        </span>
        <span className="flex items-center gap-3 font-medium">
          <span className="inline-block h-3 w-3 rounded-full bg-[#63E28F]" />
          {unpaidLabel} <span className="text-[#3F4A46]">({unpaidValue})</span>
        </span>
      </div>
    </section>
  );
};

export default YearlyPaymentOverview;

