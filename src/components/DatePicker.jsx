"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar, Clock } from "lucide-react";
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
  showLabel = true,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 30,
  timeFormat = "HH:mm",
  timeCaption = "Time",
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
    
    // If time-only mode, format time as HH:mm
    let finalValue = isoDate;
    if (date && showTimeSelectOnly) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      finalValue = `${hours}:${minutes}`;
    }
    
    // Trigger onChange with the same format as other form inputs
    onChange({
      target: {
        name: name,
        value: finalValue,
        dateValue: isoDate, // Store full date-time for date+time mode
      },
    });
  };

  // Update selectedDate when value prop changes (e.g., form reset)
  useEffect(() => {
    if (!value || value === "") {
      setSelectedDate(null);
    } else {
      try {
        let date;
        // If time-only mode and value is in HH:mm format, create date with today's date
        if (showTimeSelectOnly && typeof value === "string" && value.match(/^\d{2}:\d{2}$/)) {
          const [hours, minutes] = value.split(":");
          date = new Date();
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));
          date.setSeconds(0);
          date.setMilliseconds(0);
        } else {
          date = new Date(value);
        }
        setSelectedDate(isNaN(date.getTime()) ? null : date);
      } catch {
        setSelectedDate(null);
      }
    }
  }, [value, showTimeSelectOnly]);

  return (
    <div className={className}>
      {showLabel && label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
      )}
      <div className="relative w-full" data-datepicker-name={name}>
        <ReactDatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText={placeholder}
          className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B4B31]/10 transition-all duration-200 shadow-sm hover:shadow-md"
          wrapperClassName="w-full"
          maxDate={maxDate}
          minDate={minDate}
          showYearDropdown={showYearDropdown}
          showMonthDropdown={showMonthDropdown}
          dropdownMode={dropdownMode}
          dateFormat={showTimeSelectOnly ? "hh:mm aa" : (showTimeSelect ? "MM/dd/yyyy hh:mm aa" : dateFormat)}
          isClearable
          popperPlacement="top-start"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          showTimeSelect={showTimeSelect || showTimeSelectOnly}
          showTimeSelectOnly={showTimeSelectOnly}
          timeIntervals={timeIntervals}
          timeFormat={timeFormat}
          timeCaption={timeCaption}
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
          {showTimeSelectOnly || name === "time" ? <Clock size={18} /> : <Calendar size={18} />}
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;

