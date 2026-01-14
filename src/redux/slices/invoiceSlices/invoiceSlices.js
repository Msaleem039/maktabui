import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllInvoicesAction = createAsyncThunk(
    `invoices/getAllInvoices`,
    async (requestData = {}, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const { getAllInvoices: invoiceState } = state;

            const payload = {
                page: requestData.page || invoiceState.pagination?.currentPage || 1,
                limit: requestData.limit || invoiceState.pagination?.itemsPerPage || 10,
                search: requestData.search !== undefined ? requestData.search : invoiceState.search,
                status: requestData.status !== undefined ? requestData.status : invoiceState.filters?.status,
                ...requestData
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllInvoices`,
                payload
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getInvoiceByIdAction = createAsyncThunk(
    `invoices/getInvoiceById`,
    async (invoiceId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getInvoiceById`,
                { id: invoiceId }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateInvoiceAction = createAsyncThunk(
    `invoices/updateInvoice`,
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateInvoice`,
                { id, ...updateData }
            );
            return res.data;
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

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createInvoice`, invoiceData);
            return res.data.invoice;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const getInvoiceByIdSlice = createSlice({
    name: "getInvoiceById",
    initialState: {
        loading: false,
        invoice: null,
        error: null,
        success: false,
    },
    reducers: {
        clearInvoiceByIdError: (state) => {
            state.error = null;
        },
        resetInvoiceByIdState: (state) => {
            state.loading = false;
            state.invoice = null;
            state.error = null;
            state.success = false;
        },
        clearInvoiceData: (state) => {
            state.invoice = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInvoiceByIdAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getInvoiceByIdAction.fulfilled, (state, action) => {
                state.loading = false;
                state.invoice = action.payload.data;
                state.success = true;
                state.error = null;
            })
            .addCase(getInvoiceByIdAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.invoice = null;
            });
    },
});

const updateInvoiceSlice = createSlice({
    name: "updateInvoice",
    initialState: {
        loading: false,
        success: false,
        error: null,
        updatedInvoice: null,
    },
    reducers: {
        clearUpdateInvoiceError: (state) => {
            state.error = null;
        },
        resetUpdateInvoiceState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.updatedInvoice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateInvoiceAction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateInvoiceAction.fulfilled, (state, action) => {
                state.loading = false;
                state.updatedInvoice = action.payload.data;
                state.success = true;
                state.error = null;
            })
            .addCase(updateInvoiceAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.updatedInvoice = null;
            });
    },
});

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
    initialState: {
        loading: false,
        invoices: [],
        error: null,
        search: "",
        filters: {
            status: ""
        },
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
        }
    },
    reducers: {
        clearInvoicesError: (state) => {
            state.error = null;
        },
        resetInvoicesState: (state) => {
            state.loading = false;
            state.invoices = [];
            state.error = null;
            state.search = "";
            state.filters = { status: "" };
            state.pagination = {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: false
            };
        },
        setInvoicesPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setInvoicesSearch: (state, action) => {
            state.search = action.payload;
        },
        setInvoicesLimit: (state, action) => {
            state.pagination.itemsPerPage = action.payload;
        },
        setInvoicesFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllInvoicesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllInvoicesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload.data || [];

                // Update pagination info
                if (action.payload.pagination) {
                    state.pagination = {
                        ...state.pagination,
                        ...action.payload.pagination
                    };
                }
            })
            .addCase(getAllInvoicesAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update invoice in the list when update is successful
            .addCase(updateInvoiceAction.fulfilled, (state, action) => {
                if (action.payload.data) {
                    const updatedInvoice = action.payload.data;
                    const index = state.invoices.findIndex(inv => inv._id === updatedInvoice._id);
                    if (index !== -1) {
                        state.invoices[index] = updatedInvoice;
                    }
                }
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
            })
            .addCase(updateInvoiceAction.fulfilled, (state, action) => {
                if (action.payload.data) {
                    const updatedInvoice = action.payload.data;
                    
                    const unpaidIndex = state.unpaidInvoices.findIndex(inv => inv._id === updatedInvoice._id);
                    if (unpaidIndex !== -1) {
                        if (updatedInvoice.status === 'paid' && updatedInvoice.paidAmount >= updatedInvoice.totalAmount) {
                            state.unpaidInvoices.splice(unpaidIndex, 1);
                        } else {
                            state.unpaidInvoices[unpaidIndex] = updatedInvoice;
                        }
                    }
                    
                    const mainIndex = state.invoices.findIndex(inv => inv._id === updatedInvoice._id);
                    if (mainIndex !== -1) {
                        state.invoices[mainIndex] = updatedInvoice;
                    }
                }
            });
    },
});

export const getAllInvoicesReducer = getAllInvoicesSlice.reducer;
export const getInvoiceByIdReducer = getInvoiceByIdSlice.reducer;
export const updateInvoiceReducer = updateInvoiceSlice.reducer;
export const getInvoicesStatsReducer = getInvoicesStatsSlice.reducer;
export const createInvoiceReducer = createInvoiceSlice.reducer;

export const { resetCreateInvoiceState } = createInvoiceSlice.actions;
export const {
    clearInvoicesError,
    resetInvoicesState,
    setInvoicesPage,
    setInvoicesSearch,
    setInvoicesLimit,
    setInvoicesFilter
} = getAllInvoicesSlice.actions;

export const {
    clearInvoiceByIdError,
    resetInvoiceByIdState,
    clearInvoiceData
} = getInvoiceByIdSlice.actions;

export const {
    clearUpdateInvoiceError,
    resetUpdateInvoiceState
} = updateInvoiceSlice.actions;

export const {
    resetInvoiceStats,
    updateUnpaidPagination,
    setUnpaidPage,
    setUnpaidLimit
} = getInvoicesStatsSlice.actions;