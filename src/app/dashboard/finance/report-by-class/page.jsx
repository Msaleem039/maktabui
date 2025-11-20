"use client";

export default function ReportByClassPage() {
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

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E]">Report By Class</h2>
        <p className="mt-4 text-sm text-gray-600">Finance reports by class will be displayed here.</p>
      </section>
    </div>
  );
}

