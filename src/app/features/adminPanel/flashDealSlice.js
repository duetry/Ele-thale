// src/app/features/adminPanel/flashDealSlice.js

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
export const getFlashDeals = createAsyncThunk(
  "flashDeal/getFlashDeals",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/GET_SupperdealCount`, {
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
  flashDeals: [],
  loading: false,
  error: null,
  success: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const flashDealSlice = createSlice({
  name: "flashDeal",
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
      .addCase(getFlashDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlashDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.flashDeals = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getFlashDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearFlashDealStatus, resetFlashDeals } = flashDealSlice.actions;

export const selectFlashDeals = (state) => state.flashDeal.flashDeals;
export const selectFlashDealLoading = (state) => state.flashDeal.loading;
export const selectFlashDealError = (state) => state.flashDeal.error;

export default flashDealSlice.reducer;