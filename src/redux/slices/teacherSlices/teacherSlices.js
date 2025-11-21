import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const createTeacher = createAsyncThunk(
  "teacher/createTeacher",
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/createTeacher", teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllTeachers = createAsyncThunk(
  "teacher/getAllTeachers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/getAllTeachers", params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeacherById = createAsyncThunk(
  "teacher/getTeacherById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/getTeacherById", { id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "teacher/updateTeacher",
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/updateTeacher", teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "teacher/deleteTeacher",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/deleteTeacher", { id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeachersName = createAsyncThunk(
  "teacher/getTeachersName",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/getTeachersName");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeacherDetail = createAsyncThunk(
  "teacher/getTeacherDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/teacher/getTeacherDetail", { id });
      return response.data.teacher;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const createTeacherSlice = createSlice({
  name: "createTeacher",
  initialState: {
    teacher: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetCreateTeacherState: (state) => {
      state.teacher = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teacher = action.payload.teacher;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getAllTeachersSlice = createSlice({
  name: "getAllTeachers",
  initialState: {
    teachers: [],
    pagination: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetAllTeachersState: (state) => {
      state.teachers = [];
      state.pagination = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeachers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload.teachers || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getTeacherByIdSlice = createSlice({
  name: "teacherById",
  initialState: {
    teacher: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetTeacherByIdState: (state) => {
      state.teacher = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTeacherById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teacher = action.payload.teacher;
      })
      .addCase(getTeacherById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const updateTeacherSlice = createSlice({
  name: "updateTeacher",
  initialState: {
    teacher: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetUpdateTeacherState: (state) => {
      state.teacher = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teacher = action.payload.teacher;
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const deleteTeacherSlice = createSlice({
  name: "deleteTeacher",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {
    resetDeleteTeacherState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getTeachersNameSlice = createSlice({
  name: "getTeachersName",
  initialState: {
    teacherNames: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetTeachersNameState: (state) => {
      state.teacherNames = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeachersName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTeachersName.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teacherNames = action.payload.teachers || [];
      })
      .addCase(getTeachersName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getTeacherDetailSlice = createSlice({
  name: "teacherDetail",
  initialState: {
    detail: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetTeacherDetailState: (state) => {
      state.detail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTeacherDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload;   // ✅ FIXED
      })
      .addCase(getTeacherDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});


export const { resetCreateTeacherState } = createTeacherSlice.actions;
export const { resetAllTeachersState } = getAllTeachersSlice.actions;
export const { resetTeacherByIdState } = getTeacherByIdSlice.actions;
export const { resetUpdateTeacherState } = updateTeacherSlice.actions;
export const { resetDeleteTeacherState } = deleteTeacherSlice.actions;
export const { resetTeachersNameState } = getTeachersNameSlice.actions;
export const { resetTeacherDetailState } = getTeacherDetailSlice.actions;

export const createTeacherReducer = createTeacherSlice.reducer;
export const getAllTeachersReducer = getAllTeachersSlice.reducer;
export const getTeacherByIdReducer = getTeacherByIdSlice.reducer;
export const updateTeacherReducer = updateTeacherSlice.reducer;
export const deleteTeacherReducer = deleteTeacherSlice.reducer;
export const getTeachersNameReducer = getTeachersNameSlice.reducer;
export const getTeacherDetailReducer = getTeacherDetailSlice.reducer;
