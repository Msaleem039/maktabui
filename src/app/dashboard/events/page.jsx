"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Search, Eye, Edit, Trash2 } from "lucide-react";
import { getEvents, deleteEvent } from "@/redux/slices/eventSlices/eventSlices";
import ActionMenu from "@/components/dashboard/ActionMenu";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function SendEventPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { events, loading, error, pagination } = useSelector(state => state.events);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: ""
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    event: null,
    isLoading: false
  });

  useEffect(() => {
    dispatch(getEvents(filters));
  }, [dispatch, filters.page, filters.limit, filters.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleViewEvent = (event) => (e) => {
    e.stopPropagation();
    router.push(`/dashboard/events/${event._id}`);
  };

  const handleEditEvent = (event) => (e) => {
    e.stopPropagation();
    router.push(`/dashboard/events/${event._id}/edit`);
  };

  const handleRemoveEvent = (event) => (e) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      event: event,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.event) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      await dispatch(deleteEvent(deleteModal.event._id)).unwrap();
      
      setDeleteModal({ isOpen: false, event: null, isLoading: false });
      
      dispatch(getEvents(filters));
      
    } catch (error) {
      console.error("Failed to delete event:", error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({ isOpen: false, event: null, isLoading: false });
    }
  };

  const getActionMenuItems = (event) => [
    {
      label: "View",
      icon: Eye,
      onClick: handleViewEvent(event),
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: handleEditEvent(event),
    },
    {
      label: "Remove",
      icon: Trash2,
      onClick: handleRemoveEvent(event),
      className: "text-red-600 hover:text-red-700",
      iconClassName: "text-red-600",
    },
  ];

  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = pagination.pages || 1;
    const currentPage = filters.page;

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-normal transition ${currentPage === i
              ? "bg-[#0B4B31] text-white"
              : "border border-[#C5D2CD] bg-white text-[#0B4B31] hover:bg-[#F3F6F5]"
              }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={i} className="px-2 text-[#0B4B31]">
            ...
          </span>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>
    );

    return buttons;
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </h1>
          <p className="text-[1.75rem] font-medium text-[#000000]">
            MaktabOS
          </p>
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[1.125rem] font-semibold text-[#0B4B31]">
              Send Event
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 min-w-[220px] shadow-sm max-w-lg">
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#0B4B31] hover:bg-[#F2F7F5]">
              See All ↗
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center py-8">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31]"></div>
                <span className="ml-3 text-[#0B4B31]">Loading events...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Events Table */}
          {!loading && !error && (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
                <thead className="text-xs font-normal uppercase tracking-wide text-[#979699]">
                  <tr>
                    <th className="px-4 py-2 font-normal text-[#0000008C]">Title</th>
                    <th className="px-4 py-2 font-normal text-[#0000008C]">Location</th>
                    <th className="px-4 py-2 font-normal text-[#0000008C]">Date & Time</th>
                    <th className="px-4 py-2 font-normal text-[#0000008C]">Organizer</th>
                    <th className="px-4 py-2 font-normal text-[#0000008C] text-right">Status</th>
                    <th className="px-4 py-2 font-normal text-[#0000008C] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <tr
                        key={event._id}
                        className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm align-top"
                      >
                        <td className="px-4 py-3 text-[#0B4B31] font-medium whitespace-nowrap">
                          {event.name}
                        </td>
                        <td className="px-4 py-3 font-normal text-[#1e1e1e] max-w-xs">
                          {event.location}
                        </td>
                        <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                          {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                        </td>
                        <td className="px-4 py-3 font-normal text-[#1e1e1e] whitespace-nowrap">
                          {event.organizer}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-normal ${event.status === "Upcoming"
                            ? "bg-[#0B4B31] text-white"
                            : event.status === "Ongoing"
                              ? "bg-[#F59E0B] text-white"
                              : event.status === "Completed"
                                ? "bg-[#6B7280] text-white"
                                : "bg-[#EF4444] text-white"
                            }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ActionMenu
                            triggerLabel="Actions"
                            items={getActionMenuItems(event)}
                            align="right"
                            triggerClassName="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-3 py-1 text-xs font-medium text-[#0B4B31] transition hover:bg-[#F3F6F5]"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-[#979699]">
                        No events found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && events && events.length > 0 && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[#979699]">
                Showing {events.length} out of {pagination.total || 0} entries
              </div>

              <div className="flex items-center gap-3 text-sm text-[#979699]">
                <span>Display</span>
                <select
                  value={filters.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="rounded-full border border-[#0B4B31] bg-white px-2 py-1 text-[#0B4B31] focus:outline-none"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>

                <div className="flex items-center gap-2">
                  {renderPaginationButtons()}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        itemName={deleteModal.event?.name}
        itemType="event"
        description={`Are you sure you want to delete the event "${deleteModal.event?.name}"?`}
        warningText="This action cannot be undone. All event data will be permanently removed from the system."
        confirmButtonText="Delete Event"
        cancelButtonText="Cancel"
        variant="danger"
        isLoading={deleteModal.isLoading}
        size="md"
      />
    </>
  );
}