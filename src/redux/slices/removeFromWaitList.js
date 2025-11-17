import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const removeFromWaitList = createAsyncThunk(
  'waitlist/remove',
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/parent/removeWaitlist', { id: parentId });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const removeFromWaitListSlice = createSlice({
  name: 'removeFromWaitList',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetRemoveWaitList: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeFromWaitList.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeFromWaitList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(removeFromWaitList.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

export const { resetRemoveWaitList } = removeFromWaitListSlice.actions;
export default removeFromWaitListSlice.reducer;