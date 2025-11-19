"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarWidget = ({ selectedDate, onDateChange }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(newDate);
  };

  const handleDateClick = (day) => {
    if (day !== null) {
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      setViewDate(newDate);
      onDateChange(newDate);
    }
  };

  const isSelected = (day) => {
    if (!selectedDate || day === null) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear()
    );
  };

  const days = getDaysInMonth(viewDate);

  return (
    <div className="rounded-[18px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="text-[#0B4B31] hover:text-[#0B4B31]/70 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold text-[#0B4B31]">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="text-[#0B4B31] hover:text-[#0B4B31]/70 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-[#627169] py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            disabled={day === null}
            className={`
              aspect-square flex items-center justify-center text-sm font-medium rounded-full transition
              ${day === null ? "cursor-default" : "cursor-pointer hover:bg-[#E5EFEB]"}
              ${isSelected(day) ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"}
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState({});
  const [reasons, setReasons] = useState({});
  const datePickerRef = useRef(null);

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `student-${index + 1}`,
    name: "Abdifatah Soyan",
    studentId: index === 3 ? "13628" : "13627",
    status: index === 9 ? "Absent" : "Present",
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (studentId, status) => {
    setStatusDropdowns((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleReasonChange = (studentId, reason) => {
    setReasons((prev) => ({ ...prev, [studentId]: reason }));
  };

  const formatDate = (date) => {
    if (!date) return "Select the Date";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Initialize with current date if no date selected
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#104D2E]">Attendance</h2>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                >
                  <Download size={16} className="text-white" />
                  Export Data
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Date and Class Selection */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1" ref={datePickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] flex items-center justify-between"
                  >
                    <span>{selectedDate ? formatDate(selectedDate) : "Select the Date"}</span>
                    <span className="text-[#0B4B31]">▾</span>
                  </button>
                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-2 z-50 shadow-lg">
                      <CalendarWidget
                        selectedDate={selectedDate}
                        onDateChange={(date) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="relative flex-1">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full appearance-none rounded-full border border-[#C5D2CD] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                  >
                    <option value="">Select the class</option>
                    <option value="class-1">Mohamed Karie Class</option>
                    <option value="class-2">Class 2</option>
                    <option value="class-3">Class 3</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">▾</span>
                </div>

                <button
                  type="button"
                  className="rounded-full border-2 border-white bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 whitespace-nowrap"
                >
                  Manage
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
                >
                  See All ↗
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
                <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
                  <tr>
                    <th className="px-4">Name</th>
                    <th className="px-4">ID</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((student) => {
                    const currentStatus = statusDropdowns[student.id] || student.status;
                    const isAbsent = currentStatus === "Absent";
                    return (
                      <tr
                        key={student.id}
                        className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>👤</span>
                            <span className="font-medium text-[#0B4B31]">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#555]">{student.studentId}</td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(student.id, e.target.value)}
                              className={`
                                appearance-none rounded-full px-4 py-2 text-xs font-semibold text-white transition
                                ${isAbsent ? "bg-red-500" : "bg-[#0B4B31]"}
                                pr-8 cursor-pointer outline-none
                              `}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Late">Late</option>
                            </select>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs">▾</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={reasons[student.id] || ""}
                            onChange={(e) => handleReasonChange(student.id, e.target.value)}
                            placeholder="Reason"
                            className="w-full rounded-full border border-[#C5D2CD] bg-white py-2 px-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] w-fit"
                >
                  Save All Changes
                </button>
                <div className="text-sm text-[#8A928F]">Showing 1 to 10 of 50 entries</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#8A928F]">Display 10</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled
                    className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
                    1
                  </button>
                  <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    2
                  </button>
                  <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    3
                  </button>
                  <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    4
                  </button>
                  <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}

