// src/app/features/admin/adminPanelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE = 'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/* =========================================================
   SAFE LOCAL STORAGE HELPERS (SSR FIX)
   ========================================================= */

const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  if (!value || value === 'undefined' || value === 'null') return null;
  return value;
};

/* =========================================================
   ASYNC THUNKS
   ========================================================= */

// 1️⃣ POST Search Log
export const postSearchLog = createAsyncThunk(
  'admin/postSearchLog',
  async ({ searchKeywords }, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      const response = await fetch(`${API_BASE}/GET_SearchLog`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          Searchkeywords: searchKeywords,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log search');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 2️⃣ GET Search Log (with or without phoneno)
export const getSearchLog = createAsyncThunk(
  'admin/getSearchLog',
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      let url = `${API_BASE}/GET_SearchLog`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch search logs');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 3️⃣ GET Coupon Code List (with or without phoneno)
export const getCouponCodeList = createAsyncThunk(
  'admin/getCouponCodeList',
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      let url = `${API_BASE}/GET_CouponCode_List`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch coupon codes');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 4️⃣ GET Login User Details (with or without phoneno)
export const getLoginUserDetails = createAsyncThunk(
  'admin/getLoginUserDetails',
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      let url = `${API_BASE}/GET_LoginUserDetails`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user details');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */

const initialState = {
  // Search Log
  searchLogs: [],
  searchLogLoading: false,
  searchLogError: null,

  // Coupon Codes
  couponCodes: [],
  couponLoading: false,
  couponError: null,

  // Login User Details
  loginUsers: [],
  userDetailLoading: false,
  userDetailError: null,

  // POST Search Log
  postSearchLoading: false,
  postSearchError: null,
  postSearchSuccess: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const adminPanelSlice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    clearSearchLogError: (state) => {
      state.searchLogError = null;
    },
    clearCouponError: (state) => {
      state.couponError = null;
    },
    clearUserDetailError: (state) => {
      state.userDetailError = null;
    },
    clearPostSearchStatus: (state) => {
      state.postSearchError = null;
      state.postSearchSuccess = false;
    },
    resetAdminState: () => initialState,
  },
  extraReducers: (builder) => {
    // POST Search Log
    builder
      .addCase(postSearchLog.pending, (state) => {
        state.postSearchLoading = true;
        state.postSearchError = null;
        state.postSearchSuccess = false;
      })
      .addCase(postSearchLog.fulfilled, (state) => {
        state.postSearchLoading = false;
        state.postSearchSuccess = true;
      })
      .addCase(postSearchLog.rejected, (state, action) => {
        state.postSearchLoading = false;
        state.postSearchError = action.payload;
      })

      // GET Search Log
      .addCase(getSearchLog.pending, (state) => {
        state.searchLogLoading = true;
        state.searchLogError = null;
      })
      .addCase(getSearchLog.fulfilled, (state, action) => {
        state.searchLogLoading = false;
        state.searchLogs = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getSearchLog.rejected, (state, action) => {
        state.searchLogLoading = false;
        state.searchLogError = action.payload;
      })

      // GET Coupon Code List
      .addCase(getCouponCodeList.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(getCouponCodeList.fulfilled, (state, action) => {
        console.log("action"  , action)
        state.couponLoading = false;
        state.couponCodes =  action.payload?.data;
      })
      .addCase(getCouponCodeList.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })

      // GET Login User Details
      .addCase(getLoginUserDetails.pending, (state) => {
        state.userDetailLoading = true;
        state.userDetailError = null;
      })
      .addCase(getLoginUserDetails.fulfilled, (state, action) => {
        state.userDetailLoading = false;
        state.loginUsers = Array.isArray(action.payload) ? action.payload?.data : [action.payload?.data];
      })
      .addCase(getLoginUserDetails.rejected, (state, action) => {
        state.userDetailLoading = false;
        state.userDetailError = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const {
  clearSearchLogError,
  clearCouponError,
  clearUserDetailError,
  clearPostSearchStatus,
  resetAdminState,
} = adminPanelSlice.actions;

// Selectors
export const selectSearchLogs = (state) => state.adminPanel.searchLogs;
export const selectSearchLogLoading = (state) => state.adminPanel.searchLogLoading;
export const selectSearchLogError = (state) => state.adminPanel.searchLogError;

export const selectCouponCodes = (state) => state.adminPanel.couponCodes;
export const selectCouponLoading = (state) => state.adminPanel.couponLoading;
export const selectCouponError = (state) => state.adminPanel.couponError;

export const selectLoginUsers = (state) => state.adminPanel.loginUsers;
export const selectUserDetailLoading = (state) => state.adminPanel.userDetailLoading;
export const selectUserDetailError = (state) => state.adminPanel.userDetailError;

export const selectPostSearchLoading = (state) => state.adminPanel.postSearchLoading;
export const selectPostSearchError = (state) => state.adminPanel.postSearchError;
export const selectPostSearchSuccess = (state) => state.adminPanel.postSearchSuccess;

export default adminPanelSlice.reducer;