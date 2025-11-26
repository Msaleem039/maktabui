import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createClassAction = createAsyncThunk(
  `classes/createClass`,
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createClass`, formData);
      return res.data.class;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllClassesAction = createAsyncThunk(
  `classes/getAllClasses`,
  async (requestData = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { getAllClasses } = state;
      
      const payload = {
        page: requestData.page || getAllClasses.pagination.currentPage,
        limit: requestData.limit || 10,
        ...requestData
      };

      if (requestData.search === undefined && getAllClasses.search) {
        payload.search = getAllClasses.search;
      }

      if (requestData.filters === undefined && Object.keys(getAllClasses.filters).length > 0) {
        payload.filters = getAllClasses.filters;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllClasses`,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllClassesNameAction = createAsyncThunk(
  `classes/getAllClassesName`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllClassesName`);
      return res.data.classes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getClassByIDAction = createAsyncThunk(
  `classes/getClassByID`,
  async (classId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getClassByID`,{classId}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateClassAction = createAsyncThunk(
  `classes/updateClass`,
  async (updateData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateClass`,
        updateData
      );
      return res.data.class;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  `class/deleteClass`,
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteClass`, { classId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const createClassSlice = createSlice({
  name: "createClass",
  initialState: { loading: false, class: null, error: null },
  reducers: {
    clearClassError: (state) => {
      state.error = null;
    },
    resetClassState: (state) => {
      state.loading = false;
      state.class = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClassAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClassAction.fulfilled, (state, action) => {
        state.loading = false;
        state.class = action.payload;
        state.error = null;
      })
      .addCase(createClassAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllClassesSlice = createSlice({
  name: "getAllClasses",
  initialState: { 
    loading: false, 
    classes: [], 
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false
    },
    search: "",
    filters: {}
  },
  reducers: {
    clearAllClassesError: (state) => {
      state.error = null;
    },
    resetAllClassesState: (state) => {
      state.loading = false;
      state.classes = [];
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false
      };
      state.search = "";
      state.filters = {};
    },
    setAllClassesPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setAllClassesSearch: (state, action) => {
      state.search = action.payload;
    },
    setAllClassesFilters: (state, action) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllClassesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClassesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes || action.payload;
        
        if (action.payload.classes !== undefined) {
          state.classes = action.payload.classes;
          state.pagination = {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 0,
            totalCount: action.payload.totalCount || action.payload.count || 0,
            hasNextPage: action.payload.hasNextPage || false,
            hasPrevPage: action.payload.hasPrevPage || false
          };
        } else {
          // Old format without pagination
          state.classes = action.payload;
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalCount: action.payload.length || 0,
            hasNextPage: false,
            hasPrevPage: false
          };
        }
        
        state.error = null;
      })
      .addCase(getAllClassesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getAllClassesNameSlice = createSlice({
  name: "getAllClassesName",
  initialState: { loading: false, classNames: [], error: null },
  reducers: {
    clearClassNamesError: (state) => {
      state.error = null;
    },
    resetClassNamesState: (state) => {
      state.loading = false;
      state.classNames = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllClassesNameAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClassesNameAction.fulfilled, (state, action) => {
        state.loading = false;
        state.classNames = action.payload;
        state.error = null;
      })
      .addCase(getAllClassesNameAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getClassByIDSlice = createSlice({
  name: "getClassByID",
  initialState: { 
    loading: false, 
    classDetails: null, 
    students: [], 
    error: null 
  },
  reducers: {
    clearClassDetailsError: (state) => {
      state.error = null;
    },
    resetClassDetailsState: (state) => {
      state.loading = false;
      state.classDetails = null;
      state.students = [];
      state.error = null;
    },
    updateClassDetails: (state, action) => {
      if (state.classDetails) {
        state.classDetails = { ...state.classDetails, ...action.payload };
      }
    },
    updateStudentInClass: (state, action) => {
      const { studentId, updates } = action.payload;
      const studentIndex = state.students.findIndex(student => student._id === studentId);
      if (studentIndex !== -1) {
        state.students[studentIndex] = { ...state.students[studentIndex], ...updates };
      }
    },
    removeStudentFromClass: (state, action) => {
      const studentId = action.payload;
      state.students = state.students.filter(student => student._id !== studentId);
      if (state.classDetails && state.classDetails.studentCount) {
        state.classDetails.studentCount -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClassByIDAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassByIDAction.fulfilled, (state, action) => {
        state.loading = false;
        state.classDetails = action.payload.class;
        state.students = action.payload.students;
        state.error = null;
      })
      .addCase(getClassByIDAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const updateClassSlice = createSlice({
  name: "updateClass",
  initialState: { loading: false, class: null, error: null },
  reducers: {
    clearUpdateClassError: (state) => {
      state.error = null;
    },
    resetUpdateClassState: (state) => {
      state.loading = false;
      state.class = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateClassAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassAction.fulfilled, (state, action) => {
        state.loading = false;
        state.class = action.payload;
        state.error = null;
      })
      .addCase(updateClassAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const deleteClassSlice = createSlice({
  name: 'deleteClass',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetDeleteClass: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearDeleteClassError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearClassError, 
  resetClassState 
} = createClassSlice.actions;

export const { 
  clearAllClassesError, 
  resetAllClassesState,
  setAllClassesPage
} = getAllClassesSlice.actions;

export const { 
  clearClassNamesError, 
  resetClassNamesState 
} = getAllClassesNameSlice.actions;

export const { 
  clearClassDetailsError, 
  resetClassDetailsState,
  updateClassDetails,
  updateStudentInClass,
  removeStudentFromClass
} = getClassByIDSlice.actions;

export const { 
  clearUpdateClassError, 
  resetUpdateClassState 
} = updateClassSlice.actions;

export const { 
  resetDeleteClass, 
  clearDeleteClassError 
} = deleteClassSlice.actions;

export const createClassReducer = createClassSlice.reducer;
export const getAllClassesReducer = getAllClassesSlice.reducer;
export const getAllClassesNameReducer = getAllClassesNameSlice.reducer;
export const getClassByIDReducer = getClassByIDSlice.reducer;
export const updateClassReducer = updateClassSlice.reducer;
export const deleteClassReducer = deleteClassSlice.reducer;

export const classReducer = {
  createClass: createClassReducer,
  getAllClasses: getAllClassesReducer,
  getAllClassesName: getAllClassesNameReducer,
  getClassByID: getClassByIDReducer,
  updateClass: updateClassReducer,
  deleteClass: deleteClassReducer, 
};