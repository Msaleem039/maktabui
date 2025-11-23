import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDashboardStatsAction = createAsyncThunk(
  `dashboard/getStats`,
  async (year, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getDashboardStats`, { year });
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
