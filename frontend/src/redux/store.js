import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import planReducer from "./features/plan/planSlice"
import paymentReducer from './features/payment/paymentSlice'
import supplementReducer from "./features/supplement/supplementSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: planReducer,
    payment: paymentReducer,
    supplements: supplementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables check
    }),
});
