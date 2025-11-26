"use client";

import React from "react";

const audienceOptions = {
  classes: ["Abdual Qari", "Level 2", "Hifdh 101"],
  grades: ["Grade A", "Grade B", "Grade C"],
};

export default function CreateEventPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[2.5rem] font-semibold text-[#0B4B31]">
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000]">
          MaktabOS
        </p>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-sm sm:px-10 sm:py-10">
        <header className="mb-8">
          <h2 className="text-[1.25rem] font-semibold text-[#0B4B31]">
            Create New Event
          </h2>
        </header>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Event Name</label>
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Location</label>
              <input
                type="text"
                placeholder="Phone"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Parent Name</label>
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Optional Notes</label>
              <input
                type="text"
                placeholder="Notes"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Date*</label>
              <input
                type="text"
                placeholder="10-9-2025"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <p className="text-xs text-[#5E6C64]">Format: MM-DD-YYYY (e.g., 05-15-2025)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Organizer Contact info</label>
              <input
                type="text"
                placeholder="Phone number"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B4B31]">Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#0B4B31]">Audience Selection</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-[#5E6C64]">Class</label>
                <select className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40">
                  <option>Select</option>
                  {audienceOptions.classes.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-[#5E6C64]">Grade</label>
                <select className="w-full rounded-full bg-[#5F856F] px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40">
                  <option>Select</option>
                  {audienceOptions.grades.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#0B4B31] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3f27]"
            >
              Create &amp; Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

