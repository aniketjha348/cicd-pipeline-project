import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import departmentReducer from './slices/departmentSlice';
import studentReducer from './slices/studentSlice';
import templateReducer from './slices/templateSlice';
import uiReducer from './slices/uiSlice';
import AuthApi from '../services/AuthService';
import collegeReducer from './slices/collegeSlice'
import {CollegeApi, adminAuthApi, CourseApi, facultyApi, dept } from '@/services/admin';
import { schoolErpApi } from '@/services/SchoolErpService';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    departments: departmentReducer,
    students: studentReducer,
    templates: templateReducer,
    ui: uiReducer,
    colleges: collegeReducer,
    [dept.reducerPath]: dept.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [CollegeApi.reducerPath]: CollegeApi.reducer,
    [facultyApi.reducerPath]: facultyApi.reducer,
    [CourseApi.reducerPath]: CourseApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [schoolErpApi.reducerPath]: schoolErpApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      AuthApi.middleware,
      CollegeApi.middleware,
      facultyApi.middleware,
      CourseApi.middleware,
      adminAuthApi.middleware,
      dept.middleware,
      schoolErpApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;