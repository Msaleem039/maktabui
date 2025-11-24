import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createAssignment = createAsyncThunk(
  'assignment/createAssignment',
  async ({
    title,
    description,
    type,
    subject,
    classId,
    teacherId,
    totalMarks,
    dueDate,
    attachments,
    student
  }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createAssignment`,
        {
          title,
          description,
          type,
          subject,
          classId,
          teacherId,
          totalMarks,
          dueDate,
          attachments,
          student
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getAssignment = createAsyncThunk(
  'assignment/getAssignment',
  async ({ assessmentId } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAssignment`,
        assessmentId ? { assessmentId } : {}
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getAllAssignment = createAsyncThunk(
  'assignment/getAllAssignment',
  async (requestData = {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllAssignment`,
        requestData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getAssignmentByStudentId = createAsyncThunk(
  'assignment/getAssignmentByStudentId',
  async ({ studentId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAssignmentByStudentId`,
        { studentId }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const uploadSolution = createAsyncThunk(
  'assignment/uploadSolution',
  async ({ assignmentId, studentId, file }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadSolution`,
        {
          assignmentId,
          studentId,
          file
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  assignments: [],
  currentAssignment: null,
  studentAssignments: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  fetchStatus: 'idle',
  fetchError: null,
  uploadSolutionStatus: 'idle',
  uploadSolutionError: null,
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.fetchError = null;
      state.uploadSolutionError = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    clearStudentAssignments: (state) => {
      state.studentAssignments = [];
    },
    clearAssignments: (state) => {
      state.assignments = [];
    },
    clearUploadSolutionStatus: (state) => {
      state.uploadSolutionStatus = 'idle';
      state.uploadSolutionError = null;
    },
    updateSolutionInCurrentAssignment: (state, action) => {
      const { studentId, solutionData } = action.payload;
      if (state.currentAssignment && state.currentAssignment.solutions) {
        const existingIndex = state.currentAssignment.solutions.findIndex(
          s => s.student === studentId
        );
        
        if (existingIndex !== -1) {
          state.currentAssignment.solutions[existingIndex] = solutionData;
        } else {
          state.currentAssignment.solutions.push(solutionData);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.assignments.push(action.payload.assessment);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload;
      })
      .addCase(getAssignment.pending, (state) => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(getAssignment.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        if (action.payload.assessment) {
          state.currentAssignment = action.payload.assessment;
        } else {
          // All assignments
          state.assignments = action.payload.assessments;
        }
      })
      .addCase(getAssignment.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload;
      })
      .addCase(getAllAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = action.payload.assessments;
      })
      .addCase(getAllAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAssignmentByStudentId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAssignmentByStudentId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.studentAssignments = action.payload.assessments;
      })
      .addCase(getAssignmentByStudentId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadSolution.pending, (state) => {
        state.uploadSolutionStatus = 'loading';
        state.uploadSolutionError = null;
      })
      .addCase(uploadSolution.fulfilled, (state, action) => {
        state.uploadSolutionStatus = 'succeeded';
        
        const { solution, assignmentId } = action.payload;
        
        if (state.currentAssignment && state.currentAssignment._id === assignmentId) {
          const existingIndex = state.currentAssignment.solutions.findIndex(
            s => s.student === solution.student
          );
          
          if (existingIndex !== -1) {
            state.currentAssignment.solutions[existingIndex] = solution;
          } else {
            state.currentAssignment.solutions.push(solution);
          }
        }
        
        const assignmentIndex = state.assignments.findIndex(
          assignment => assignment._id === assignmentId
        );
        
        if (assignmentIndex !== -1) {
          const existingSolutionIndex = state.assignments[assignmentIndex].solutions.findIndex(
            s => s.student === solution.student
          );
          
          if (existingSolutionIndex !== -1) {
            state.assignments[assignmentIndex].solutions[existingSolutionIndex] = solution;
          } else {
            state.assignments[assignmentIndex].solutions.push(solution);
          }
        }
        
        const studentAssignmentIndex = state.studentAssignments.findIndex(
          assignment => assignment._id === assignmentId
        );
        
        if (studentAssignmentIndex !== -1) {
          const existingSolutionIndex = state.studentAssignments[studentAssignmentIndex].solutions.findIndex(
            s => s.student === solution.student
          );
          
          if (existingSolutionIndex !== -1) {
            state.studentAssignments[studentAssignmentIndex].solutions[existingSolutionIndex] = solution;
          } else {
            state.studentAssignments[studentAssignmentIndex].solutions.push(solution);
          }
        }
      })
      .addCase(uploadSolution.rejected, (state, action) => {
        state.uploadSolutionStatus = 'failed';
        state.uploadSolutionError = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateStatus,
  clearCurrentAssignment,
  clearStudentAssignments,
  clearAssignments,
  clearUploadSolutionStatus,
  updateSolutionInCurrentAssignment,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;