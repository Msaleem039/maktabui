"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getEventById, updateEvent, clearError, clearSuccess } from "@/redux/slices/eventSlices/eventSlices";
import { FormInput } from "@/components/FormInput";

export default function EditEventPage({ params }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const eventId = params?.id;

    const { loading, error, success, currentEvent } = useSelector(state => state.events);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        organizer: "",
        phone: "",
        description: "",
        status: "Upcoming"
    });

    useEffect(() => {
        if (eventId) {
            dispatch(getEventById(eventId));
        }
    }, [eventId, dispatch]);

    useEffect(() => {
        if (currentEvent) {
            setFormData({
                name: currentEvent.name || "",
                location: currentEvent.location || "",
                date: currentEvent.date ? new Date(currentEvent.date).toISOString().split('T')[0] : "",
                startTime: currentEvent.startTime || "",
                endTime: currentEvent.endTime || "",
                organizer: currentEvent.organizer || "",
                phone: currentEvent.contactPhone || "",
                description: currentEvent.description || "",
                status: currentEvent.status || "Upcoming"
            });
        }
    }, [currentEvent]);

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
            id: eventId,
            name: formData.name,
            location: formData.location,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            organizer: formData.organizer,
            contactPhone: formData.phone,
            description: formData.description,
            status: formData.status
        };

        dispatch(updateEvent(eventData));
    };

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSuccess());
        };
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                router.push(`/dashboard/events/${eventId}`);
            }, 1500);
        }
    }, [success, router, eventId]);

    if (loading && !currentEvent) {
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
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-[#799086]">Loading event data...</div>
                </div>
            </div>
        );
    }

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
                        Edit Event
                    </h2>
                    {currentEvent && (
                        <p className="text-sm text-[#5E6C64] mt-1">
                            Editing: {currentEvent.name}
                        </p>
                    )}
                </header>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
                        <p className="text-green-700 text-sm font-medium">
                            Event updated successfully! Redirecting...
                        </p>
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
                            label="Organizer Contact Info"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required={true}
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

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#0B4B31] mb-2">
                                Status *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

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

                        <div className="md:col-span-2">
                            <FormInput
                                label="Event Description"
                                name="description"
                                type="textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter event description and details..."
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-full bg-[#0B4B31] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3f27] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Event"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push(`/dashboard/events/${eventId}`)}
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-full border border-[#0B4B31] bg-white px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}