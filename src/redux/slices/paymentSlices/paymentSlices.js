import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPaymentStatsAction = createAsyncThunk(
    "payments/getAllPaymentStats",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const payload = {
                page: filters.page || 1,
                limit: filters.limit || 10,
                search: filters.search || "",
                startDate: filters.startDate || "",
                endDate: filters.endDate || "",
                status: filters.status || "",
                year: filters.year || new Date().getFullYear().toString(),
                paymentMethod: filters.paymentMethod || ""
            };

            const res = await axios.post("/api/payment/getAllPaymentStats", payload);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const getAllPaymentStatsSlice = createSlice({
    name: "getAllPaymentStats",
    initialState: {
        loading: false,
        stats: null,
        tableData: [],
        paymentMethodsData: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 0,
            }]
        },
        monthlyTrendsData: {
            labels: [],
            datasets: [{
                label: "Payments",
                data: [],
                backgroundColor: [],
                borderWidth: 0,
            }]
        },
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalRecords: 0,
            hasNext: false,
            hasPrev: false
        },
        error: null
    },
    reducers: {
        resetPaymentStats: (state) => {
            state.loading = false;
            state.stats = null;
            state.tableData = [];
            state.paymentMethodsData = {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 0,
                }]
            };
            state.monthlyTrendsData = {
                labels: [],
                datasets: [{
                    label: "Payments",
                    data: [],
                    backgroundColor: [],
                    borderWidth: 0,
                }]
            };
            state.pagination = {
                currentPage: 1,
                totalPages: 0,
                totalRecords: 0,
                hasNext: false,
                hasPrev: false
            };
            state.error = null;
        },
        updatePagination: (state, action) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload
            };
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
        },
        updateFilters: (state, action) => {
            // You can update filter state here if needed
            state.filters = { ...state.filters, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPaymentStatsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPaymentStatsAction.fulfilled, (state, action) => {
                state.loading = false;
                
                // Key metrics
                state.stats = {
                    totalPayments: action.payload.totalPayments,
                    totalAmount: action.payload.totalAmount,
                    averagePayment: action.payload.averagePayment,
                    lastPaymentDate: action.payload.lastPaymentDate
                };
                
                // Table data
                state.tableData = action.payload.tableData || [];
                
                // Chart data
                state.paymentMethodsData = action.payload.paymentMethodsData || {
                    labels: ["CARD", "CASH", "STRIPE", "ZELLE"],
                    datasets: [{
                        data: [25, 25, 25, 25],
                        backgroundColor: ["#14B8A6", "#0B4B31", "#3B82F6", "#000000"],
                        borderWidth: 0,
                    }]
                };
                
                state.monthlyTrendsData = action.payload.monthlyTrendsData || {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [{
                        label: "Payments",
                        data: Array(12).fill(0),
                        backgroundColor: [
                            "#0B4B31", "#14B8A6", "#000000", "#3B82F6", "#3B82F6", "#14B8A6",
                            "#0B4B31", "#14B8A6", "#000000", "#3B82F6", "#3B82F6", "#14B8A6"
                        ],
                        borderWidth: 0,
                    }]
                };
                
                // Pagination
                state.pagination = action.payload.pagination || {
                    currentPage: 1,
                    totalPages: 0,
                    totalRecords: 0,
                    hasNext: false,
                    hasPrev: false
                };
                
                state.error = null;
            })
            .addCase(getAllPaymentStatsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.stats = null;
                state.tableData = [];
                state.paymentMethodsData = {
                    labels: ["CARD", "CASH", "STRIPE", "ZELLE"],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: ["#14B8A6", "#0B4B31", "#3B82F6", "#000000"],
                        borderWidth: 0,
                    }]
                };
                state.monthlyTrendsData = {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [{
                        label: "Payments",
                        data: Array(12).fill(0),
                        backgroundColor: [
                            "#0B4B31", "#14B8A6", "#000000", "#3B82F6", "#3B82F6", "#14B8A6",
                            "#0B4B31", "#14B8A6", "#000000", "#3B82F6", "#3B82F6", "#14B8A6"
                        ],
                        borderWidth: 0,
                    }]
                };
                state.pagination = {
                    currentPage: 1,
                    totalPages: 0,
                    totalRecords: 0,
                    hasNext: false,
                    hasPrev: false
                };
            });
    },
});

export const getAllPaymentStatsReducer = getAllPaymentStatsSlice.reducer;
export const { 
    resetPaymentStats, 
    updatePagination, 
    setCurrentPage, 
    setLimit,
    updateFilters 
} = getAllPaymentStatsSlice.actions;