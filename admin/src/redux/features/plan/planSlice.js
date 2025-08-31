import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// 🔹 Fetch all plans
export const fetchPlans = createAsyncThunk("plans/fetchPlans", async () => {
  const snapshot = await getDocs(collection(db, "plans"));
  let plans = [];
  snapshot.forEach((docSnap) => {
    plans.push({ id: docSnap.id, ...docSnap.data() });
  });
  return plans;
});

// 🔹 Add new plan (with duplicate check)
export const addPlan = createAsyncThunk(
  "plans/addPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "plans"));
      let existingPlans = [];
      snapshot.forEach((docSnap) => {
        existingPlans.push({ id: docSnap.id, ...docSnap.data() });
      });

      const duplicate = existingPlans.find(
        (plan) =>
          plan.duration.toLowerCase() === planData.duration.toLowerCase() ||
          plan.price === planData.price
      );

      if (duplicate) {
        return rejectWithValue(
          "Plan with same duration or price already exists!"
        );
      }

      const docRef = await addDoc(collection(db, "plans"), {
        ...planData,
        createdAt: new Date().toISOString(),
      });

      return { id: docRef.id, ...planData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update plan
export const updatePlan = createAsyncThunk(
  "plans/updatePlan",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const planRef = doc(db, "plans", id);
      await updateDoc(planRef, updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete plan
export const deletePlan = createAsyncThunk(
  "plans/deletePlan",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "plans", id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Initial State
const initialState = {
  plans: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add plan
      .addCase(addPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans.push(action.payload);
      })
      .addCase(addPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Update plan
      .addCase(updatePlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, updates } = action.payload;
        const index = state.plans.findIndex((plan) => plan.id === id);
        if (index !== -1) {
          state.plans[index] = { ...state.plans[index], ...updates };
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Delete plan
      .addCase(deletePlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = state.plans.filter((plan) => plan.id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default plansSlice.reducer;
