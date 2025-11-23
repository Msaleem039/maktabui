import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllInvoicesAction = createAsyncThunk(
    `invoices/getAllInvoices`,
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllInvoices`);
            return res.data.invoices;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getInvoicesStatsAction = createAsyncThunk(
    `invoices/getInvoicesStats`,
    async (filters = {}, { rejectWithValue }) => {
        try {
            const payload = {
                page: filters.page || 1,
                limit: filters.limit || 10,
                search: filters.search || "",
                fromDate: filters.fromDate || "",
                toDate: filters.toDate || "",
                status: filters.status || "",
                date: filters.date || "",
                filterBy: filters.filterBy || "",
                unpaidPage: filters.unpaidPage || 1,
                unpaidLimit: filters.unpaidLimit || 10,
                unpaidSearch: filters.unpaidSearch || "",
                unpaidStatus: filters.unpaidStatus || ""
            };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getInvoicesStats`, payload);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createInvoiceAction = createAsyncThunk(
    `invoices/createInvoice`,
    async (invoiceData, { rejectWithValue }) => {
        console.log(`invoiceData`, invoiceData);
        
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createInvoice`, invoiceData);
            return res.data.invoice; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const createInvoiceSlice = createSlice({
    name: "createInvoice",
    initialState: {
        loading: false,
        invoice: null,
        success: false,
        error: null,
    },
    reducers: {
        resetCreateInvoiceState: (state) => {
            state.loading = false;
            state.invoice = null;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInvoiceAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInvoiceAction.fulfilled, (state, action) => {
                state.loading = false;
                state.invoice = action.payload;
                state.success = true;
            })
            .addCase(createInvoiceAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

const getAllInvoicesSlice = createSlice({
    name: "getAllInvoices",
    initialState: { loading: false, invoices: [], error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllInvoicesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllInvoicesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload;
            })
            .addCase(getAllInvoicesAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const getInvoicesStatsSlice = createSlice({
    name: "getInvoicesStats",
    initialState: {
        loading: false,
        stats: null,
        invoices: [],
        unpaidInvoices: [],
        pagination: null,
        unpaidPagination: null,
        error: null
    },
    reducers: {
        resetInvoiceStats: (state) => {
            state.loading = false;
            state.stats = null;
            state.invoices = [];
            state.unpaidInvoices = [];
            state.pagination = null;
            state.unpaidPagination = null;
            state.error = null;
        },
        updateUnpaidPagination: (state, action) => {
            if (state.unpaidPagination) {
                state.unpaidPagination = {
                    ...state.unpaidPagination,
                    ...action.payload
                };
            }
        },
        setUnpaidPage: (state, action) => {
            if (state.unpaidPagination) {
                state.unpaidPagination.page = action.payload;
            }
        },
        setUnpaidLimit: (state, action) => {
            if (state.unpaidPagination) {
                state.unpaidPagination.limit = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInvoicesStatsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInvoicesStatsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.invoices = action.payload.invoices || [];
                state.unpaidInvoices = action.payload.unpaidInvoices || [];
                state.pagination = action.payload.pagination || null;
                state.unpaidPagination = action.payload.unpaidPagination || {
                    page: 1,
                    limit: 10,
                    totalUnpaidCount: 0,
                    totalUnpaidPages: 0
                };
                state.error = null;
            })
            .addCase(getInvoicesStatsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.stats = null;
                state.invoices = [];
                state.unpaidInvoices = [];
                state.pagination = null;
                state.unpaidPagination = null;
            });
    },
});

export const getAllInvoicesReducer = getAllInvoicesSlice.reducer;
export const getInvoicesStatsReducer = getInvoicesStatsSlice.reducer;
export const createInvoiceReducer = createInvoiceSlice.reducer;
export const { resetCreateInvoiceState } = createInvoiceSlice.actions;
export const { resetInvoiceStats } = getInvoicesStatsSlice.actions;
