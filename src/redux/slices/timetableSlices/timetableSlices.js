import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTimetableAction = createAsyncThunk(
  `timetables/createTimetable`,
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createTimeTable`, formData);
      return res.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllTimetablesAction = createAsyncThunk(
  `timetables/getAllTimetables`,
  async (requestData = {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllTimetables`,
        requestData
      );
      return res.data.timetables;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const createTimetableSlice = createSlice({
  name: "createTimetable",
  initialState: { loading: false, timetable: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTimetableAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTimetableAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
      })
      .addCase(createTimetableAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllTimetablesSlice = createSlice({
  name: "getAllTimetables",
  initialState: { loading: false, timetables: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTimetablesAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTimetablesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetables = action.payload;
      })
      .addCase(getAllTimetablesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const createTimetableReducer = createTimetableSlice.reducer;
export const getAllTimetablesReducer = getAllTimetablesSlice.reducer;
