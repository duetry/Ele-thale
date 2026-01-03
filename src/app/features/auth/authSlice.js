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
          phoneno: phoneNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

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

// 4️⃣ Validate Coupon
export const validateCoupon = createAsyncThunk(
  'auth/validateCoupon',
  async ({ couponId, userId }, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');

      const response = await fetch(
        `${API_BASE}/Update_CouponCode`,
        {
          method: 'POST',
          headers: {
            ...getHeaders(),
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            couponId,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Coupon validation failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
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

  // Coupon
  couponLoading: false,
  couponSuccess: null,
  couponError: null,

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
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("action" , action)
        state.loginLoading = false;
        state.user = action.payload || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.showLoginModal = false;
      })
      .addCase(loginUser.rejected, (state, action) => {

        state.loginLoading = false;
        state.loginError = action.payload;
      })

      // VALIDATE COUPON
      .addCase(validateCoupon.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
        state.couponSuccess = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.couponSuccess = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
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

export const selectCouponLoading = (state) => state.auth.couponLoading;
export const selectCouponSuccess = (state) => state.auth.couponSuccess;
export const selectCouponError = (state) => state.auth.couponError;

export default authSlice.reducer;
