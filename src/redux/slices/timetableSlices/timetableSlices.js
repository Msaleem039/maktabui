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

export const getTimetableByIdAction = createAsyncThunk(
  `timetables/getTimetableById`,
  async (timetableId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTimetableById/`,{timetableId}
      );
      return res.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTimetableByIdAction = createAsyncThunk(
  `timetables/updateTimetableById`,
  async ({ timetableId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTimetableById`,{formData,timetableId}
      );
      return res.data.timetable;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const createTimetableSlice = createSlice({
  name: "createTimetable",
  initialState: { loading: false, timetable: null, error: null },
  reducers: {
    clearCreateTimetableError: (state) => {
      state.error = null;
    },
    resetCreateTimetable: (state) => {
      state.loading = false;
      state.timetable = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTimetableAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTimetableAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
        state.error = null;
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
  reducers: {
    clearAllTimetablesError: (state) => {
      state.error = null;
    },
    resetAllTimetables: (state) => {
      state.loading = false;
      state.timetables = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTimetablesAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTimetablesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetables = action.payload;
        state.error = null;
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

const getTimetableByIdSlice = createSlice({
  name: "getTimetableById",
  initialState: { 
    loading: false, 
    timetable: null, 
    error: null 
  },
  reducers: {
    clearTimetableByIdError: (state) => {
      state.error = null;
    },
    resetTimetableById: (state) => {
      state.loading = false;
      state.timetable = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimetableByIdAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTimetableByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
        state.error = null;
      })
      .addCase(getTimetableByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const updateTimetableByIdSlice = createSlice({
  name: "updateTimetableById",
  initialState: { 
    loading: false, 
    timetable: null, 
    error: null,
    success: false
  },
  reducers: {
    clearUpdateTimetableError: (state) => {
      state.error = null;
    },
    resetUpdateTimetable: (state) => {
      state.loading = false;
      state.timetable = null;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTimetableByIdAction.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateTimetableByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateTimetableByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const createTimetableReducer = createTimetableSlice.reducer;
export const getAllTimetablesReducer = getAllTimetablesSlice.reducer;
export const deleteTimeTableReducer = deleteTimeTableSlice.reducer;
export const getTimetableByIdReducer = getTimetableByIdSlice.reducer;
export const updateTimetableByIdReducer = updateTimetableByIdSlice.reducer;

// Export actions
export const { 
  clearCreateTimetableError, 
  resetCreateTimetable 
} = createTimetableSlice.actions;

export const { 
  clearAllTimetablesError, 
  resetAllTimetables 
} = getAllTimetablesSlice.actions;

export const { 
  resetDeleteTimeTable, 
  clearDeleteTimeTableError 
} = deleteTimeTableSlice.actions;

export const { 
  clearTimetableByIdError, 
  resetTimetableById 
} = getTimetableByIdSlice.actions;

export const { 
  clearUpdateTimetableError, 
  resetUpdateTimetable 
} = updateTimetableByIdSlice.actions;

export const timetableReducer = {
  createTimetable: createTimetableReducer,
  getAllTimetables: getAllTimetablesReducer,
  deleteTimeTable: deleteTimeTableReducer,
  getTimetableById: getTimetableByIdReducer,
  updateTimetableById: updateTimetableByIdReducer,
};