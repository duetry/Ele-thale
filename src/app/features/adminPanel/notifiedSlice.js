// src/app/features/adminPanel/notifiedSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE =
  "https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/* =========================================================
   STORAGE HELPER
   ========================================================= */

const getFromStorage = (key) => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") return null;
  return value;
};

/* =========================================================
   THUNKS
   ========================================================= */

// ✅ GET Flash Deals
export const getNotified = createAsyncThunk(
  "notified/getNotified",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/GET_NotifyDetails`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch flash deals");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   STATE
   ========================================================= */

const initialState = {
  notified: [],
  loading: false,
  error: null,
  success: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const notifiedSlice = createSlice({
  name: "notified",
  initialState,
  reducers: {
    clearFlashDealStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    resetFlashDeals: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getNotified.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotified.fulfilled, (state, action) => {
        state.loading = false;
        state.notified = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getNotified.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearFlashDealStatus, resetFlashDeals } = notifiedSlice.actions;

export const selectNotified = (state) => state.notified.notified;
export const selectNotifiedLoading = (state) => state.notified.loading;
export const selectNotifiedError = (state) => state.notified.error;

export default notifiedSlice.reducer;