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

// LOGIN
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ phoneNumber, password }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE}/Login`, {
//         method: 'POST',
//         headers: getHeaders(),
//         body: JSON.stringify({
//           phoneno: phoneNumber,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }
// console.log("data" , data?.user_id)
//       if (data.token) {
//         setToStorage('authToken', data.token);
//         setToStorage('user', JSON.stringify(data.user));
//         setToStorage('userId', data?.user_id); // ✅ ADDED ONLY
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ phoneno, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/Login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          phoneno,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log("data", data?.user_id);

      if (data.token) {
        setToStorage('authToken', data.token);
        setToStorage('user', JSON.stringify(data));
        setToStorage('userId', data?.user_id);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    removeFromStorage('authToken');
    removeFromStorage('user');
    removeFromStorage('userId'); // ✅ ADDED ONLY
    return true;
  }
);

// VERIFY TOKEN
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
        removeFromStorage('userId'); // ✅ ADDED ONLY
        throw new Error('Token invalid');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// VALIDATE COUPON
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

// SEND OTP
export const sentOtp = createAsyncThunk(
  'auth/sentOtp',
  async ({ phoneNumber, action = 'send' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/Login/OTP_Send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          phoneno: phoneNumber,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/GET_OTP_Validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          phoneno: phoneNumber,
          otp,
        }),
      });

      const data = await response.json();

      if (data.token) {
        setToStorage('authToken', data.token);
        setToStorage('user', JSON.stringify(data.user || data));
        setToStorage('userId', data.user_id); // ✅ ADDED ONLY
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */

const initialState = {
  user: (() => {
    const user = getFromStorage('user');
    return user ? JSON.parse(user) : null;
  })(),

  userId: getFromStorage('userId'), // ✅ ADDED ONLY

  token: getFromStorage('authToken'),
  isAuthenticated: !!getFromStorage('authToken'),

  loginLoading: false,
  logoutLoading: false,
  verifyLoading: false,

  loginError: null,
  logoutError: null,
  verifyError: null,

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
      state.userId = null; // ✅ ADDED ONLY
      state.token = null;
      state.isAuthenticated = false;
      removeFromStorage('authToken');
      removeFromStorage('user');
      removeFromStorage('userId'); // ✅ ADDED ONLY
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
      })
   .addCase(loginUser.fulfilled, (state, action) => {
  state.loginLoading = false;
  state.user = action.payload || null; // unchanged
  state.userId = action.payload?.user_id || null; // ✅ FIXED
  state.token = action.payload.token || null;
  state.isAuthenticated = true;
  state.showLoginModal = false;
})
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      })

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
      })

      .addCase(sentOtp.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
        state.couponSuccess = null;
      })
      .addCase(sentOtp.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.couponSuccess = action.payload;
      })
      .addCase(sentOtp.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
        state.couponSuccess = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
  state.loginLoading = false;
  state.user = action.payload || null; // unchanged
  state.userId = action.payload?.user_id || null; // ✅ FIXED
  state.token = action.payload.token || null;
  state.isAuthenticated = true;
  state.showLoginModal = false;
})
      .addCase(verifyOtp.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS (UNCHANGED + ONE ADDITION)
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
export const selectUserId = (state) => state.auth.userId; // ✅ NEW
export const selectToken = (state) => state.auth.token;

export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectLoginError = (state) => state.auth.loginError;

export const selectCouponLoading = (state) => state.auth.couponLoading;
export const selectCouponSuccess = (state) => state.auth.couponSuccess;
export const selectCouponError = (state) => state.auth.couponError;

export default authSlice.reducer;