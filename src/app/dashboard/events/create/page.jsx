"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, clearError, clearSuccess } from "@/redux/slices/eventSlices/eventSlices";
import { FormInput } from "@/components/FormInput";
import { useTheme } from "@/hooks/useTheme";

export default function CreateEventPage() {
  const dispatch = useDispatch();
  const { mainText, themeColor } = useTheme();
  const { loading, error, success } = useSelector(state => state.events);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    organizer: "",
    phone: "",
    description: "",
    audienceClass: "",
    audienceGrade: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      name: formData.name,
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      organizer: formData.organizer,
      phone: formData.phone,
      description: formData.description
    };

    dispatch(createEvent(eventData));
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        organizer: "",
        phone: "",
        description: "",
        audienceClass: "",
        audienceGrade: ""
      });
    }
  }, [success]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[2.5rem] font-semibold" style={{ color: themeColor }}>
          Welcome to
        </h1>
        <p className="text-[1.75rem] font-medium text-[#000000]">
          {mainText || "MaktabOS"}
        </p>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-sm sm:px-10 sm:py-10">
        <header className="mb-8">
          <h2 className="text-[1.25rem] font-semibold text-[#0B4B31]">
            Create New Event
          </h2>
        </header>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-green-700 text-sm font-medium">Event created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Event Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required={true}
            />

            <FormInput
              label="Location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required={true}
            />

            <FormInput
              label="Organizer Name"
              name="organizer"
              type="text"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Enter organizer name"
              required={true}
            />

            <FormInput
              label="Optional Notes"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter optional notes"
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0B4B31] mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
              />
              <p className="text-xs text-[#5E6C64] mt-1">Format: YYYY-MM-DD</p>
            </div>

            <FormInput
              label="Organizer Contact Info"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required={true}
            />

            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              placeholder="HH:MM"
              required={true}
            />

            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              placeholder="HH:MM"
              required={true}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[#0B4B31] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3f27] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create & Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}