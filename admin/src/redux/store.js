// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import useReducer  from './features/user/userSlice';
import planReducer from './features/plan/planSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users:useReducer,
    plans:planReducer
  },
});