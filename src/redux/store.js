import { configureStore } from '@reduxjs/toolkit';
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
  addCardDetailReducer
} from './slices/parentSlices/parentSlice';

// Student slices
import {
  createStudentReducer,
  getAllStudentsReducer,
  getStudentByIdReducer,
  getAllWaitlistStudentsReducer,
  addToWaitlistStudentReducer,
  removeFromWaitlistStudentReducer
} from './slices/studentSlices/studentSlices';

// Class slices
import {
  createClassReducer,
  getAllClassesReducer,
  getAllClassesNameReducer
} from './slices/classSlices/classSlice';

// Teacher slices
import {
  createTeacherReducer,
  getAllTeachersReducer,
  getTeacherByIdReducer,
  updateTeacherReducer,
  deleteTeacherReducer,
  getTeachersNameReducer
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
  createInvoiceReducer
} from './slices/invoiceSlices/invoiceSlices';

// Payment slices
import {
  getAllPaymentStatsReducer
} from './slices/paymentSlices/paymentSlices';

export const store = configureStore({
  reducer: {
    user: userReducer,

    // Parent reducers
    createParent: createParentReducer,
    getAllParents: getAllParentsReducer,
    getParentById: getParentByIdReducer,
    waitlistParents: getAllWaitListParentsReducer,
    addToWaitList: addToWaitListReducer,
    removeFromWaitList: removeFromWaitListReducer,
    getAllParentsWithStudents: getAllParentsWithStudentsReducer,
    addCardDetail: addCardDetailReducer,

    // Student reducers
    createStudent: createStudentReducer,
    getAllStudents: getAllStudentsReducer,
    getStudentById: getStudentByIdReducer,
    waitlistStudents: getAllWaitlistStudentsReducer,
    addToWaitlistStudent: addToWaitlistStudentReducer,
    removeFromWaitlistStudent: removeFromWaitlistStudentReducer,

    // Class reducers
    createClass: createClassReducer,
    getAllClasses: getAllClassesReducer,
    getAllClassesName: getAllClassesNameReducer,

    // Teacher reducers
    createTeacher: createTeacherReducer,
    getAllTeachers: getAllTeachersReducer,
    getTeacherById: getTeacherByIdReducer,
    updateTeacher: updateTeacherReducer,
    deleteTeacher: deleteTeacherReducer,
    getTeachersName: getTeachersNameReducer,

    // Admin reducers
    createAdmin: createAdminReducer,
    getAllAdmins: getAllAdminsReducer,
    getAdminById: getAdminByIdReducer,
    updateAdmin: updateAdminReducer,

    // Timetable reducers
    createTimetable: createTimetableReducer,
    getAllTimetables: getAllTimetablesReducer,

    // Invoice reducers
    getAllInvoices: getAllInvoicesReducer,
    getInvoicesStats: getInvoicesStatsReducer,
    createInvoice: createInvoiceReducer,

    // Payment reducers
    getAllPaymentStats: getAllPaymentStatsReducer
  },
});

export default store;