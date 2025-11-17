import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllParents = createAsyncThunk(
  "parents/getAllParents",
  async (parentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/parent/getAllParents", parentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const getAllParentsSlice = createSlice({
  name: "allParents",
  initialState: {
    parents: null,
    pagination: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetParentsState: (state) => {
      state.parents = null;
      state.pagination = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllParents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllParents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetParentsState } = getAllParentsSlice.actions;

export default getAllParentsSlice.reducer;