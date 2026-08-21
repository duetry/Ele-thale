// src/app/features/adminPanel/userFeedbackSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE =
  'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  if (!value || value === 'undefined' || value === 'null') return null;
  return value;
};

/* =========================================================
   THUNKS
   ========================================================= */

// ✅ GET Feedbacks / Find Offers list
export const getFeedbacks = createAsyncThunk(
  'userFeedback/getFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');

      const response = await fetch(`${API_BASE}/UserFeeback`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch feedback list');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// ✅ PUT Update Feedback Status (Contacted / Completed)
export const updateFeedbackStatus = createAsyncThunk(
  'userFeedback/updateFeedbackStatus',
  async ({ FeedbackId }, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');

      const response = await fetch(`${API_BASE}/UserFeeback`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ FeedbackId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update feedback status');
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
  feedbacks: [],
  count: 0,
  isAdmin: false,
  loading: false,
  error: null,
  updatingIds: [],
};

/* =========================================================
   SLICE
   ========================================================= */

const userFeedbackSlice = createSlice({
  name: 'userFeedback',
  initialState,
  reducers: {
    clearFeedbackError: (state) => {
      state.error = null;
    },
    resetUserFeedback: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET Feedbacks
      .addCase(getFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload?.feedbacks || [];
        state.count = action.payload?.count || 0;
        state.isAdmin = action.payload?.isAdmin || false;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT Update Feedback Status
      .addCase(updateFeedbackStatus.pending, (state, action) => {
        const { FeedbackId } = action.meta.arg;
        if (!state.updatingIds.includes(FeedbackId)) {
          state.updatingIds.push(FeedbackId);
        }
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const { FeedbackId, Status } = action.payload;
        state.updatingIds = state.updatingIds.filter((id) => id !== FeedbackId);
        
        // Update local item status if matching
        const updatedStatus = Status || 'Completed';
        state.feedbacks = state.feedbacks.map((item) =>
          item.FeedbackId === FeedbackId
            ? { ...item, Status: updatedStatus }
            : item
        );
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        const { FeedbackId } = action.meta.arg;
        state.updatingIds = state.updatingIds.filter((id) => id !== FeedbackId);
        state.error = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const { clearFeedbackError, resetUserFeedback } = userFeedbackSlice.actions;

export const selectFeedbacks = (state) => state.userFeedback.feedbacks;
export const selectFeedbackCount = (state) => state.userFeedback.count;
export const selectFeedbackLoading = (state) => state.userFeedback.loading;
export const selectFeedbackError = (state) => state.userFeedback.error;
export const selectUpdatingFeedbackIds = (state) => state.userFeedback.updatingIds;

export default userFeedbackSlice.reducer;
