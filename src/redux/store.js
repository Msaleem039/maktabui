import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userLoginSlice';
import parentReducer from './slices/createParentSlice';
import getAllParentsReducer from './slices/getAllParentsSlice';
import getParentsByIdReducer from './slices/getParentsByIdSlice';
import getWaitListParentReducer from './slices/getWaitListParentSlice';
import addToWaitListReducer from './slices/addToWaitlistSlice';
import removeFromWaitListReducer from './slices/removeFromWaitList';

export const store = configureStore({
  reducer: {
    user: userReducer,
    parent: parentReducer,
    allParents: getAllParentsReducer,
    parentById: getParentsByIdReducer,
    waitlistParents: getWaitListParentReducer,
    addToWaitList: addToWaitListReducer,
    removeFromWaitList: removeFromWaitListReducer
  },
});

export default store;