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

export const getAssignmentAgainstTeacher = createAsyncThunk(
  'assignment/getAssignmentAgainstTeacher',
  async ({ teacherId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAssignmentAgainstTeacher`,
        { teacherId }
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
  teacherAssignments: [], // New state for teacher assignments
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  fetchStatus: 'idle',
  fetchError: null,
  uploadSolutionStatus: 'idle',
  uploadSolutionError: null,
  teacherAssignmentsStatus: 'idle', // New status for teacher assignments
  teacherAssignmentsError: null, // New error for teacher assignments
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
      state.teacherAssignmentsError = null; // Clear teacher assignments error
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
    clearTeacherAssignments: (state) => { // New reducer for teacher assignments
      state.teacherAssignments = [];
      state.teacherAssignmentsStatus = 'idle';
      state.teacherAssignmentsError = null;
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
    updateSolutionInTeacherAssignments: (state, action) => { // New reducer for teacher assignments
      const { assignmentId, studentId, solutionData } = action.payload;
      
      const assignmentIndex = state.teacherAssignments.findIndex(
        assignment => assignment._id === assignmentId
      );
      
      if (assignmentIndex !== -1 && state.teacherAssignments[assignmentIndex].solutions) {
        const existingIndex = state.teacherAssignments[assignmentIndex].solutions.findIndex(
          s => s.student === studentId
        );
        
        if (existingIndex !== -1) {
          state.teacherAssignments[assignmentIndex].solutions[existingIndex] = solutionData;
        } else {
          state.teacherAssignments[assignmentIndex].solutions.push(solutionData);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases...
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
        
        // Update current assignment
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
        
        // Update assignments list
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
        
        // Update student assignments
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
        
        // Update teacher assignments
        const teacherAssignmentIndex = state.teacherAssignments.findIndex(
          assignment => assignment._id === assignmentId
        );
        
        if (teacherAssignmentIndex !== -1) {
          const existingSolutionIndex = state.teacherAssignments[teacherAssignmentIndex].solutions.findIndex(
            s => s.student === solution.student
          );
          
          if (existingSolutionIndex !== -1) {
            state.teacherAssignments[teacherAssignmentIndex].solutions[existingSolutionIndex] = solution;
          } else {
            state.teacherAssignments[teacherAssignmentIndex].solutions.push(solution);
          }
        }
      })
      .addCase(uploadSolution.rejected, (state, action) => {
        state.uploadSolutionStatus = 'failed';
        state.uploadSolutionError = action.payload;
      })
      // New case for getAssignmentAgainstTeacher
      .addCase(getAssignmentAgainstTeacher.pending, (state) => {
        state.teacherAssignmentsStatus = 'loading';
        state.teacherAssignmentsError = null;
      })
      .addCase(getAssignmentAgainstTeacher.fulfilled, (state, action) => {
        state.teacherAssignmentsStatus = 'succeeded';
        state.teacherAssignments = action.payload.assignments;
      })
      .addCase(getAssignmentAgainstTeacher.rejected, (state, action) => {
        state.teacherAssignmentsStatus = 'failed';
        state.teacherAssignmentsError = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateStatus,
  clearCurrentAssignment,
  clearStudentAssignments,
  clearAssignments,
  clearTeacherAssignments, 
  clearUploadSolutionStatus,
  updateSolutionInCurrentAssignment,
  updateSolutionInTeacherAssignments, 
} = assignmentSlice.actions;

export default assignmentSlice.reducer;