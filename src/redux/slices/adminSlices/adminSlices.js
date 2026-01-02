import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAdminAction = createAsyncThunk(
  "admins/createAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createAdmin`, formData);
      return res.data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAdminDashboardStats = createAsyncThunk(
  "admins/createAdmin",
  async (adminId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAdminDashboardStats`, adminId);
      return res.data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllAdminsAction = createAsyncThunk(
  "admins/getAllAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllAdmin`);
      return res.data.admins;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAdminAction = createAsyncThunk(
  "admins/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteAdmin`, { id });
      return res.data.deletedAdmin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAdminByIdAction = createAsyncThunk(
  "admins/getAdminById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAdminById`, { id });
      return res.data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAdminAction = createAsyncThunk(
  "admins/updateAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateAdmin`, formData);
      return res.data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateThemeAction = createAsyncThunk(
  "admins/updateTheme",
  async (themeData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTheme`,
        themeData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAdminDashboardStatsAction = createAsyncThunk(
  "admins/getAdminDashboardStats",
  async ({ adminId, year }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAdminDashboardStats`,
        { adminId, year }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


const createAdminSlice = createSlice({
  name: "createAdmin",
  initialState: { loading: false, admin: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdminAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(createAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllAdminsSlice = createSlice({
  name: "getAllAdmins",
  initialState: { loading: false, admins: [], error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdminsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAdminsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(getAllAdminsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAdminByIdSlice = createSlice({
  name: "getAdminById",
  initialState: { loading: false, admin: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminByIdAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(getAdminByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const updateAdminSlice = createSlice({
  name: "updateAdmin",
  initialState: { loading: false, updatedAdmin: null, error: null },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.updatedAdmin = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAdminAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedAdmin = action.payload;
      })
      .addCase(updateAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const deleteAdminSlice = createSlice({
  name: "deleteAdmin",
  initialState: { 
    loading: false, 
    success: false, 
    deletedAdmin: null, 
    error: null 
  },
  reducers: {
    resetDeleteAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.deletedAdmin = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAdminAction.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedAdmin = action.payload;
        state.error = null;
      })
      .addCase(deleteAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

const updateThemeSlice = createSlice({
  name: "updateTheme",
  initialState: { 
    loading: false, 
    success: false, 
    data: null, 
    error: null 
  },
  reducers: {
    resetUpdateThemeState: (state) => {
      state.loading = false;
      state.success = false;
      state.data = null;
      state.error = null;
    },
    clearUpdateThemeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateThemeAction.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateThemeAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateThemeAction.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    loading: false,
    stats: null,
    yearlyPayments: [],
    topPayingParents: [],
    topOutstandingParents: [],
    error: null,
  },
  reducers: {
    resetAdminDashboardState: (state) => {
      state.loading = false;
      state.stats = null;
      state.yearlyPayments = [];
      state.topPayingParents = [];
      state.topOutstandingParents = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboardStatsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboardStatsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.yearlyPayments = action.payload.yearlyPayments;
        state.topPayingParents = action.payload.topPayingParents;
        state.topOutstandingParents =
          action.payload.topOutstandingParents;
      })
      .addCase(getAdminDashboardStatsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { resetState } = updateAdminSlice.actions;
export const { resetDeleteAdminState } = deleteAdminSlice.actions;
export const { resetUpdateThemeState, clearUpdateThemeError } = updateThemeSlice.actions;

export const createAdminReducer = createAdminSlice.reducer;
export const getAllAdminsReducer = getAllAdminsSlice.reducer;
export const getAdminByIdReducer = getAdminByIdSlice.reducer;
export const updateAdminReducer = updateAdminSlice.reducer;
export const deleteAdminReducer = deleteAdminSlice.reducer;
export const updateThemeReducer = updateThemeSlice.reducer;
export const { resetAdminDashboardState } = adminDashboardSlice.actions;
export const adminDashboardReducer = adminDashboardSlice.reducer;