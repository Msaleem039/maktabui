import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllAdminInvoices = createAsyncThunk(
  "adminInvoice/getAllAdminInvoices",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/getAllAdminInvoices`,
        params
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin invoices"
      );
    }
  }
);

export const getAdminInvoiceById = createAsyncThunk(
  "adminInvoice/getAdminInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/getAdminInvoiceById`, {
        id,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin invoice"
      );
    }
  }
);

export const getAdminInvoicesStats = createAsyncThunk(
  "adminInvoice/getAdminInvoicesStats",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/getAdminInvoicesStats`,
        params
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin invoice stats"
      );
    }
  }
);

export const createAdminInvoice = createAsyncThunk(
  "adminInvoice/createAdminInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/createAdminInvoice`,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create admin invoice"
      );
    }
  }
);

export const updateAdminInvoice = createAsyncThunk(
  "adminInvoice/updateAdminInvoice",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/updateAdminInvoice`, {
        id,
        ...data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin invoice"
      );
    }
  }
);

const adminInvoiceSlice = createSlice({
  name: "adminInvoice",
  initialState: {
    invoices: [],
    currentInvoice: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
    search: "",
    filters: {
      status: "",
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  reducers: {
    resetAdminInvoiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAdminInvoiceError: (state) => {
      state.error = null;
    },
    clearAdminInvoiceSuccess: (state) => {
      state.success = false;
    },
    clearCurrentAdminInvoice: (state) => {
      state.currentInvoice = null;
    },
    setCreateInvoiceLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInvoicesPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setInvoicesSearch: (state, action) => {
      state.search = action.payload;
    },
    setInvoicesFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetInvoicesFilters: (state) => {
      state.search = "";
      state.filters = {
        status: "",
      };
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdminInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllAdminInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          currentPage: action.payload.pagination.currentPage || state.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages || 0,
          totalItems: action.payload.pagination.totalItems || 0,
          itemsPerPage: action.payload.pagination.itemsPerPage || state.pagination.itemsPerPage,
          hasNextPage: action.payload.pagination.hasNextPage || false,
          hasPrevPage: action.payload.pagination.hasPrevPage || false,
        };
        state.success = true;
        state.error = null;
      })
      .addCase(getAllAdminInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAdminInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAdminInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload.data;
        state.success = true;
        state.error = null;
      })
      .addCase(getAdminInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAdminInvoicesStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAdminInvoicesStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.invoices = action.payload.invoices;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          currentPage: action.payload.pagination.currentPage || state.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages || 0,
          totalItems: action.payload.pagination.totalItems || 0,
          itemsPerPage: action.payload.pagination.itemsPerPage || state.pagination.itemsPerPage,
          hasNextPage: action.payload.pagination.hasNextPage || false,
          hasPrevPage: action.payload.pagination.hasPrevPage || false,
        };
        state.success = true;
        state.error = null;
      })
      .addCase(getAdminInvoicesStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(createAdminInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAdminInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload.data);
        // Update pagination total items
        state.pagination.totalItems += 1;
        state.success = true;
        state.error = null;
      })
      .addCase(createAdminInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateAdminInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdminInvoice.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.invoices.findIndex(
          (i) => i._id === action.payload.data._id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload.data;
        }

        if (
          state.currentInvoice &&
          state.currentInvoice._id === action.payload.data._id
        ) {
          state.currentInvoice = action.payload.data;
        }

        state.success = true;
        state.error = null;
      })
      .addCase(updateAdminInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  resetAdminInvoiceState,
  clearAdminInvoiceError,
  clearAdminInvoiceSuccess,
  clearCurrentAdminInvoice,
  setCreateInvoiceLoading,
  setInvoicesPage,
  setInvoicesSearch,
  setInvoicesFilter,
  resetInvoicesFilters,
} = adminInvoiceSlice.actions;

export const adminInvoiceReducer = adminInvoiceSlice.reducer;
export const createAdminInvoiceReducer = adminInvoiceSlice.reducer;
export const getAllAdminInvoicesReducer = adminInvoiceSlice.reducer;
export const getAdminInvoiceByIdReducer = adminInvoiceSlice.reducer;
export const updateAdminInvoiceReducer = adminInvoiceSlice.reducer;
export const getAdminInvoicesStatsReducer = adminInvoiceSlice.reducer;