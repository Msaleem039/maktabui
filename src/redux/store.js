import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/authSlices/userLoginSlice';

// Parent Slices
import {
  addToWaitListReducer,
  createParentReducer,
  getAllParentsReducer,
  getParentByIdReducer,
  getAllWaitListParentsReducer,
  removeFromWaitListReducer
} from './slices/parentSlices/parentSlice';

import {
  createStudentReducer,
  getAllStudentsReducer,
  getStudentByIdReducer,
  getAllWaitlistStudentsReducer,
  addToWaitlistStudentReducer,
  removeFromWaitlistStudentReducer
} from './slices/studentSlices/studentSlices';

import {
  createClassReducer,
  getAllClassesReducer,
  getAllClassesNameReducer
} from './slices/classSlices/classSlice';

import {
  createTeacherReducer,
  getAllTeachersReducer,
  getTeacherByIdReducer,
  updateTeacherReducer,
  deleteTeacherReducer,
  getTeachersNameReducer
} from './slices/teacherSlices/teacherSlices';

import {
  createAdminReducer,
  getAllAdminsReducer,
  getAdminByIdReducer,
  updateAdminReducer
} from './slices/adminSlices/adminSlices';

import {
  createTimetableReducer,
  getAllTimetablesReducer
} from './slices/timetableSlices/timetableSlices';

export const store = configureStore({
  reducer: {
    user: userReducer,

    // Parent
    createParent: createParentReducer,
    getAllParents: getAllParentsReducer,
    getParentById: getParentByIdReducer,
    waitlistParents: getAllWaitListParentsReducer,
    addToWaitList: addToWaitListReducer,
    removeFromWaitList: removeFromWaitListReducer,

    // Student
    createStudent: createStudentReducer,
    getAllStudents: getAllStudentsReducer,
    getStudentById: getStudentByIdReducer,
    waitlistStudents: getAllWaitlistStudentsReducer,
    addToWaitlistStudent: addToWaitlistStudentReducer,
    removeFromWaitlistStudent: removeFromWaitlistStudentReducer,

    // Class
    createClass: createClassReducer,
    getAllClasses: getAllClassesReducer,
    getAllClassesName: getAllClassesNameReducer,

    // Teacher
    createTeacher: createTeacherReducer,
    getAllTeachers: getAllTeachersReducer,
    getTeacherById: getTeacherByIdReducer,
    updateTeacher: updateTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    getTeachersName: getTeachersNameReducer,

    // ⭐ Admin
    createAdmin: createAdminReducer,
    getAllAdmins: getAllAdminsReducer,
    getAdminById: getAdminByIdReducer,
    updateAdmin: updateAdminReducer,

    // Timetable
    createTimetable: createTimetableReducer,
    getAllTimetables: getAllTimetablesReducer,
  },
});

export default store;
