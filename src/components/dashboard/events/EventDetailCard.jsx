"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, User, Phone, Mail } from "lucide-react";

const EventDetailCard = ({ eventData, onEditEvent }) => {
    console.log("eventData",eventData)
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.values(dropdownRefs.current).forEach((ref) => {
                if (ref && !ref.contains(event.target)) {
                    setOpenDropdownId(null);
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Upcoming":
                return "bg-[#0B4B31] text-white";
            case "Ongoing":
                return "bg-[#F59E0B] text-white";
            case "Completed":
                return "bg-[#6B7280] text-white";
            case "Cancelled":
                return "bg-[#EF4444] text-white";
            default:
                return "bg-[#6B7280] text-white";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="rounded-[28px] border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
            {/* Header with event image */}
            <div className="relative h-[300px] bg-gradient-to-br from-[#0B4B31] to-[#1C6A45] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white/30"></div>
                    <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/20"></div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-20">
                    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-normal ${getStatusColor(eventData.status)}`}>
                        {eventData.status}
                    </span>
                </div>

                {/* Event Title */}
                <div className="absolute bottom-6 left-6 z-20">
                    <h2 className="text-3xl font-semibold text-white mb-2">{eventData.name}</h2>
                    <p className="text-white/80 text-lg">{eventData.category}</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-8 pb-8 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-semibold text-[#0B4B31] mb-3">About this Event</h3>
                            <p className="text-[#627169] leading-relaxed">{eventData.description}</p>
                        </div>

                        {/* Event Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#F8FAF9] border border-[#E2E7E4]">
                                <Calendar className="text-[#0B4B31]" size={20} />
                                <div>
                                    <p className="text-sm text-[#627169]">Date</p>
                                    <p className="font-semibold text-[#0B4B31]">{formatDate(eventData.date)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#F8FAF9] border border-[#E2E7E4]">
                                <Clock className="text-[#0B4B31]" size={20} />
                                <div>
                                    <p className="text-sm text-[#627169]">Time</p>
                                    <p className="font-semibold text-[#0B4B31]">{eventData.startTime} - {eventData.endTime}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#F8FAF9] border border-[#E2E7E4]">
                                <MapPin className="text-[#0B4B31]" size={20} />
                                <div>
                                    <p className="text-sm text-[#627169]">Location</p>
                                    <p className="font-semibold text-[#0B4B31]">{eventData.location}</p>
                                </div>
                            </div>

                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-[#0B4B31] mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#F8FAF9] border border-[#E2E7E4]">
                                    <User className="text-[#0B4B31]" size={20} />
                                    <div>
                                        <p className="text-sm text-[#627169]">Organizer</p>
                                        <p className="font-semibold text-[#0B4B31]">{eventData.organizer}</p>
                                    </div>
                                </div>

                                {eventData.contactPhone && (
                                    <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#F8FAF9] border border-[#E2E7E4]">
                                        <Phone className="text-[#0B4B31]" size={20} />
                                        <div>
                                            <p className="text-sm text-[#627169]">Phone</p>
                                            <p className="font-semibold text-[#0B4B31]">{eventData.contactPhone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Quick Actions & Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="rounded-[18px] border border-[#E2E7E4] bg-[#FBFDFB] p-6">
                            <h3 className="text-lg font-semibold text-[#0B4B31] mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={onEditEvent}
                                    className="w-full px-4 py-3 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors text-center font-medium"
                                >
                                    Edit Event
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailCard;