import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createStudent = createAsyncThunk(
  `student/createStudent`,
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createStudent`, studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStudentNamesWithIds = createAsyncThunk(
  `students/getStudentNamesWithIds`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentNamesWithIds`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllStudents = createAsyncThunk(
  `students/getAllStudents`,
  async (requestData = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllStudent`,
        requestData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStudentById = createAsyncThunk(
  `student/getStudentById`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentById`, { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllWaitlistStudents = createAsyncThunk(
  `student/getAllWaitlistStudents`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllWaitlistStudents`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWaitlistStudent = createAsyncThunk(
  `student/waitlist/add`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToWaitlist`, { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromWaitlistStudent = createAsyncThunk(
  `student/waitlist/remove`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/removeFromWaitlist`, { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudentDashboardStats = createAsyncThunk(
  `student/getStudentDashboardStats`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentDashboardStats`, { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateStudentById = createAsyncThunk(
  `student/updateStudentById`,
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateStudentById`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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

const getStudentNamesWithIdsSlice = createSlice({
  name: "studentNamesWithIds",
  initialState: {
    students: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetStudentNamesState: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
    },
    clearStudentNamesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentNamesWithIds.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getStudentNamesWithIds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload.students || [];
      })
      .addCase(getStudentNamesWithIds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getStudentDashboardStatsSlice = createSlice({
  name: "studentDashboardStats",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetDashboardStatsState: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
    clearDashboardStatsError: (state) => {
      state.error = null;
    },
    updateDashboardStats: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    updateAttendanceData: (state, action) => {
      if (state.data && state.data.studentAttendance) {
        state.data.studentAttendance = {
          ...state.data.studentAttendance,
          ...action.payload
        };
      }
    },
    updateAcademicPerformance: (state, action) => {
      if (state.data && state.data.academicPerformance) {
        state.data.academicPerformance = {
          ...state.data.academicPerformance,
          ...action.payload
        };
      }
    },
    updateKeyMetrics: (state, action) => {
      if (state.data && state.data.keyMetrics) {
        state.data.keyMetrics = {
          ...state.data.keyMetrics,
          ...action.payload
        };
      }
    },
    addNewAssignment: (state, action) => {
      if (state.data && state.data.assignmentsDueSoon) {
        state.data.assignmentsDueSoon.push(action.payload);
      }
    },
    removeAssignment: (state, action) => {
      if (state.data && state.data.assignmentsDueSoon) {
        state.data.assignmentsDueSoon = state.data.assignmentsDueSoon.filter(
          assignment => assignment._id !== action.payload
        );
      }
    },
    markAssignmentCompleted: (state, action) => {
      if (state.data && state.data.assignmentsDueSoon) {
        const assignment = state.data.assignmentsDueSoon.find(
          assignment => assignment._id === action.payload
        );
        if (assignment) {
          assignment.completed = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getStudentDashboardStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(getStudentDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.data = null;
      });
  },
});

const updateStudentSlice = createSlice({
  name: "updateStudent",
  initialState: {
    student: null,
    status: "idle",
    error: null,
    success: false,
  },
  reducers: {
    resetUpdateStudentState: (state) => {
      state.student = null;
      state.status = "idle";
      state.error = null;
      state.success = false;
    },
    clearUpdateStudentError: (state) => {
      state.error = null;
    },
    resetSuccessStatus: (state) => {
      state.success = false;
    },
    updateStudentLocally: (state, action) => {
      if (state.student) {
        state.student = { ...state.student, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateStudentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.success = false;
      })
      .addCase(updateStudentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.student = action.payload.data;
        state.success = true;
        state.error = null;
      })
      .addCase(updateStudentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update student";
        state.success = false;
      });
  },
});

export const { resetCreateStudentState } = createStudentSlice.actions;
export const { resetAllStudentsState } = getAllStudentsSlice.actions;
export const { resetStudentByIdState } = getStudentByIdSlice.actions;
export const { resetWaitlistStudentsState } = getAllWaitlistStudentsSlice.actions;
export const { resetAddWaitlistStudent } = addToWaitlistStudentSlice.actions;
export const { resetRemoveWaitlistStudent } = removeFromWaitlistStudentSlice.actions;
export const { resetStudentNamesState, clearStudentNamesError } = getStudentNamesWithIdsSlice.actions;
export const { resetDashboardStatsState, clearDashboardStatsError, updateDashboardStats } = getStudentDashboardStatsSlice.actions;
export const { resetUpdateStudentState, clearUpdateStudentError, resetSuccessStatus } = updateStudentSlice.actions;

export const createStudentReducer = createStudentSlice.reducer;
export const getAllStudentsReducer = getAllStudentsSlice.reducer;
export const getStudentByIdReducer = getStudentByIdSlice.reducer;
export const getAllWaitlistStudentsReducer = getAllWaitlistStudentsSlice.reducer;
export const addToWaitlistStudentReducer = addToWaitlistStudentSlice.reducer;
export const removeFromWaitlistStudentReducer = removeFromWaitlistStudentSlice.reducer;
export const getStudentNamesWithIdsReducer = getStudentNamesWithIdsSlice.reducer;
export const getStudentDashboardStatsReducer = getStudentDashboardStatsSlice.reducer;
export const updateStudentReducer = updateStudentSlice.reducer;

export const studentReducer = {
  createStudent: createStudentReducer,
  getAllStudents: getAllStudentsReducer,
  getStudentById: getStudentByIdReducer,
  waitlistStudents: getAllWaitlistStudentsReducer,
  addToWaitlistStudent: addToWaitlistStudentReducer,
  removeFromWaitlistStudent: removeFromWaitlistStudentReducer,
  getStudentNamesWithIds: getStudentNamesWithIdsReducer,
  getStudentDashboardStats: getStudentDashboardStatsReducer,
  updateStudent: updateStudentReducer
};