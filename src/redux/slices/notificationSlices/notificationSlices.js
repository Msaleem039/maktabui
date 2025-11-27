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


const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

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
    });

    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


    builder.addCase(markNotificationRead.fulfilled, (state, action) => {
      const updated = action.payload;

      state.notifications = state.notifications.map((n) =>
        n._id === updated._id ? updated : n
      );
    });

    builder.addCase(markNotificationRead.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default notificationsSlice.reducer;
