import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDashboardStatsAction = createAsyncThunk(
  `dashboard/getStats`,
  async (year, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getDashboardStats`,
        { year },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getSuperAdminDetailAction = createAsyncThunk(
  "dashboard/getSuperAdminDetail",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getSuperAdminDetail`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateSuperAdminAction = createAsyncThunk(
  "dashboard/updateSuperAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateSuperAdmin`,
        data,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    stats: null,
    yearlyPayments: [],
    topPayingAdmins: [],
    topOutstandingAdmins: [],
    superAdminDetail: {
      loading: false,
      data: null,
      error: null,
    },
    superAdminUpdate: {
      loading: false,
      success: false,
      error: null,
      data: null,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStatsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStatsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.yearlyPayments = action.payload.yearlyPayments;
        state.topPayingAdmins = action.payload.topPayingAdmins;
        state.topOutstandingAdmins = action.payload.topOutstandingAdmins;
      })
      .addCase(getDashboardStatsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard stats";
      })

      .addCase(getSuperAdminDetailAction.pending, (state) => {
        state.superAdminDetail.loading = true;
        state.superAdminDetail.error = null;
      })
      .addCase(getSuperAdminDetailAction.fulfilled, (state, action) => {
        state.superAdminDetail.loading = false;
        state.superAdminDetail.data = action.payload.data;
      })
      .addCase(getSuperAdminDetailAction.rejected, (state, action) => {
        state.superAdminDetail.loading = false;
        state.superAdminDetail.error =
          action.payload || "Failed to fetch Super Admin details";
      })
      .addCase(updateSuperAdminAction.pending, (state) => {
        state.superAdminUpdate.loading = true;
        state.superAdminUpdate.success = false;
        state.superAdminUpdate.error = null;
      })
      .addCase(updateSuperAdminAction.fulfilled, (state, action) => {
        state.superAdminUpdate.loading = false;
        state.superAdminUpdate.success = true;
        state.superAdminUpdate.data = action.payload.data;
      })
      .addCase(updateSuperAdminAction.rejected, (state, action) => {
        state.superAdminUpdate.loading = false;
        state.superAdminUpdate.success = false;
        state.superAdminUpdate.error =
          action.payload || "Failed to update Super Admin";
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;