import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ userId, userType, page = 1, limit = 20, unreadOnly = false }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUserNotifications`, {
        userId,
        userType,
        page,
        limit,
        unreadOnly,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markAsRead`, { notificationId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async ({ userId, userType }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markAllAsRead`, { 
        userId, 
        userType 
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  "notifications/fetchNotificationStats",
  async ({ userId, userType }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getNotificationStats`, {
        userId,
        userType,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    loading: false,
    error: null,
    stats: {
      unreadCount: 0,
      totalCount: 0,
    },
    markAllLoading: false,
  },

  reducers: {
    // Optional: Add a reducer to clear notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.totalPages = 1;
      state.currentPage = 1;
      state.total = 0;
      state.stats.unreadCount = 0;
      state.stats.totalCount = 0;
    },
  },

  extraReducers: (builder) => {
    // Fetch Notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload.notifications;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.total = action.payload.total;
      
      // Update stats based on the fetched notifications
      state.stats.unreadCount = action.payload.notifications.filter(n => !n.isRead).length;
      state.stats.totalCount = action.payload.total;
    });

    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Mark Single Notification as Read
    builder.addCase(markNotificationRead.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(markNotificationRead.fulfilled, (state, action) => {
      state.loading = false;
      const updatedNotification = action.payload;
      
      // Update the specific notification in the list
      state.notifications = state.notifications.map((notification) =>
        notification._id === updatedNotification._id ? updatedNotification : notification
      );
      
      // Update stats
      state.stats.unreadCount = Math.max(0, state.stats.unreadCount - 1);
    });

    builder.addCase(markNotificationRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Mark All Notifications as Read
    builder.addCase(markAllNotificationsRead.pending, (state) => {
      state.markAllLoading = true;
    });

    builder.addCase(markAllNotificationsRead.fulfilled, (state, action) => {
      state.markAllLoading = false;
      
      // Mark all notifications as read in the current list
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true,
        status: 'read'
      }));
      
      // Update stats
      state.stats.unreadCount = 0;
    });

    builder.addCase(markAllNotificationsRead.rejected, (state, action) => {
      state.markAllLoading = false;
      state.error = action.payload;
    });

    // Fetch Notification Stats
    builder.addCase(fetchNotificationStats.fulfilled, (state, action) => {
      state.stats.unreadCount = action.payload.unreadCount;
      state.stats.totalCount = action.payload.totalCount;
    });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;