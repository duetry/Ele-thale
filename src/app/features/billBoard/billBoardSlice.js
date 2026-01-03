import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE =
  'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

/* =========================================================
   SAFE LOCAL STORAGE HELPER (SSR FIX)
   ========================================================= */

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/* =========================================================
   ASYNC THUNK
   ========================================================= */

// ✅ Fetch Best Offer Billboards / Products
export const fetchBestOfferBillboards = createAsyncThunk(
  'billboards/fetchBestOfferBillboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch best offer billboards');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */

const initialState = {
  bestOfferBillboards: [],
  bestOfferLoading: false,
  bestOfferError: null,
};

/* =========================================================
   SLICE
   ========================================================= */

const billboardSlice = createSlice({
  name: 'billboards',
  initialState,
  reducers: {
    clearBestOfferBillboards: (state) => {
      state.bestOfferBillboards = [];
      state.bestOfferError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestOfferBillboards.pending, (state) => {
        state.bestOfferLoading = true;
        state.bestOfferError = null;
      })
      .addCase(fetchBestOfferBillboards.fulfilled, (state, action) => {
        state.bestOfferLoading = false;
        state.bestOfferBillboards = action.payload.data ?? [];
      })
      .addCase(fetchBestOfferBillboards.rejected, (state, action) => {
        state.bestOfferLoading = false;
        state.bestOfferError = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearBestOfferBillboards } = billboardSlice.actions;

export default billboardSlice.reducer;
