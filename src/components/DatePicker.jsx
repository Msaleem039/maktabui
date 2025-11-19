"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  className = "",
  maxDate = null,
  minDate = null,
  showYearDropdown = true,
  showMonthDropdown = true,
  dropdownMode = "select",
  dateFormat = "MM/dd/yyyy",
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    if (!value || value === "") return null;
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  });
  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Convert date to ISO string for form submission
    const isoDate = date ? date.toISOString() : "";
    
    // Trigger onChange with the same format as other form inputs
    onChange({
      target: {
        name: name,
        value: isoDate,
      },
    });
  };

  // Update selectedDate when value prop changes (e.g., form reset)
  useEffect(() => {
    if (!value || value === "") {
      setSelectedDate(null);
    } else {
      try {
        const date = new Date(value);
        setSelectedDate(isNaN(date.getTime()) ? null : date);
      } catch {
        setSelectedDate(null);
      }
    }
  }, [value]);

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative w-full" data-datepicker-name={name}>
        <ReactDatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText={placeholder}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
          wrapperClassName="w-full"
          maxDate={maxDate}
          minDate={minDate}
          showYearDropdown={showYearDropdown}
          showMonthDropdown={showMonthDropdown}
          dropdownMode={dropdownMode}
          dateFormat={dateFormat}
          isClearable
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const wrapper = e.currentTarget.closest('[data-datepicker-name]');
            if (wrapper) {
              const input = wrapper.querySelector('input');
              if (input) {
                input.focus();
                input.click();
              }
            }
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]/60 hover:text-[#0B4B31] cursor-pointer pointer-events-auto z-10 bg-transparent border-none p-0"
          tabIndex={-1}
        >
          <Calendar size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;

