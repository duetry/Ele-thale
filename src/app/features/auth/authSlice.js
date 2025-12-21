// src/app/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE =
  'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

/* =========================================================
   SAFE LOCAL STORAGE HELPERS (SSR FIX)
   ========================================================= */

const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;

  const value = localStorage.getItem(key);

  if (!value || value === 'undefined' || value === 'null') {
    return null;
  }

  return value;
};


const setToStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/* =========================================================
   ASYNC THUNKS
   ========================================================= */

// 1️⃣ Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ phoneNumber, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/Login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          phoneno : phoneNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Store safely
      if (data.token) {
        setToStorage('authToken', data.token);
        setToStorage('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 2️⃣ Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    removeFromStorage('authToken');
    removeFromStorage('user');
    return true;
  }
);

// 3️⃣ Verify Token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      if (!token) throw new Error('No token');

      const response = await fetch(`${API_BASE}/verify`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        removeFromStorage('authToken');
        removeFromStorage('user');
        throw new Error('Token invalid');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   INITIAL STATE (SSR SAFE)
   ========================================================= */

const initialState = {
  user: (() => {
    const user = getFromStorage('user');
    return user ? JSON.parse(user) : null;
  })(),

  token: getFromStorage('authToken'),
  isAuthenticated: !!getFromStorage('authToken'),

  loginLoading: false,
  logoutLoading: false,
  verifyLoading: false,

  loginError: null,
  logoutError: null,
  verifyError: null,

  showLoginModal: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.showLoginModal = true;
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
      state.loginError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearLogoutError: (state) => {
      state.logoutError = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeFromStorage('authToken');
      removeFromStorage('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.showLoginModal = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const {
  openLoginModal,
  closeLoginModal,
  clearLoginError,
  clearLogoutError,
  clearAuth,
} = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectLoginError = (state) => state.auth.loginError;

export default authSlice.reducer;
