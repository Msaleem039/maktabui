import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAdminAction = createAsyncThunk(
  "admins/createAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/admin/createAdmin", formData);
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
      const res = await axios.post("/api/admin/getAllAdmin");
      return res.data.admins;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAdminByIdAction = createAsyncThunk(
  "admins/getAdminById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/admin/getAdminById", { id });
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
      const res = await axios.post("/api/admin/updateAdmin", formData);
      return res.data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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

export const { resetState } = updateAdminSlice.actions;


export const createAdminReducer = createAdminSlice.reducer;
export const getAllAdminsReducer = getAllAdminsSlice.reducer;
export const getAdminByIdReducer = getAdminByIdSlice.reducer;
export const updateAdminReducer = updateAdminSlice.reducer;