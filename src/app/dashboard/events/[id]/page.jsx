"use client";

import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import EventDetailCard from "@/components/dashboard/events/EventDetailCard";
import { getEventById } from "@/redux/slices/eventSlices/eventSlices";

export default function EventDetailPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const params = useParams();
    
    const eventId = params?.id;
    console.log("Event ID from URL:", eventId); // Debug log

    const {
        loading,
        currentEvent,
        error
    } = useSelector(state => state.events);

    useEffect(() => {
        console.log("useEffect triggered with eventId:", eventId); // Debug log
        if (eventId) {
            dispatch(getEventById(eventId));
        }
    }, [eventId, dispatch]);

    const eventData = useMemo(() => {
        // Check if currentEvent exists and has data
        if (!currentEvent || !currentEvent._id) {
            return null;
        }

        return {
            id: currentEvent._id,
            name: currentEvent.name || '',
            description: currentEvent.description || '',
            location: currentEvent.location || '',
            date: currentEvent.date || '',
            startTime: currentEvent.startTime || '',
            endTime: currentEvent.endTime || '',
            organizer: currentEvent.organizer || '',
            status: currentEvent.status || '',
            contactPhone: currentEvent.phone || ''
        };
    }, [currentEvent]); // Removed eventId dependency as it's not needed

    const handleEditEvent = () => {
        if (eventData?.id) {
            router.push(`/dashboard/events/${eventData.id}/edit`);
        }
    };

    // Show loading state
    if (loading) {
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
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-[#799086]">Loading event details...</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
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
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-600">Error: {error}</div>
                </div>
            </div>
        );
    }

    // Check if we have event data to display
    if (!loading && !eventData && !error) {
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
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-[#799086]">Event not found</div>
                </div>
            </div>
        );
    }

    // Only render the event data if we have it
    if (!eventData) {
        return null; // Or a loading/error state
    }

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

                <div className="flex gap-3">
                    <button
                        onClick={handleEditEvent}
                        className="px-4 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
                    >
                        Edit Event
                    </button>
                </div>
            </div>

            <EventDetailCard
                eventData={eventData}
                onEditEvent={handleEditEvent}
            />
        </div>
    );
}