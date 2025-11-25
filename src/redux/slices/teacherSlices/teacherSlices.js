import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const createTeacher = createAsyncThunk(
  `teacher/createTeacher`,
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createTeacher`, teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllTeachers = createAsyncThunk(
  `teacher/getAllTeachers`,
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllTeachers`, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeacherById = createAsyncThunk(
  `teacher/getTeacherById`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeacherById`, { id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  `teacher/updateTeacher`,
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTeacher`, teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  `teacher/deleteTeacher`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteTeacher`, { id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeachersName = createAsyncThunk(
  `teacher/getTeachersName`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeachersName`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeacherDetail = createAsyncThunk(
  `teacher/getTeacherDetail`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeacherDetail`, { id });
      return response.data.teacher;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTeacherDashboard = createAsyncThunk(
  'teacher/getTeacherDashboard',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTeacherDashboardStat`,
        { teacherId }
      );
      return response.data;
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

const teacherDashboardSlice = createSlice({
  name: "teacherDashboard",
  initialState: {
    // Stats cards data
    stats: {
      data: [
        {
          label: "Active Classes",
          value: 0,
          sublabel: "This semester",
          icon: "BookOpen"
        },
        {
          label: "Total Students",
          value: 0,
          sublabel: "Across classes",
          icon: "Users"
        },
        {
          label: "Assignments Due",
          value: 0,
          sublabel: "This week",
          icon: "ClipboardList"
        }
      ],
      loading: false,
      error: null
    },

    // Today's schedule
    upcomingLessons: {
      data: [],
      loading: false,
      error: null
    },

    // Assessment tracker
    assessments: {
      data: [],
      loading: false,
      error: null
    },

    // Student focus
    studentFocus: {
      data: [],
      loading: false,
      error: null
    },

    // Teacher info
    teacherInfo: {
      fullName: '',
      email: '',
      assignedClasses: []
    },

    // Overall loading and error states
    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {
    resetTeacherDashboard: (state) => {
      state.stats = {
        data: [
          {
            label: "Active Classes",
            value: 0,
            sublabel: "This semester",
            icon: "BookOpen"
          },
          {
            label: "Total Students",
            value: 0,
            sublabel: "Across classes",
            icon: "Users"
          },
          {
            label: "Assignments Due",
            value: 0,
            sublabel: "This week",
            icon: "ClipboardList"
          }
        ],
        loading: false,
        error: null
      };
      state.upcomingLessons = {
        data: [],
        loading: false,
        error: null
      };
      state.assessments = {
        data: [],
        loading: false,
        error: null
      };
      state.studentFocus = {
        data: [],
        loading: false,
        error: null
      };
      state.teacherInfo = {
        fullName: '',
        email: '',
        assignedClasses: []
      };
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },

    clearTeacherDashboardError: (state) => {
      state.error = null;
      state.stats.error = null;
      state.upcomingLessons.error = null;
      state.assessments.error = null;
      state.studentFocus.error = null;
    },

    updateTeacherStats: (state, action) => {
      if (action.payload.activeClasses !== undefined) {
        state.stats.data[0].value = action.payload.activeClasses;
      }
      if (action.payload.totalStudents !== undefined) {
        state.stats.data[1].value = action.payload.totalStudents;
      }
      if (action.payload.assignmentsDue !== undefined) {
        state.stats.data[2].value = action.payload.assignmentsDue;
      }
    },

    // Add a new lesson to today's schedule
    addUpcomingLesson: (state, action) => {
      state.upcomingLessons.data.push(action.payload);
    },

    // Update assessment status
    updateAssessmentStatus: (state, action) => {
      const { assessmentIndex, status } = action.payload;
      if (state.assessments.data[assessmentIndex]) {
        state.assessments.data[assessmentIndex].status = status;
      }
    },

    // Remove student from focus list
    removeStudentFromFocus: (state, action) => {
      const studentIndex = action.payload;
      state.studentFocus.data.splice(studentIndex, 1);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.stats.loading = true;
        state.upcomingLessons.loading = true;
        state.assessments.loading = true;
        state.studentFocus.loading = true;
      })
      .addCase(getTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();

        // Update stats
        state.stats = {
          ...state.stats,
          data: action.payload.data.stats || state.stats.data,
          loading: false,
          error: null
        };

        // Update upcoming lessons
        state.upcomingLessons = {
          ...state.upcomingLessons,
          data: action.payload.data.upcomingLessons || [],
          loading: false,
          error: null
        };

        // Update assessments
        state.assessments = {
          ...state.assessments,
          data: action.payload.data.assessments || [],
          loading: false,
          error: null
        };

        // Update student focus
        state.studentFocus = {
          ...state.studentFocus,
          data: action.payload.data.studentFocus || [],
          loading: false,
          error: null
        };

        // Update teacher info if available
        if (action.payload.data.teacherInfo) {
          state.teacherInfo = action.payload.data.teacherInfo;
        }
      })
      .addCase(getTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stats.loading = false;
        state.upcomingLessons.loading = false;
        state.assessments.loading = false;
        state.studentFocus.loading = false;

        state.stats.error = action.payload;
        state.upcomingLessons.error = action.payload;
        state.assessments.error = action.payload;
        state.studentFocus.error = action.payload;
      });
  }
});

export const { resetCreateTeacherState } = createTeacherSlice.actions;
export const { resetAllTeachersState } = getAllTeachersSlice.actions;
export const { resetTeacherByIdState } = getTeacherByIdSlice.actions;
export const { resetUpdateTeacherState } = updateTeacherSlice.actions;
export const { resetDeleteTeacherState } = deleteTeacherSlice.actions;
export const { resetTeachersNameState } = getTeachersNameSlice.actions;
export const { resetTeacherDetailState } = getTeacherDetailSlice.actions;
export const { 
  resetTeacherDashboard, 
  clearTeacherDashboardError, 
  updateTeacherStats,
  addUpcomingLesson,
  updateAssessmentStatus,
  removeStudentFromFocus 
} = teacherDashboardSlice.actions;

export const createTeacherReducer = createTeacherSlice.reducer;
export const getAllTeachersReducer = getAllTeachersSlice.reducer;
export const getTeacherByIdReducer = getTeacherByIdSlice.reducer;
export const updateTeacherReducer = updateTeacherSlice.reducer;
export const deleteTeacherReducer = deleteTeacherSlice.reducer;
export const getTeachersNameReducer = getTeachersNameSlice.reducer;
export const getTeacherDetailReducer = getTeacherDetailSlice.reducer;
export const teacherDashboardReducer = teacherDashboardSlice.reducer;
