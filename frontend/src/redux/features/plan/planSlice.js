// src/redux/slices/planSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../../firebase"; // your firebase.js config file
import { collection, getDocs } from "firebase/firestore";

// Async thunk to fetch plans
export const fetchPlans = createAsyncThunk("plans/fetchPlans", async () => {
  const querySnapshot = await getDocs(collection(db, "plans"));
  const plans = [];
  querySnapshot.forEach((doc) => {
    plans.push({ id: doc.id, ...doc.data() });
  });
  return plans;
});

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default planSlice.reducer;
