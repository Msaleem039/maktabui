import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/authSlices/userLoginSlice';

import {
  addToWaitListReducer,
  createParentReducer,
  getAllParentsReducer,
  getParentByIdReducer,
  getAllWaitListParentsReducer,
  removeFromWaitListReducer,
  getAllParentsWithStudentsReducer,
  addCardDetailReducer,
  setDefaultCardReducer,
  removeCardReducer,
  parentDashboardReducer,
  deleteParentReducer 
} from './slices/parentSlices/parentSlice';

import {
  createStudentReducer,
  getAllStudentsReducer,
  getStudentByIdReducer,
  getAllWaitlistStudentsReducer,
  addToWaitlistStudentReducer,
  removeFromWaitlistStudentReducer,
  getStudentNamesWithIdsReducer,
  getStudentDashboardStatsReducer,
  updateStudentReducer,
  deleteStudentReducer
} from './slices/studentSlices/studentSlices';

import {
  createClassReducer,
  getAllClassesReducer,
  getAllClassesNameReducer,
  getClassByIDReducer,
  updateClassReducer,
  deleteClassReducer
} from './slices/classSlices/classSlice';

import {
  createTeacherReducer,
  getAllTeachersReducer,
  getTeacherByIdReducer,
  updateTeacherReducer,
  deleteTeacherReducer,
  getTeachersNameReducer,
  getTeacherDetailReducer,
  teacherDashboardReducer
} from './slices/teacherSlices/teacherSlices';

import {
  createAdminReducer,
  getAllAdminsReducer,
  getAdminByIdReducer,
  updateAdminReducer
} from './slices/adminSlices/adminSlices';

import {
  createTimetableReducer,
  getAllTimetablesReducer,
  deleteTimeTableReducer
} from './slices/timetableSlices/timetableSlices';

import {
  getAllInvoicesReducer,
  getInvoicesStatsReducer,
  createInvoiceReducer,
  getInvoiceByIdReducer,
  updateInvoiceReducer
} from './slices/invoiceSlices/invoiceSlices';

import {
  getAllPaymentStatsReducer
} from './slices/paymentSlices/paymentSlices';

import { dashboardReducer } from "./slices/superadminSlices/superadminSlices";

import attendanceReducer from './slices/attendanceSlices/attendanceSlices';
import gradeReducer from './slices/gradeSlices/gradeSlices';
import assignmentReducer from './slices/assignmentSlices/assignmentSlices';

export const store = configureStore({
  reducer: {
    // Authentication
    user: userReducer,

    // Parent management
    createParent: createParentReducer,
    getAllParents: getAllParentsReducer,
    getParentById: getParentByIdReducer,
    waitlistParents: getAllWaitListParentsReducer,
    addToWaitList: addToWaitListReducer,
    removeFromWaitList: removeFromWaitListReducer,
    getAllParentsWithStudents: getAllParentsWithStudentsReducer,
    addCardDetail: addCardDetailReducer,
    setDefaultCard: setDefaultCardReducer,
    removeCard: removeCardReducer,
    parentDashboard: parentDashboardReducer,
    deleteParent: deleteParentReducer, // ADD THIS

    // Student management
    createStudent: createStudentReducer,
    getAllStudents: getAllStudentsReducer,
    getStudentById: getStudentByIdReducer,
    waitlistStudents: getAllWaitlistStudentsReducer,
    addToWaitlistStudent: addToWaitlistStudentReducer,
    removeFromWaitlistStudent: removeFromWaitlistStudentReducer,
    getStudentNamesWithIds: getStudentNamesWithIdsReducer,
    getStudentDashboardStats: getStudentDashboardStatsReducer,
    updateStudent: updateStudentReducer,
    deleteStudent: deleteStudentReducer, 

    // Class management
    createClass: createClassReducer,
    getAllClasses: getAllClassesReducer,
    getAllClassesName: getAllClassesNameReducer,
    getClassByID: getClassByIDReducer,
    updateClass: updateClassReducer,
    deleteClass: deleteClassReducer, // ADD THIS

    // Teacher management
    createTeacher: createTeacherReducer,
    getAllTeachers: getAllTeachersReducer,
    getTeacherById: getTeacherByIdReducer,
    updateTeacher: updateTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    getTeachersName: getTeachersNameReducer,
    getTeacherDetail: getTeacherDetailReducer,
    teacherDashboard: teacherDashboardReducer,

    // Admin management
    createAdmin: createAdminReducer,
    getAllAdmins: getAllAdminsReducer,
    getAdminById: getAdminByIdReducer,
    updateAdmin: updateAdminReducer,

    // Academic management
    createTimetable: createTimetableReducer,
    getAllTimetables: getAllTimetablesReducer,
    deleteTimeTable: deleteTimeTableReducer, // ADD THIS
    attendance: attendanceReducer,
    grade: gradeReducer,
    assignment: assignmentReducer,

    // Financial management
    getAllInvoices: getAllInvoicesReducer,
    getInvoicesStats: getInvoicesStatsReducer,
    createInvoice: createInvoiceReducer,
    getAllPaymentStats: getAllPaymentStatsReducer,
    getInvoiceById: getInvoiceByIdReducer,
    updateInvoice: updateInvoiceReducer,
    
    // Dashboard
    dashboard: dashboardReducer,
  },
});

export default store;