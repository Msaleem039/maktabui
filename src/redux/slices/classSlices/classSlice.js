import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createClassAction = createAsyncThunk(
  `classes/createClass`,
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createClass`, formData);
      return res.data.class;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllClassesAction = createAsyncThunk(
  `classes/getAllClasses`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllClasses`);
      return res.data.classes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllClassesNameAction = createAsyncThunk(
  `classes/getAllClassesName`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllClassesName`);
      return res.data.classes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const createClassSlice = createSlice({
  name: "createClass",
  initialState: { loading: false, class: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createClassAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClassAction.fulfilled, (state, action) => {
        state.loading = false;
        state.class = action.payload;
      })
      .addCase(createClassAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllClassesSlice = createSlice({
  name: "getAllClasses",
  initialState: { loading: false, classes: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClassesAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClassesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getAllClassesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllClassesNameSlice = createSlice({
  name: "getAllClassesName",
  initialState: { loading: false, classNames: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClassesNameAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClassesNameAction.fulfilled, (state, action) => {
        state.loading = false;
        state.classNames = action.payload;
      })
      .addCase(getAllClassesNameAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const createClassReducer = createClassSlice.reducer;
export const getAllClassesReducer = getAllClassesSlice.reducer;
export const getAllClassesNameReducer = getAllClassesNameSlice.reducer;
