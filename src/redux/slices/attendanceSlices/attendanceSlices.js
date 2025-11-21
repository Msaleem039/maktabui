import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/attendance/markAttendance", attendanceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  attendance: null,
  loading: false,
  error: null,
  success: false,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    resetAttendanceState: (state) => {
      state.attendance = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
        state.success = true;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
