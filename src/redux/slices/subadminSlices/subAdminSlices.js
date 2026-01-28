import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createSubAdminAction = createAsyncThunk(
  "subadmins/createSubAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createSubAdmin`, 
        formData
      );
      return res.data.subAdmin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllSubAdminsAction = createAsyncThunk(
  "subadmins/getAllSubAdmins",
  async (adminId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllSubAdminAgainstAdmin`, 
        { adminId }
      );
      return {
        adminId,
        subAdmins: res.data.subAdmins,
        count: res.data.count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSubAdminByIdAction = createAsyncThunk(
  "subadmins/getSubAdminById",
  async ({ adminId, subAdminId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getSubAdminById`, 
        { adminId, subAdminId }
      );
      return res.data.subAdmin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSubAdminAction = createAsyncThunk(
  "subadmins/updateSubAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/editSubAdminById`, 
        formData
      );
      return res.data.subAdmin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSubAdminAction = createAsyncThunk(
  "subadmins/deleteSubAdmin",
  async ({ adminId, subAdminId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteSubAdmin`, 
        { data: { adminId, subAdminId } }
      );
      return { adminId, subAdminId, ...res.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const createSubAdminSlice = createSlice({
  name: "createSubAdmin",
  initialState: { 
    loading: false, 
    subAdmin: null, 
    error: null, 
    success: false 
  },
  reducers: {
    resetCreateSubAdminState: (state) => {
      state.loading = false;
      state.subAdmin = null;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubAdminAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmin = action.payload;
        state.success = true;
      })
      .addCase(createSubAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

const getAllSubAdminsSlice = createSlice({
  name: "getAllSubAdmins",
  initialState: { 
    loading: false, 
    subAdmins: [], 
    adminId: null,
    count: 0,
    error: null 
  },
  reducers: {
    resetSubAdminsState: (state) => {
      state.loading = false;
      state.subAdmins = [];
      state.adminId = null;
      state.count = 0;
      state.error = null;
    },
    removeSubAdminFromList: (state, action) => {
      state.subAdmins = state.subAdmins.filter(
        (subAdmin) => subAdmin._id !== action.payload
      );
      state.count = state.subAdmins.length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSubAdminsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubAdminsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmins = action.payload.subAdmins;
        state.adminId = action.payload.adminId;
        state.count = action.payload.count;
      })
      .addCase(getAllSubAdminsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getSubAdminByIdSlice = createSlice({
  name: "getSubAdminById",
  initialState: { 
    loading: false, 
    subAdmin: null, 
    error: null 
  },
  reducers: {
    resetSubAdminState: (state) => {
      state.loading = false;
      state.subAdmin = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubAdminByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubAdminByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmin = action.payload;
      })
      .addCase(getSubAdminByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const updateSubAdminSlice = createSlice({
  name: "updateSubAdmin",
  initialState: { 
    loading: false, 
    updatedSubAdmin: null, 
    error: null,
    success: false 
  },
  reducers: {
    resetUpdateSubAdminState: (state) => {
      state.loading = false;
      state.updatedSubAdmin = null;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSubAdminAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedSubAdmin = action.payload;
        state.success = true;
      })
      .addCase(updateSubAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

const deleteSubAdminSlice = createSlice({
  name: "deleteSubAdmin",
  initialState: { 
    loading: false, 
    success: false, 
    deletedSubAdminId: null,
    adminId: null,
    error: null 
  },
  reducers: {
    resetDeleteSubAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.deletedSubAdminId = null;
      state.adminId = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSubAdminAction.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteSubAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedSubAdminId = action.payload.subAdminId;
        state.adminId = action.payload.adminId;
      })
      .addCase(deleteSubAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreateSubAdminState } = createSubAdminSlice.actions;
export const { resetSubAdminsState, removeSubAdminFromList } = getAllSubAdminsSlice.actions;
export const { resetSubAdminState } = getSubAdminByIdSlice.actions;
export const { resetUpdateSubAdminState } = updateSubAdminSlice.actions;
export const { resetDeleteSubAdminState } = deleteSubAdminSlice.actions;

export const createSubAdminReducer = createSubAdminSlice.reducer;
export const getAllSubAdminsReducer = getAllSubAdminsSlice.reducer;
export const getSubAdminByIdReducer = getSubAdminByIdSlice.reducer;
export const updateSubAdminReducer = updateSubAdminSlice.reducer;
export const deleteSubAdminReducer = deleteSubAdminSlice.reducer;