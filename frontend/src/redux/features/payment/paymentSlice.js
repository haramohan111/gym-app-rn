import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { db } from "../../../../firebase"; // your firebase.js config file
import { collection, getDocs } from "firebase/firestore";

const API_URL = "http://localhost:5000/api/v1/payment";

//  Create Order
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount, userId, duration }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create-order`, {
        amount,
        userId,
        duration,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Order creation failed");
    }
  }
);

// 2️ Verify Payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/verify-payment`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Verification failed");
    }
  }
);

// 3️ Fetch Payments
export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "payments"));
      const payments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return payments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    order: null,
    verified: false,
    error: null,
    payments: [],
    status: "idle", //  starts as idle
  },
  reducers: {
    resetPayment: (state) => {
      state.order = null;
      state.verified = false;
      state.error = null;
      state.status = "idle"; // reset back to idle
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.status = "idle"; // request in progress
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.status = "idle"; //  request in progress
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.verified = action.payload.success;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.status = "idle"; //  request in progress
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
