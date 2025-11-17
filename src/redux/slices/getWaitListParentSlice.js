import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllWaitListParents = createAsyncThunk(
    "parent/getAllWaitListParents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/parent/getAllWaitListParents");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const getAllWaitListParentsSlice = createSlice({
    name: "waitListParents",
    initialState: {
        parents: [],
        status: "idle",
        error: null,
    },
    reducers: {
        resetWaitListParentsState: (state) => {
            state.parents = [];
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllWaitListParents.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllWaitListParents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.parents = action.payload.data || [];
            })
            .addCase(getAllWaitListParents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { resetWaitListParentsState } = getAllWaitListParentsSlice.actions;

export default getAllWaitListParentsSlice.reducer;
