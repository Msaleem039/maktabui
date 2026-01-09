import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createStudent = createAsyncThunk(
  `student/createStudent`,
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createStudent`,
        studentData
      );
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentNamesWithIds`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllStudents = createAsyncThunk(
  `students/getAllStudents`,
  async (requestData = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { allStudents } = state;

      const payload = {
        page: requestData.page || allStudents.pagination.currentPage,
        limit: requestData.limit || allStudents.pagination.limit,
        ...requestData,
      };

      if (requestData.search === undefined && allStudents.search) {
        payload.search = allStudents.search;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllStudent`,
        payload
      );
      console.log("response", response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getStudentById = createAsyncThunk(
  `student/getStudentById`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentById`,
        { studentId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllWaitlistStudents = createAsyncThunk(
  "waitlistStudents/getAllWaitlistStudents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 10, page = 1, search = "", adminId } = params;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllWaitlistStudent`,
        { limit, page, search, adminId }
      );
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToWaitlist`,
        { studentId }
      );
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/removeFromStudentWaitlist`,
        { studentId }
      );
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getStudentDashboardStats`,
        { studentId }
      );
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

export const deleteStudent = createAsyncThunk(
  `student/deleteStudent`,
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteStudent`,
        { studentId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getParentChildById = createAsyncThunk(
  `student/getParentChildById`,
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getParentChildById`,
        requestData
      );
            console.log("API Response:", response.data); // 🔥 check students here

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
    search: "",
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  reducers: {
    resetAllStudentsState: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
      state.search = "";
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
    setStudentsPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setStudentsSearch: (state, action) => {
      state.search = action.payload;
    },
    setStudentsLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    clearStudentsError: (state) => {
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

        if (Array.isArray(action.payload)) {
          state.students = action.payload;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.students = action.payload.data;
          if (action.payload.pagination) {
            state.pagination = {
              ...state.pagination,
              ...action.payload.pagination,
            };
          }
        } else {
          state.students = action.payload || [];
        }

        if (action.payload?.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
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
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    resetWaitlistStudentsState: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
    updateWaitlistStudent: (state, action) => {
      const index = state.students.findIndex(
        (student) => student._id === action.payload._id
      );
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    removeWaitlistStudent: (state, action) => {
      state.students = state.students.filter(
        (student) => student._id !== action.payload
      );
      state.pagination.total -= 1;
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
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(getAllWaitlistStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch waitlist students";
      });
  },
});

const addToWaitlistStudentSlice = createSlice({
  name: "addToWaitlistStudent",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetAddWaitlistStudent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
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
  },
});

const removeFromWaitlistStudentSlice = createSlice({
  name: "removeFromWaitlistStudent",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetRemoveWaitlistStudent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
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
  },
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
          ...action.payload,
        };
      }
    },
    updateAcademicPerformance: (state, action) => {
      if (state.data && state.data.academicPerformance) {
        state.data.academicPerformance = {
          ...state.data.academicPerformance,
          ...action.payload,
        };
      }
    },
    updateKeyMetrics: (state, action) => {
      if (state.data && state.data.keyMetrics) {
        state.data.keyMetrics = {
          ...state.data.keyMetrics,
          ...action.payload,
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
          (assignment) => assignment._id !== action.payload
        );
      }
    },
    markAssignmentCompleted: (state, action) => {
      if (state.data && state.data.assignmentsDueSoon) {
        const assignment = state.data.assignmentsDueSoon.find(
          (assignment) => assignment._id === action.payload
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

const deleteStudentSlice = createSlice({
  name: "deleteStudent",
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetDeleteStudent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearDeleteStudentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

const getParentChildByIdSlice = createSlice({
  name: "parentChildById",
  initialState: {
    parent: null,
    students: [],
    totalStudents: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    resetParentChildState: (state) => {
      state.parent = null;
      state.students = [];
      state.totalStudents = 0;
      state.status = "idle";
      state.error = null;
    },
    clearParentChildError: (state) => {
      state.error = null;
    },
    updateParentData: (state, action) => {
      if (state.parent) {
        state.parent = { ...state.parent, ...action.payload };
      }
    },
    updateStudentInList: (state, action) => {
      const index = state.students.findIndex(
        (student) => student._id === action.payload._id
      );
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...action.payload };
      }
    },
    addNewStudent: (state, action) => {
      state.students.unshift(action.payload);
      state.totalStudents += 1;
    },
    removeStudentFromList: (state, action) => {
      state.students = state.students.filter(
        (student) => student._id !== action.payload
      );
      state.totalStudents = Math.max(0, state.totalStudents - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentChildById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getParentChildById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parent = action.payload.parent || null;
        state.students = action.payload.students || [];
        // Set totalStudents from pagination.totalStudents if exists
        state.totalStudents =
          action.payload.pagination?.totalStudents || state.students.length;
        state.error = null;
      })
      .addCase(getParentChildById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.parent = null;
        state.students = [];
        state.totalStudents = 0;
      });
  },
});

export const { resetCreateStudentState } = createStudentSlice.actions;

export const {
  resetAllStudentsState,
  setStudentsPage,
  setStudentsSearch,
  setStudentsLimit,
  clearStudentsError,
} = getAllStudentsSlice.actions;

export const {
  resetStudentByIdState,
  clearError,
  updateStudentData,
  updateAttendance,
  updateAssignments,
} = getStudentByIdSlice.actions;

export const {
  resetWaitlistStudentsState,
  updateWaitlistStudent,
  removeWaitlistStudent,
} = getAllWaitlistStudentsSlice.actions;

export const { resetAddWaitlistStudent } = addToWaitlistStudentSlice.actions;

export const { resetRemoveWaitlistStudent } = removeFromWaitlistStudentSlice.actions;

export const { resetStudentNamesState, clearStudentNamesError } = getStudentNamesWithIdsSlice.actions;

export const {
  resetDashboardStatsState,
  clearDashboardStatsError,
  updateDashboardStats,
  updateAttendanceData,
  updateAcademicPerformance,
  updateKeyMetrics,
  addNewAssignment,
  removeAssignment,
  markAssignmentCompleted,
} = getStudentDashboardStatsSlice.actions;

export const {
  resetUpdateStudentState,
  clearUpdateStudentError,
  resetSuccessStatus,
  updateStudentLocally,
} = updateStudentSlice.actions;

export const { resetDeleteStudent, clearDeleteStudentError } = deleteStudentSlice.actions;

export const {
  resetParentChildState,
  clearParentChildError,
  updateParentData,
  updateStudentInList,
  addNewStudent,
  removeStudentFromList,
} = getParentChildByIdSlice.actions;

export const createStudentReducer = createStudentSlice.reducer;
export const getAllStudentsReducer = getAllStudentsSlice.reducer;
export const getStudentByIdReducer = getStudentByIdSlice.reducer;
export const getAllWaitlistStudentsReducer = getAllWaitlistStudentsSlice.reducer;
export const addToWaitlistStudentReducer = addToWaitlistStudentSlice.reducer;
export const removeFromWaitlistStudentReducer = removeFromWaitlistStudentSlice.reducer;
export const getStudentNamesWithIdsReducer = getStudentNamesWithIdsSlice.reducer;
export const getStudentDashboardStatsReducer = getStudentDashboardStatsSlice.reducer;
export const updateStudentReducer = updateStudentSlice.reducer;
export const deleteStudentReducer = deleteStudentSlice.reducer;
export const getParentChildByIdReducer = getParentChildByIdSlice.reducer;

export const studentReducer = {
  createStudent: createStudentReducer,
  getAllStudents: getAllStudentsReducer,
  getStudentById: getStudentByIdReducer,
  waitlistStudents: getAllWaitlistStudentsReducer,
  addToWaitlistStudent: addToWaitlistStudentReducer,
  removeFromWaitlistStudent: removeFromWaitlistStudentReducer,
  getStudentNamesWithIds: getStudentNamesWithIdsReducer,
  getStudentDashboardStats: getStudentDashboardStatsReducer,
  updateStudent: updateStudentReducer,
  deleteStudent: deleteStudentReducer,
  getParentChildById: getParentChildByIdReducer,
};

export {
  createStudent,
  getStudentNamesWithIds,
  getAllStudents,
  getStudentById,
  getAllWaitlistStudents,
  addToWaitlistStudent,
  removeFromWaitlistStudent,
  getStudentDashboardStats,
  updateStudentById,
  deleteStudent,
  getParentChildById,
};