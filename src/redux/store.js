import { configureStore } from '@reduxjs/toolkit';

// Auth slice
import userReducer from './slices/authSlices/userLoginSlice';

// Parent slices
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
  parentDashboardReducer
} from './slices/parentSlices/parentSlice';

// Student slices
import {
  createStudentReducer,
  getAllStudentsReducer,
  getStudentByIdReducer,
  getAllWaitlistStudentsReducer,
  addToWaitlistStudentReducer,
  removeFromWaitlistStudentReducer,
  getStudentNamesWithIdsReducer,
  getStudentDashboardStatsReducer,
  updateStudentReducer
} from './slices/studentSlices/studentSlices';

// Class slices
import {
  createClassReducer,
  getAllClassesReducer,
  getAllClassesNameReducer,
  getClassByIDReducer,
  updateClassReducer
} from './slices/classSlices/classSlice';

// Teacher slices
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

// Admin slices
import {
  createAdminReducer,
  getAllAdminsReducer,
  getAdminByIdReducer,
  updateAdminReducer
} from './slices/adminSlices/adminSlices';

// Timetable slices
import {
  createTimetableReducer,
  getAllTimetablesReducer
} from './slices/timetableSlices/timetableSlices';

// Invoice slices
import {
  getAllInvoicesReducer,
  getInvoicesStatsReducer,
  createInvoiceReducer,
  getInvoiceByIdReducer,
  updateInvoiceReducer
} from './slices/invoiceSlices/invoiceSlices';

// Payment slices
import {
  getAllPaymentStatsReducer
} from './slices/paymentSlices/paymentSlices';

// Dashboard
import { dashboardReducer } from "./slices/superadminSlices/superadminSlices";

// Other slices
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

    // Class management
    createClass: createClassReducer,
    getAllClasses: getAllClassesReducer,
    getAllClassesName: getAllClassesNameReducer,
    getClassByID: getClassByIDReducer,
    updateClass: updateClassReducer,

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