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

export const deleteTimeTable = createAsyncThunk(
  `timetable/deleteTimeTable`,
  async (timetableId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteTimeTable`, { timetableId });
      return response.data;
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

const deleteTimeTableSlice = createSlice({
  name: 'deleteTimeTable',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetDeleteTimeTable: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearDeleteTimeTableError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTimeTable.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteTimeTable.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(deleteTimeTable.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const createTimetableReducer = createTimetableSlice.reducer;
export const getAllTimetablesReducer = getAllTimetablesSlice.reducer;
export const deleteTimeTableReducer = deleteTimeTableSlice.reducer;

export const timetableReducer = {
  createTimetable: createTimetableReducer,
  getAllTimetables: getAllTimetablesReducer,
  deleteTimeTable: deleteTimeTableReducer,
};
