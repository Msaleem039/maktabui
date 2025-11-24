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

const initialState = {
  grades: [],
  studentGrades: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
};

const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
    clearStudentGrades: (state) => {
      state.studentGrades = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Grade
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
      // Get All Grades
      .addCase(getGrades.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getGrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = action.payload.grades;
      })
      .addCase(getGrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Get Grades by Student ID
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
      });
  },
});

export const { clearError, clearCreateStatus, clearStudentGrades } = gradeSlice.actions;
export default gradeSlice.reducer;