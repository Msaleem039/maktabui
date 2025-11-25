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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updatGradeById`,
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
      })
      // Get Grade by ID
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
      // Update Grade by ID
      .addCase(updateGradeById.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateGradeById.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        // Update the grade in grades array if it exists
        const updatedGrade = action.payload.grade;
        const index = state.grades.findIndex(grade => grade._id === updatedGrade._id);
        if (index !== -1) {
          state.grades[index] = updatedGrade;
        }

        // Update in studentGrades array if it exists
        const studentIndex = state.studentGrades.findIndex(grade => grade._id === updatedGrade._id);
        if (studentIndex !== -1) {
          state.studentGrades[studentIndex] = updatedGrade;
        }

        // Update currentGrade if it's the one being updated
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
  setCurrentGrade
} = gradeSlice.actions;

export default gradeSlice.reducer;