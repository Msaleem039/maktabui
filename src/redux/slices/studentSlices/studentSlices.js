import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const createStudent = createAsyncThunk(
  "student/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/createStudent", studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllStudents = createAsyncThunk(
  "students/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/getAllStudents");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStudentById = createAsyncThunk(
  "student/getStudentById",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/getStudentById", { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllWaitlistStudents = createAsyncThunk(
  "student/getAllWaitlistStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/getAllWaitlistStudents");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWaitlistStudent = createAsyncThunk(
  'student/waitlist/add',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/addToWaitlist", { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromWaitlistStudent = createAsyncThunk(
  'student/waitlist/remove',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/removeFromWaitlist", { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slices
const createStudentSlice = createSlice({
  name: "createStudent",
  initialState: {
    student: null,
    parent: null,
    existingParent: false,
    status: "idle",
    error: null,
  },
  reducers: {
    resetCreateStudentState: (state) => {
      state.student = null;
      state.parent = null;
      state.existingParent = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.student = action.payload.student;
        state.parent = action.payload.parent;
        state.existingParent = action.payload.existingParent;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getAllStudentsSlice = createSlice({
  name: "allStudents",
  initialState: {
    students: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetAllStudentsState: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload.students || [];
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getStudentByIdSlice = createSlice({
  name: "studentById",
  initialState: {
    student: null,
    attendance: [],
    assignments: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetStudentByIdState: (state) => {
      state.student = null;
      state.attendance = [];
      state.assignments = [];
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStudentData: (state, action) => {
      if (state.student) {
        state.student = { ...state.student, ...action.payload };
      }
    },
    updateAttendance: (state, action) => {
      state.attendance = action.payload;
    },
    updateAssignments: (state, action) => {
      state.assignments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.student = action.payload.student;
        state.attendance = action.payload.student?.attendance || [];
        state.assignments = action.payload.student?.assignments || [];
        state.error = null;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.student = null;
        state.attendance = [];
        state.assignments = [];
      });
  },
});

const getAllWaitlistStudentsSlice = createSlice({
  name: "waitlistStudents",
  initialState: {
    students: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetWaitlistStudentsState: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllWaitlistStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllWaitlistStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload.waitlist || [];
      })
      .addCase(getAllWaitlistStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const addToWaitlistStudentSlice = createSlice({
  name: 'addToWaitlistStudent',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetAddWaitlistStudent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWaitlistStudent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addToWaitlistStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addToWaitlistStudent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

const removeFromWaitlistStudentSlice = createSlice({
  name: 'removeFromWaitlistStudent',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetRemoveWaitlistStudent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeFromWaitlistStudent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeFromWaitlistStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(removeFromWaitlistStudent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

// Export Actions
export const { resetCreateStudentState } = createStudentSlice.actions;
export const { resetAllStudentsState } = getAllStudentsSlice.actions;
export const { resetStudentByIdState } = getStudentByIdSlice.actions;
export const { resetWaitlistStudentsState } = getAllWaitlistStudentsSlice.actions;
export const { resetAddWaitlistStudent } = addToWaitlistStudentSlice.actions;
export const { resetRemoveWaitlistStudent } = removeFromWaitlistStudentSlice.actions;

// Export Reducers
export const createStudentReducer = createStudentSlice.reducer;
export const getAllStudentsReducer = getAllStudentsSlice.reducer;
export const getStudentByIdReducer = getStudentByIdSlice.reducer;
export const getAllWaitlistStudentsReducer = getAllWaitlistStudentsSlice.reducer;
export const addToWaitlistStudentReducer = addToWaitlistStudentSlice.reducer;
export const removeFromWaitlistStudentReducer = removeFromWaitlistStudentSlice.reducer;

// Combined Reducer
export const studentReducer = {
  createStudent: createStudentReducer,
  getAllStudents: getAllStudentsReducer,
  getStudentById: getStudentByIdReducer,
  waitlistStudents: getAllWaitlistStudentsReducer,
  addToWaitlistStudent: addToWaitlistStudentReducer,
  removeFromWaitlistStudent: removeFromWaitlistStudentReducer,
};