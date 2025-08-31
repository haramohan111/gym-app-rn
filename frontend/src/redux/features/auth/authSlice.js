// src/redux/features/auth/authSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateEmail, updatePassword } from "firebase/auth"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const initialState = {
  user: null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// 🔹 Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName} ${lastName}`;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: fullName });

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        firstName,
        lastName,
        fullName,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      return { uid: user.uid, email: user.email, firstName, lastName, fullName, role: "user" };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch profile from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { uid: user.uid, email: user.email, ...docSnap.data() };
      } else {
        return { uid: user.uid, email: user.email, role: "user" };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Fetch User (profile from Firestore only)
export const fetchUser = createAsyncThunk("auth/fetchUser", async (uid, { rejectWithValue }) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid, ...docSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Update Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updates, { rejectWithValue, getState }) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      const stateUser = getState().auth.user || {};

      // Build fullName
      const fullName =
        updates.firstName || updates.lastName
          ? `${updates.firstName || stateUser.firstName} ${updates.lastName || stateUser.lastName}`
          : stateUser.fullName;

      // 🔹 Update Firebase Auth (displayName, photo)
      if (updates.firstName || updates.lastName || updates.avatar) {
        await updateProfile(currentUser, {
          displayName: fullName,
          photoURL: updates.avatar || currentUser.photoURL,
        });
      }

      // 🔹 Update Firebase Auth (email)
      if (updates.email && updates.email !== currentUser.email) {
        await updateEmail(currentUser, updates.email);
      }

      // 🔹 Update Firebase Auth (password)
      if (updates.password && updates.password.length >= 6) {
        await updatePassword(currentUser, updates.password);
      }

      // 🔹 Update Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { ...updates, fullName });

      return { ...stateUser, ...updates, fullName };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// 🔹 Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOut(auth);
});

// 🔹 Keep user logged in (auth persistence)
export const checkAuthState = createAsyncThunk("auth/checkAuthState", async (_, { rejectWithValue }) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          resolve({ uid: user.uid, email: user.email, ...docSnap.data() });
        } else {
          resolve({ uid: user.uid, email: user.email });
        }
      } else {
        resolve(null);
      }
    });
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch User
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })

      // Auth persistence
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
