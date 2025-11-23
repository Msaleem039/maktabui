import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const setDefaultCard = createAsyncThunk(
  `parent/setDefaultCard`,
  async ({ parentId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setDefaultCard`, {
        parentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeCard = createAsyncThunk(
  `parent/removeCard`,
  async ({ parentId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/removeCard`, {
        parentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCardDetail = createAsyncThunk(
  `parent/addCardDetail`,
  async (cardData, { rejectWithValue }) => {
    console.log(`cardData`, cardData);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addCardDetail`, cardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWaitList = createAsyncThunk(
  `waitlist/add`,
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/parent/addWaitlist`, { id: parentId });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createParent = createAsyncThunk(
  `parent/createParent`,
  async (parentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createParent`, parentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllParents = createAsyncThunk(
  `parents/getAllParents`,
  async (parentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllParents`, parentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getParentById = createAsyncThunk(
  `parent/getParentById`,
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getParentById`, { id: parentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllWaitListParents = createAsyncThunk(
  `parent/getAllWaitListParents`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllWaitListParents`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromWaitList = createAsyncThunk(
  `waitlist/remove`,
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/removeWaitlist`, { id: parentId });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllParentsWithStudents = createAsyncThunk(
  `parentsWithStudents/fetch`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllParentsWithStudents`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getAllParentsWithStudentsSlice = createSlice({
  name: "parentsWithStudents",
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {
    resetParentsWithStudents: (state) => {
      state.loading = false;
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParentsWithStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllParentsWithStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getAllParentsWithStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const addCardDetailSlice = createSlice({
  name: 'addCardDetail',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetAddCardDetail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearCardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCardDetail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addCardDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addCardDetail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

const addToWaitListSlice = createSlice({
  name: 'addToWaitList',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetAddWaitList: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWaitList.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addToWaitList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addToWaitList.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

const createParentSlice = createSlice({
  name: "createParent",
  initialState: {
    parent: null,
    student: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetCreateParentState: (state) => {
      state.parent = null;
      state.student = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createParent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createParent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parent = action.payload.parent;
        state.student = action.payload.student;
      })
      .addCase(createParent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getAllParentsSlice = createSlice({
  name: "allParents",
  initialState: {
    parents: null,
    pagination: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetAllParentsState: (state) => {
      state.parents = null;
      state.pagination = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllParents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllParents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getParentByIdSlice = createSlice({
  name: "parentById",
  initialState: {
    parent: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetParentByIdState: (state) => {
      state.parent = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getParentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parent = action.payload.data;
      })
      .addCase(getParentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const getAllWaitListParentsSlice = createSlice({
  name: "waitListParents",
  initialState: {
    parents: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetWaitListParentsState: (state) => {
      state.parents = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllWaitListParents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllWaitListParents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload.data || [];
      })
      .addCase(getAllWaitListParents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

const removeFromWaitListSlice = createSlice({
  name: 'removeFromWaitList',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetRemoveWaitList: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeFromWaitList.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeFromWaitList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(removeFromWaitList.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

const setDefaultCardSlice = createSlice({
  name: 'setDefaultCard',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetSetDefaultCard: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearSetDefaultCardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setDefaultCard.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(setDefaultCard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(setDefaultCard.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

const removeCardSlice = createSlice({
  name: 'removeCard',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetRemoveCard: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearRemoveCardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeCard.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(removeCard.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const { resetAddWaitList } = addToWaitListSlice.actions;
export const { resetCreateParentState } = createParentSlice.actions;
export const { resetAllParentsState } = getAllParentsSlice.actions;
export const { resetParentByIdState } = getParentByIdSlice.actions;
export const { resetWaitListParentsState } = getAllWaitListParentsSlice.actions;
export const { resetRemoveWaitList } = removeFromWaitListSlice.actions;
export const { resetParentsWithStudents } = getAllParentsWithStudentsSlice.actions;
export const { resetAddCardDetail, clearCardError } = addCardDetailSlice.actions;
export const { resetSetDefaultCard, clearSetDefaultCardError } = setDefaultCardSlice.actions;
export const { resetRemoveCard, clearRemoveCardError } = removeCardSlice.actions;

// Export Reducers
export const addToWaitListReducer = addToWaitListSlice.reducer;
export const createParentReducer = createParentSlice.reducer;
export const getAllParentsReducer = getAllParentsSlice.reducer;
export const getParentByIdReducer = getParentByIdSlice.reducer;
export const getAllWaitListParentsReducer = getAllWaitListParentsSlice.reducer;
export const removeFromWaitListReducer = removeFromWaitListSlice.reducer;
export const getAllParentsWithStudentsReducer = getAllParentsWithStudentsSlice.reducer;
export const addCardDetailReducer = addCardDetailSlice.reducer;
export const setDefaultCardReducer = setDefaultCardSlice.reducer;
export const removeCardReducer = removeCardSlice.reducer;

export default getAllParentsWithStudentsSlice.reducer;

export const parentReducer = {
  addToWaitList: addToWaitListReducer,
  createParent: createParentReducer,
  getAllParents: getAllParentsReducer,
  getParentById: getParentByIdReducer,
  getAllWaitListParents: getAllWaitListParentsReducer,
  removeFromWaitList: removeFromWaitListReducer,
  getAllParentsWithStudents: getAllParentsWithStudentsReducer,
  addCardDetail: addCardDetailReducer,
  setDefaultCard: setDefaultCardReducer,
  removeCard: removeCardReducer,
};