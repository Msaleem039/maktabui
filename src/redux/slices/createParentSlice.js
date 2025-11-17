import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createParent = createAsyncThunk(
  "parent/createParent",
  async (parentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/parent/createParent", parentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const parentSlice = createSlice({
  name: "parent",
  initialState: {
    parent: null,
    student: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetParentState: (state) => {
      state.parent = null;
      state.student = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createParent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createParent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parent = action.payload.parent;
        state.student = action.payload.student;
      })
      .addCase(createParent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetParentState } = parentSlice.actions;

export default parentSlice.reducer;
