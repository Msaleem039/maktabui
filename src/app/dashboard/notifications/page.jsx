"use client";

import { useState } from "react";
import { Download, Search, Bell, Check, X } from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    title: "New Payment Received",
    message: "Payment of $150.00 has been received from Ahmed Ali's parent for invoice #6763",
    type: "payment",
    status: "unread",
    date: "November 14, 2025, 3:49 am",
    occurred: "2 hours ago",
  },
  {
    id: "2",
    title: "Invoice Created",
    message: "A new invoice #6764 has been created for student Fatima Hassan",
    type: "invoice",
    status: "unread",
    date: "November 14, 2025, 2:12 pm",
    occurred: "5 hours ago",
  },
  {
    id: "3",
    title: "Student Added",
    message: "New student Ahmed Ali has been added to Class 3A",
    type: "student",
    status: "read",
    date: "November 13, 2025, 1:02 pm",
    occurred: "1 day ago",
  },
  {
    id: "4",
    title: "Attendance Marked",
    message: "Attendance has been marked for Class 3A - 25 students present, 2 absent",
    type: "attendance",
    status: "read",
    date: "November 13, 2025, 10:30 am",
    occurred: "1 day ago",
  },
  {
    id: "5",
    title: "Payment Reminder Sent",
    message: "Payment reminder SMS has been sent to 15 parents for upcoming due date",
    type: "reminder",
    status: "read",
    date: "November 12, 2025, 4:15 pm",
    occurred: "2 days ago",
  },
  {
    id: "6",
    title: "Parent Added to Waitlist",
    message: "New parent Abdifatah Garad has been added to the waitlist",
    type: "parent",
    status: "read",
    date: "November 12, 2025, 11:20 am",
    occurred: "2 days ago",
  },
];

const notificationTypes = [
  { value: "", label: "All Types" },
  { value: "payment", label: "Payment" },
  { value: "invoice", label: "Invoice" },
  { value: "student", label: "Student" },
  { value: "attendance", label: "Attendance" },
  { value: "reminder", label: "Reminder" },
  { value: "parent", label: "Parent" },
];

const statusFilters = [
  { value: "", label: "All Status" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export default function NotificationsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, status: "read" } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, status: "read" }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      searchValue === "" ||
      notif.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchValue.toLowerCase());

    const matchesType = selectedType === "" || notif.type === selectedType;
    const matchesStatus = selectedStatus === "" || notif.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return "💰";
      case "invoice":
        return "📄";
      case "student":
        return "👤";
      case "attendance":
        return "✅";
      case "reminder":
        return "🔔";
      case "parent":
        return "👨‍👩‍👧";
      default:
        return "🔔";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
      </div>

      {/* Notification Summary */}
      <div className="rounded-[18px] bg-[#E5EFEB] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-[#0B4B31]" />
            <div>
              <p className="text-[1.5rem] font-semibold text-[#000000]">
                {unreadCount} Unread Notification{unreadCount !== 1 ? "s" : ""}
              </p>
              <p className="text-[0.8125rem] font-normal text-[#979699] mt-1">
                {notifications.length} Total Notifications
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[1.0625rem] font-semibold text-[#000000]">
            All Notifications
          </h2>
        </div>

        {/* Filters */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-[#0B4B31] px-4 py-2 bg-white flex-1 max-w-md">
              <Search size={16} className="text-[#979699] mr-2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search notifications..."
                className="w-full text-sm text-[#0B4B31] bg-white placeholder:text-[#979699] focus:outline-none"
              />
            </div>

            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">
                ▾
              </span>
            </div>

            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#0B4B31] bg-white py-3 pl-4 pr-10 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
              >
                {statusFilters.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-[#979699] mb-4" />
              <p className="text-[#979699] font-medium">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm p-4 transition-all ${
                  notification.status === "unread"
                    ? "bg-[#E5EFEB] border-[#0B4B31]"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B4B3138] flex items-center justify-center text-xl">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold text-[#000000] ${
                              notification.status === "unread"
                                ? "text-[1rem]"
                                : "text-sm"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {notification.status === "unread" && (
                            <span className="w-2 h-2 rounded-full bg-[#0B4B31]"></span>
                          )}
                        </div>
                        <p className="text-sm font-normal text-[#1e1e1e] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#979699]">
                          <span>{notification.date}</span>
                          <span>•</span>
                          <span>{notification.occurred}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {notification.status === "unread" && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 rounded-full hover:bg-[#0B4B3138] transition"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-[#0B4B31]" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 rounded-full hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <X size={16} className="text-[#979699] hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#979699]">
              Showing 1 to {filteredNotifications.length} of{" "}
              {filteredNotifications.length} entries
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8A928F]">Display 10</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                  ‹
                </button>
                <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-xs sm:text-sm font-semibold text-white">
                  1
                </button>
                <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                  2
                </button>
                <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                  3
                </button>
                <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
