// src/app/features/reactions/reactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE =
  'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

/* =========================================================
   ASYNC THUNK — GET all product reactions (Admin Panel)
   ========================================================= */

export const getReactions = createAsyncThunk(
  'reactions/getReactions',
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null;

      const response = await fetch(`${API_BASE}/GET_Product_Reactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch reactions');
      }

      const json = await response.json();
      return json.data; // ✅ returns the array
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

/* =========================================================
   ASYNC THUNK — POST reaction (like / dislike)
   ========================================================= */

export const postProductReaction = createAsyncThunk(
  'reactions/postProductReaction',
  async ({ Productid, Reaction }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null;

      const response = await fetch(`${API_BASE}/Product_Reactions_Request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ Productid, Reaction }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to post reaction');
      }

      return { Productid, Reaction };
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

/* =========================================================
   INITIAL STATE
   ========================================================= */

const initialState = {
  // Admin — list of all product reaction counts
  allReactions: [],
  allReactionsLoading: false,
  allReactionsError: null,

  // User — map of productId → 'like' | 'dislike' | null
  reactions: {},

  // Track which productIds are currently submitting
  loadingIds: [],

  // Last error (if any)
  error: null,
};

/* =========================================================
   SLICE
   ========================================================= */

const reactionSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    setReaction: (state, action) => {
      const { Productid, Reaction } = action.payload;
      state.reactions[Productid] = Reaction;
    },
    clearReaction: (state, action) => {
      const { Productid } = action.payload;
      delete state.reactions[Productid];
    },
    clearAllReactions: (state) => {
      state.reactions = {};
      state.loadingIds = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ------ GET all reactions (Admin) ------ */
      .addCase(getReactions.pending, (state) => {
        state.allReactionsLoading = true;
        state.allReactionsError = null;
      })
      .addCase(getReactions.fulfilled, (state, action) => {
        state.allReactionsLoading = false;
        state.allReactions = action.payload;
      })
      .addCase(getReactions.rejected, (state, action) => {
        state.allReactionsLoading = false;
        state.allReactionsError = action.payload;
      })

      /* ------ POST reaction (User) ------ */
      .addCase(postProductReaction.pending, (state, action) => {
        const { Productid } = action.meta.arg;
        if (!state.loadingIds.includes(Productid)) {
          state.loadingIds.push(Productid);
        }
        state.error = null;
      })
      .addCase(postProductReaction.fulfilled, (state, action) => {
        const { Productid, Reaction } = action.payload;
        state.reactions[Productid] = Reaction;
        state.loadingIds = state.loadingIds.filter((id) => id !== Productid);
      })
      .addCase(postProductReaction.rejected, (state, action) => {
        const { Productid } = action.meta.arg;
        state.loadingIds = state.loadingIds.filter((id) => id !== Productid);
        state.error = action.payload;
      });
  },
});

/* =========================================================
   ACTIONS
   ========================================================= */

export const { setReaction, clearReaction, clearAllReactions } =
  reactionSlice.actions;

/* =========================================================
   SELECTORS
   ========================================================= */

// ✅ Admin selectors
export const selectReactions      = (state) => state.reactions?.allReactions;
export const selectReactionLoading = (state) => state.reactions?.allReactionsLoading;
export const selectReactionError   = (state) => state.reactions?.allReactionsError;

// User selectors
export const selectReaction = (productId) => (state) =>
  state.reactions?.reactions?.[productId];

export const selectProductReactionLoading = (productId) => (state) =>
  state.reactions?.loadingIds?.includes(productId) ?? false;

export const selectPostReactionError = (state) => state.reactions?.error;

/* =========================================================
   EXPORT DEFAULT
   ========================================================= */

export default reactionSlice.reducer;