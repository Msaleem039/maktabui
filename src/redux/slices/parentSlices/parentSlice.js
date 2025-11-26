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
  async (requestData = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { allParents } = state;

      const payload = {
        page: requestData.page || allParents.pagination?.currentPage || 1,
        limit: requestData.limit || allParents.pagination?.itemsPerPage || 10,
        search: requestData.search !== undefined ? requestData.search : allParents.search,
        ...requestData
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getAllParents`,
        payload
      );
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

export const getParentDashboard = createAsyncThunk(
  'dashboard/getParentDashboard',
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getParentDashboardStats`,
        { parentId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteParent = createAsyncThunk(
  `parent/deleteParent`,
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteParent`, { parentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
    parents: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    },
    status: "idle",
    error: null,
    search: "",
    filters: {}
  },
  reducers: {
    resetAllParentsState: (state) => {
      state.parents = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
      state.status = "idle";
      state.error = null;
      state.search = "";
      state.filters = {};
    },
    setParentsPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setParentsSearch: (state, action) => {
      state.search = action.payload;
    },
    setParentsLimit: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
    },
    clearParentsError: (state) => {
      state.error = null;
    },
    setParentsFilters: (state, action) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllParents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload.data || [];

        // Update pagination info
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination
          };
        }
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

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    keyMetrics: {
      myChildren: 0,
      pendingFees: 0,
      attendanceRate: 0,
      eventsCount: 0,
      loading: false,
      error: null
    },

    monthlyAttendance: {
      data: [],
      selectedYear: new Date().getFullYear(),
      loading: false,
      error: null
    },

    feeStats: {
      totalFeesPaid: 0,
      pendingFees: 0,
      nextDueDate: null,
      loading: false,
      error: null
    },

    upcomingEvents: {
      data: [],
      loading: false,
      error: null
    },

    recentPayments: {
      data: [],
      loading: false,
      error: null
    },

    pendingPayments: {
      data: [],
      loading: false,
      error: null
    },

    // ADD CHILD ATTENDANCE STATE
    childAttendance: {
      data: [],
      loading: false,
      error: null
    },

    parentInfo: {
      fullName: '',
      email: '',
      children: []
    },

    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {
    resetDashboard: (state) => {
      state.keyMetrics = {
        myChildren: 0,
        pendingFees: 0,
        attendanceRate: 0,
        eventsCount: 0,
        loading: false,
        error: null
      };
      state.monthlyAttendance = {
        data: [],
        selectedYear: new Date().getFullYear(),
        loading: false,
        error: null
      };
      state.feeStats = {
        totalFeesPaid: 0,
        pendingFees: 0,
        nextDueDate: null,
        loading: false,
        error: null
      };
      state.upcomingEvents = {
        data: [],
        loading: false,
        error: null
      };
      state.recentPayments = {
        data: [],
        loading: false,
        error: null
      };
      state.pendingPayments = {
        data: [],
        loading: false,
        error: null
      };
      // RESET CHILD ATTENDANCE
      state.childAttendance = {
        data: [],
        loading: false,
        error: null
      };
      state.parentInfo = {
        fullName: '',
        email: '',
        children: []
      };
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },

    setAttendanceYear: (state, action) => {
      state.monthlyAttendance.selectedYear = action.payload;
    },

    clearDashboardError: (state) => {
      state.error = null;
      state.keyMetrics.error = null;
      state.monthlyAttendance.error = null;
      state.feeStats.error = null;
      state.upcomingEvents.error = null;
      state.recentPayments.error = null;
      state.pendingPayments.error = null;
      state.childAttendance.error = null; // ADD THIS
    },

    updateMetrics: (state, action) => {
      if (action.payload.myChildren !== undefined) {
        state.keyMetrics.myChildren = action.payload.myChildren;
      }
      if (action.payload.pendingFees !== undefined) {
        state.keyMetrics.pendingFees = action.payload.pendingFees;
        state.feeStats.pendingFees = action.payload.pendingFees;
      }
      if (action.payload.attendanceRate !== undefined) {
        state.keyMetrics.attendanceRate = action.payload.attendanceRate;
      }
      if (action.payload.eventsCount !== undefined) {
        state.keyMetrics.eventsCount = action.payload.eventsCount;
      }
      if (action.payload.totalFeesPaid !== undefined) {
        state.feeStats.totalFeesPaid = action.payload.totalFeesPaid;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.keyMetrics.loading = true;
        state.monthlyAttendance.loading = true;
        state.feeStats.loading = true;
        state.upcomingEvents.loading = true;
        state.recentPayments.loading = true;
        state.pendingPayments.loading = true;
        state.childAttendance.loading = true; // ADD THIS
      })
      .addCase(getParentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();

        state.keyMetrics = {
          ...state.keyMetrics,
          myChildren: action.payload.keyMetrics.myChildren,
          pendingFees: action.payload.keyMetrics.pendingFees,
          attendanceRate: action.payload.keyMetrics.attendanceRate,
          eventsCount: action.payload.keyMetrics.eventsCount,
          loading: false,
          error: null
        };

        state.monthlyAttendance = {
          ...state.monthlyAttendance,
          data: action.payload.monthlyAttendance,
          loading: false,
          error: null
        };

        state.feeStats = {
          ...state.feeStats,
          totalFeesPaid: action.payload.feeStats.totalFeesPaid,
          pendingFees: action.payload.feeStats.pendingFees,
          nextDueDate: action.payload.feeStats.nextDueDate,
          loading: false,
          error: null
        };

        state.upcomingEvents = {
          ...state.upcomingEvents,
          data: action.payload.upcomingEvents,
          loading: false,
          error: null
        };

        state.recentPayments = {
          ...state.recentPayments,
          data: action.payload.recentPayments,
          loading: false,
          error: null
        };

        state.pendingPayments = {
          ...state.pendingPayments,
          data: action.payload.pendingPayments,
          loading: false,
          error: null
        };

        // ADD CHILD ATTENDANCE DATA
        state.childAttendance = {
          ...state.childAttendance,
          data: action.payload.childAttendance || [],
          loading: false,
          error: null
        };

        state.parentInfo = action.payload.parentInfo;
      })
      .addCase(getParentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.keyMetrics.loading = false;
        state.monthlyAttendance.loading = false;
        state.feeStats.loading = false;
        state.upcomingEvents.loading = false;
        state.recentPayments.loading = false;
        state.pendingPayments.loading = false;
        state.childAttendance.loading = false; // ADD THIS

        state.keyMetrics.error = action.payload;
        state.monthlyAttendance.error = action.payload;
        state.feeStats.error = action.payload;
        state.upcomingEvents.error = action.payload;
        state.recentPayments.error = action.payload;
        state.pendingPayments.error = action.payload;
        state.childAttendance.error = action.payload; // ADD THIS
      });
  }
});

const deleteParentSlice = createSlice({
  name: 'deleteParent',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null
  },
  reducers: {
    resetDeleteParent: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    clearDeleteParentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteParent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(deleteParent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const {
  resetAddWaitList,
} = addToWaitListSlice.actions;

export const {
  resetCreateParentState,
} = createParentSlice.actions;

export const {
  resetAllParentsState,
  setParentsPage,
  setParentsSearch,
  setParentsLimit,
  clearParentsError,
  setParentsFilters
} = getAllParentsSlice.actions;

export const {
  resetParentByIdState,
} = getParentByIdSlice.actions;

export const {
  resetWaitListParentsState,
} = getAllWaitListParentsSlice.actions;

export const {
  resetRemoveWaitList,
} = removeFromWaitListSlice.actions;

export const {
  resetParentsWithStudents,
} = getAllParentsWithStudentsSlice.actions;

export const {
  resetAddCardDetail,
  clearCardError,
} = addCardDetailSlice.actions;

export const {
  resetSetDefaultCard,
  clearSetDefaultCardError,
} = setDefaultCardSlice.actions;

export const {
  resetRemoveCard,
  clearRemoveCardError,
} = removeCardSlice.actions;

export const {
  resetDashboard,
  setAttendanceYear,
  clearDashboardError,
  updateMetrics,
} = dashboardSlice.actions;

export const {
  resetDeleteParent,
  clearDeleteParentError,
} = deleteParentSlice.actions;

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
export const parentDashboardReducer = dashboardSlice.reducer;
export const deleteParentReducer = deleteParentSlice.reducer;

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
  dashboard: parentDashboardReducer,
  deleteParent: deleteParentReducer,
};