import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db,auth } from "../../../../firebase"; 
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Async thunk to fetch supplement orders
export const fetchOrders = createAsyncThunk(
  "supplements/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Get current user from Firebase Auth
      const user = auth.currentUser;

      if (!user) {
        return rejectWithValue("User not logged in");
      }

      const q = query(
        collection(db, "supplementOrders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      let orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.message);
    }
  }
);

const supplementSlice = createSlice({
  name: "supplements",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default supplementSlice.reducer;
