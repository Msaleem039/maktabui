import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getParentById = createAsyncThunk(
  "parent/getParentById",
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/parent/getParentById", { id: parentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const getParentByIdSlice = createSlice({
  name: "parentById",
  initialState: {
    parent: null, 
    status: "idle",
    error: null,
  },
  reducers: {
    resetParentState: (state) => {
      state.parent = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getParentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parent = action.payload.data; 
      })
      .addCase(getParentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetParentState } = getParentByIdSlice.actions;

export default getParentByIdSlice.reducer;
