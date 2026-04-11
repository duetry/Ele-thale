// src/app/features/shop/shopSlice.js

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
   THUNKS (SHOP)
   ========================================================= */

// ✅ GET (UPDATED ENDPOINT)
export const getShops = createAsyncThunk(
  "shop/getShops",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/GET_Stores`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stores");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ CREATE (keep same OR update if API differs)
export const createShop = createAsyncThunk(
  "shop/createShop",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Shop`, {
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
export const updateShop = createAsyncThunk(
  "shop/updateShop",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Shop`, {
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
export const deleteShop = createAsyncThunk(
  "shop/deleteShop",
  async (shopId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Shop`, {
        method: "DELETE",
        headers: getHeaders(token),
        body: JSON.stringify({
          shopId: shopId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      return shopId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================================================
   STATE
   ========================================================= */

const initialState = {
  shops: [],
  loading: false,
  error: null,
  success: false,
};

/* =========================================================
   SLICE
   ========================================================= */

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearShopStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShops.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 IMPORTANT: API structure handling
        state.shops = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data ||
            action.payload?.stores || // 👈 added fallback
            [];
      })
      .addCase(getShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createShop.fulfilled, (state) => {
        state.success = true;
      })

      // UPDATE
      .addCase(updateShop.fulfilled, (state) => {
        state.success = true;
      })

      // DELETE
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.shops = state.shops.filter(
          (shop) => shop.shopId !== action.payload
        );
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearShopStatus } = shopSlice.actions;

export const selectShops = (state) => state.shop.shops;
export const selectShopLoading = (state) => state.shop.loading;

export default shopSlice.reducer;