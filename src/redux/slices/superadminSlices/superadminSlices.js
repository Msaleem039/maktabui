import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Pass 'year' as an argument
export const getDashboardStatsAction = createAsyncThunk(
  "dashboard/getStats",
  async (year, { rejectWithValue }) => {
    try {
      // POST request with year in the body
      const res = await axios.post("/api/super-admin/getDashboardStats", { year });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    stats: null,
    yearlyPayments: [],
    topPayingParents: [],
    topOutstandingParents: [],
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
        state.topPayingParents = action.payload.topPayingParents;
        state.topOutstandingParents = action.payload.topOutstandingParents;
      })
      .addCase(getDashboardStatsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard stats";
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
