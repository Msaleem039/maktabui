"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Check, X } from "lucide-react";
import { getCookie } from "cookies-next";
import { useTheme } from "@/hooks/useTheme";
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  fetchNotificationStats 
} from "@/redux/slices/notificationSlices/notificationSlices";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { mainText } = useTheme();
  const { 
    notifications, 
    loading, 
    error, 
    total, 
    totalPages,
    stats,
    markAllLoading 
  } = useSelector((state) => state.notifications);
  
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  useEffect(() => {
    if (!user?.id || !user?.role) {
      console.warn("User data not available", user);
      return;
    }

    dispatch(
      fetchNotifications({
        userId: user.id,
        userType: user.role,
        page,
        limit,
        unreadOnly: selectedStatus === "unread",
      })
    );

    dispatch(
      fetchNotificationStats({
        userId: user.id,
        userType: user.role,
      })
    );
  }, [dispatch, user, page, limit, selectedStatus]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    if (user?.id && user?.role) {
      dispatch(markAllNotificationsRead({
        userId: user.id,
        userType: user.role
      }));
    }
  };

  const unreadCount = stats.unreadCount;
  const totalCount = stats.totalCount;

  const mappedNotifications = useMemo(() => {
    return notifications.map(notif => ({
      id: notif._id,
      _id: notif._id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      status: notif.isRead ? 'read' : 'unread',
      isRead: notif.isRead,
      createdAt: notif.createdAt,
      date: notif.createdAt,
      occurred: notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : '',
      actionUrl: notif.actionUrl,
      priority: notif.priority,
      relatedEntity: notif.relatedEntity
    }));
  }, [notifications]);

  const filteredNotifications = mappedNotifications.filter((notif) => {
    const matchesSearch =
      searchValue === "" ||
      notif.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      notif.message?.toLowerCase().includes(searchValue.toLowerCase());

    const matchesType = selectedType === "" || notif.type === selectedType;
    
    const matchesStatus = selectedStatus === "" || 
      (selectedStatus === "unread" && !notif.isRead) ||
      (selectedStatus === "read" && notif.isRead);

    return matchesSearch && matchesType && matchesStatus;
  });

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
      case "event":
        return "📅";
      default:
        return "🔔";
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  if (loading && mappedNotifications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[18px] bg-red-50 px-6 py-4">
        <p className="text-red-700">Error loading notifications: {error}</p>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="rounded-[18px] bg-yellow-50 px-6 py-4">
        <p className="text-yellow-700">User information not available. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[#0B4B31] text-[1.75rem]">
            {mainText || "MaktabOS"}
          </h1>
        </div>

        {user && (
          <div className="text-sm text-[#979699]">
            Logged in as: <span className="text-[#0B4B31] font-medium">{user.name || user.email}</span>
          </div>
        )}
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
                {totalCount} Total Notifications
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
              disabled={markAllLoading}
            >
              {markAllLoading ? "Processing..." : "Mark All as Read"}
            </button>
          )}
        </div>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-4 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[1.0625rem] font-semibold text-[#000000]">
            All Notifications
          </h2>
          <div className="text-sm text-[#979699]">
            Page {page} of {totalPages}
          </div>
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
          </div>
        </div>

        {/* Loading state for subsequent loads */}
        {loading && mappedNotifications.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B4B31]"></div>
          </div>
        )}

        {/* Notifications List */}
        <div className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-[#979699] mb-4" />
              <p className="text-[#979699] font-medium">
                {mappedNotifications.length === 0 ? "No notifications yet" : "No notifications match your filters"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm p-4 transition-all ${!notification.isRead
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
                            className={`font-semibold text-[#000000] ${!notification.isRead
                              ? "text-[1rem]"
                              : "text-sm"
                              }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#0B4B31]"></span>
                          )}
                        </div>
                        <p className="text-sm font-normal text-[#1e1e1e] mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#979699]">
                          <span>
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleString()
                              : notification.date || 'No date'
                            }
                          </span>
                          {notification.occurred && (
                            <>
                              <span>•</span>
                              <span>{notification.occurred}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id || notification.id)}
                            className="p-2 rounded-full hover:bg-[#0B4B3138] transition"
                            title="Mark as read"
                            disabled={loading}
                          >
                            <Check size={16} className="text-[#0B4B31]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#979699]">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
              {total} entries
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8A928F]">Display {limit}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-full border border-[#0B4B3138] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${page === pageNum
                        ? "bg-[#0B4B31] text-white"
                        : "border border-[#C5D2CD] bg-white text-[#0B4B31] hover:bg-[#F3F6F5]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 3 && (
                  <>
                    <span className="text-[#0B4B31]">...</span>
                    <button
                      onClick={() => handlePageClick(totalPages)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${page === totalPages
                        ? "bg-[#0B4B31] text-white"
                        : "border border-[#C5D2CD] bg-white text-[#0B4B31] hover:bg-[#F3F6F5]"
                        }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-xs sm:text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
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