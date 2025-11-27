import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createGrade = createAsyncThunk(
  'grade/createGrade',
  async ({ assignmentId, studentId, marksObtained, gradedBy, feedback }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createGrade`,
        { assignmentId, studentId, marksObtained, gradedBy, feedback }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getGrades = createAsyncThunk(
  'grade/getGrades',
  async (requestData = {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getGrades`,
        requestData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getGradesByStudentId = createAsyncThunk(
  'grade/getGradesByStudentId',
  async ({ studentId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getGradesByStudentId`,
        { studentId }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getGradeById = createAsyncThunk(
  'grade/getGradeById',
  async ({ gradeId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getGradeById`, { gradeId }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateGradeById = createAsyncThunk(
  'grade/updateGradeById',
  async ({ gradeId, marksObtained, feedback, gradedBy }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateGradeById`,
        { marksObtained, feedback, gradedBy, gradeId }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  grades: [],
  studentGrades: [],
  currentGrade: null,
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
  detailStatus: 'idle',
  detailError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10
  },
};

const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.detailError = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
    clearUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
    clearDetailStatus: (state) => {
      state.detailStatus = 'idle';
      state.detailError = null;
      state.currentGrade = null;
    },
    clearStudentGrades: (state) => {
      state.studentGrades = [];
    },
    setCurrentGrade: (state, action) => {
      state.currentGrade = action.payload;
    },
    setGradesPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setGradesLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGrade.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.grades.push(action.payload.grade);
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload;
      })
      .addCase(getGrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getGrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = action.payload.grades;
        
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.pagination.currentPage || 1,
            totalPages: action.payload.pagination.totalPages || 1,
            totalCount: action.payload.pagination.totalCount || action.payload.totalCount || 0,
            hasNext: action.payload.pagination.hasNext || false,
            hasPrev: action.payload.pagination.hasPrev || false,
            limit: action.payload.pagination.limit || 10
          };
        } else {
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalCount: action.payload.totalCount || action.payload.grades?.length || 0,
            hasNext: false,
            hasPrev: false,
            limit: 10
          };
        }
      })
      .addCase(getGrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.grades = [];
        state.pagination = initialState.pagination;
      })
      .addCase(getGradesByStudentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getGradesByStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.studentGrades = action.payload.grades;
      })
      .addCase(getGradesByStudentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getGradeById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.currentGrade = null;
      })
      .addCase(getGradeById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.currentGrade = action.payload.grade;
      })
      .addCase(getGradeById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload;
        state.currentGrade = null;
      })
      .addCase(updateGradeById.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateGradeById.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        const updatedGrade = action.payload.grade;
        const index = state.grades.findIndex(grade => grade._id === updatedGrade._id);
        if (index !== -1) {
          state.grades[index] = updatedGrade;
        }

        const studentIndex = state.studentGrades.findIndex(grade => grade._id === updatedGrade._id);
        if (studentIndex !== -1) {
          state.studentGrades[studentIndex] = updatedGrade;
        }

        if (state.currentGrade && state.currentGrade._id === updatedGrade._id) {
          state.currentGrade = updatedGrade;
        }
      })
      .addCase(updateGradeById.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateStatus,
  clearUpdateStatus,
  clearDetailStatus,
  clearStudentGrades,
  setCurrentGrade,
  setGradesPage
} = gradeSlice.actions;

export default gradeSlice.reducer;