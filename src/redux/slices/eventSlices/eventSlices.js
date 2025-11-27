import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createEvent`, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create event');
        }
    }
);

export const getEvents = createAsyncThunk(
    'events/getEvents',
    async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getEvents`, {
                page,
                limit,
                search
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
        }
    }
);

export const getEventById = createAsyncThunk(
    'events/getEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getEventById`, { id });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
        }
    }
);

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateEvent`, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update event');
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteEvent`, {
                id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
        }
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        currentEvent: null,
        loading: false,
        error: null,
        success: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        }
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearCurrentEvent: (state) => {
            state.currentEvent = null;
        },
        resetEvents: (state) => {
            state.events = [];
            state.currentEvent = null;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.pagination = {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.events.unshift(action.payload.data);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Get Events
            .addCase(getEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    pages: action.payload.pages
                };
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.events = [];
            })
            // Get Event By ID
            .addCase(getEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload.data;
            })
            .addCase(getEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentEvent = null;
            })
            // Update Event
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentEvent = action.payload.data;
                // Update event in events list
                const index = state.events.findIndex(event => event._id === action.payload.data._id);
                if (index !== -1) {
                    state.events[index] = action.payload.data;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Delete Event
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.events = state.events.filter(event => event._id !== action.meta.arg);
                state.currentEvent = null;
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearError, clearSuccess, clearCurrentEvent, resetEvents } = eventSlice.actions;
export default eventSlice.reducer;