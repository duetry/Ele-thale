// src/app/features/shop/shopOwnerSlice.js

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
   THUNKS (RENAMED)
   ========================================================= */

// ✅ GET
export const getShopOwner = createAsyncThunk(
  "shopOwner/getShopOwner",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/ShopOwnerRegister`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shops");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ CREATE
export const createShopOwner = createAsyncThunk(
  "shopOwner/createShopOwner",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/ShopOwnerRegister`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create shop");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ UPDATE
export const updateShopOwner = createAsyncThunk(
  "shopOwner/updateShopOwner",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/ShopOwnerRegister`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update shop");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ DELETE
export const deleteShopOwner = createAsyncThunk(
  "shopOwner/deleteShopOwner",
  async (ShopOwnerId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/ShopOwnerRegister`, {
        method: "DELETE",
        headers: getHeaders(token),
        body: JSON.stringify({
          ShopOwnerId: ShopOwnerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      return ShopOwnerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   STATE
   ========================================================= */

const initialState = {
  shopOwners: [],
  loading: false,
  error: null,
  success: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const shopOwnerSlice = createSlice({
  name: "shopOwner",
  initialState,
  reducers: {
    clearShopOwnerStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    resetShopOwners: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getShopOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShopOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.shopOwners = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getShopOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createShopOwner.fulfilled, (state) => {
        state.success = true;
      })

      // UPDATE
      .addCase(updateShopOwner.fulfilled, (state) => {
        state.success = true;
      })

      // DELETE
      .addCase(deleteShopOwner.fulfilled, (state, action) => {
        state.shopOwners = state.shopOwners.filter(
          (shop) => shop.ShopOwnerId !== action.payload
        );
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearShopOwnerStatus, resetShopOwners } = shopOwnerSlice.actions;

export const selectShopOwners = (state) => state.shopOwner.shopOwners;
export const selectShopOwnerLoading = (state) => state.shopOwner.loading;

export default shopOwnerSlice.reducer;