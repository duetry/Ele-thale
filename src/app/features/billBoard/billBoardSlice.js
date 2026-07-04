// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// /* =========================================================
//    API CONFIG
//    ========================================================= */

// const API_BASE =
//   'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

// /* =========================================================
//    SAFE LOCAL STORAGE HELPER (SSR FIX)
//    ========================================================= */

// const getAuthToken = () => {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('authToken');
// };

// const getHeaders = () => {
//   const token = getAuthToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// /* =========================================================
//    ASYNC THUNK
//    ========================================================= */

// // ✅ Fetch Best Offer Billboards / Products
// export const fetchBestOfferBillboards = createAsyncThunk(
//   'billboards/fetchBestOfferBillboards',
//   async (params = {}, { rejectWithValue }) => {
//     try {                                                        // ← missing try
//       const LocationId = params?.LocationId;

//       const url = LocationId
//         ? `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true&LocationId=${LocationId}`
//         : `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to fetch best offer billboards');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );
// export const fetchSuperDeals = createAsyncThunk(
//   'billboards/fetchSuperDeals',
//   async (params = {}, { rejectWithValue }) => {
//     try {                                                        // ← missing try
//       const LocationId = params?.LocationId;

//       const url = LocationId
//         ? `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true&LocationId=${LocationId}`
//         : `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to fetch best offer billboards');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );


// // billBoardSlice.js — add this thunk

// export const requestExpiredOffer = createAsyncThunk(
//   'billboards/requestExpiredOffer',
//   async ({ Productid }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${API_BASE}/SupperdealRequest`,
//         {
//           method: 'POST',
//           headers: getHeaders(),
//           body: JSON.stringify({ Productid }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to submit offer request');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );

// /* =========================================================
//    INITIAL STATE
//    ========================================================= */

// const initialState = {
//   bestOfferBillboards: [],
//   bestOfferBanner: [],
//   bestOfferLoading: false,
//   bestOfferError: null,

//   superDealBillboards: [],
//   superDealBanner: [],
//   superDealLoading: false,
//  superDealError: null,


//  requestOfferLoading: false,
// requestOfferError: null,
// requestOfferSuccess: false,
// };

// /* =========================================================
//    SLICE
//    ========================================================= */

// const billboardSlice = createSlice({
//   name: 'billboards',
//   initialState,
//   reducers: {
//     clearBestOfferBillboards: (state) => {
//       state.bestOfferBillboards = [];
//       state.bestOfferBanner = [];
//       state.bestOfferError = null;
//     },
//     clearSuperDeals: (state) => {
//       state.superDealBillboards = [];
//       state.superDealBanner = [];
//       state.superDealError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBestOfferBillboards.pending, (state) => {
//         state.bestOfferLoading = true;
//         state.bestOfferError = null;
//       })
//       .addCase(fetchBestOfferBillboards.fulfilled, (state, action) => {
//         state.bestOfferLoading = false;
//         state.bestOfferBillboards = action.payload.data?.card ?? [];
//         state.bestOfferBanner = action.payload.data?.banner ?? [];
//       })
//       .addCase(fetchBestOfferBillboards.rejected, (state, action) => {
//         state.bestOfferLoading = false;
//         state.bestOfferError = action.payload;
//       })
//       .addCase(fetchSuperDeals.pending, (state) => {
//         state.superDealLoading = true;
//         state.superDealError = null;
//       })
//       .addCase(fetchSuperDeals.fulfilled, (state, action) => {
//         state.superDealLoading = false;
//         state.superDealBillboards = action.payload.data?.card ?? [];
//         state.superDealBanner = action.payload.data?.banner ?? [];
//       })
//       .addCase(fetchSuperDeals.rejected, (state, action) => {
//         state.superDealLoading = false;
//         state.superDealError = action.payload;
//       })

//       .addCase(requestExpiredOffer.pending, (state) => {
//   state.requestOfferLoading = true;
//   state.requestOfferError = null;
//   state.requestOfferSuccess = false;
// })
// .addCase(requestExpiredOffer.fulfilled, (state) => {
//   state.requestOfferLoading = false;
//   state.requestOfferSuccess = true;
// })
// .addCase(requestExpiredOffer.rejected, (state, action) => {
//   state.requestOfferLoading = false;
//   state.requestOfferError = action.payload;
// });
//   },
// });

// /* =========================================================
//    EXPORTS
//    ========================================================= */

// export const { clearBestOfferBillboards ,clearSuperDeals} = billboardSlice.actions;

// export default billboardSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// /* =========================================================
//    API CONFIG
//    ========================================================= */

// const API_BASE =
//   'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';

// /* =========================================================
//    SAFE LOCAL STORAGE HELPER (SSR FIX)
//    ========================================================= */

// const getAuthToken = () => {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('authToken');
// };

// const getHeaders = () => {
//   const token = getAuthToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// /* =========================================================
//    ASYNC THUNKS
//    ========================================================= */

// export const fetchBestOfferBillboards = createAsyncThunk(
//   'billboards/fetchBestOfferBillboards',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const LocationId = params?.LocationId;

//       const url = LocationId
//         ? `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true&LocationId=${LocationId}`
//         : `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to fetch best offer billboards');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );

// export const fetchSuperDeals = createAsyncThunk(
//   'billboards/fetchSuperDeals',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const LocationId = params?.LocationId;

//       const url = LocationId
//         ? `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true&LocationId=${LocationId}`
//         : `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true`;

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to fetch best offer billboards');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );

// export const requestExpiredOffer = createAsyncThunk(
//   'billboards/requestExpiredOffer',
//   async ({ Productid }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${API_BASE}/SupperdealRequest`,
//         {
//           method: 'POST',
//           headers: getHeaders(),
//           body: JSON.stringify({ Productid }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to submit offer request');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );

// /* =========================================================
//    INITIAL STATE
//    ========================================================= */

// const initialState = {
//   // flat fallback (old API shape)
//   bestOfferBillboards: [],
//   bestOfferBanner: [],
//   bestOfferLoading: false,
//   bestOfferError: null,

//   // new sectioned shape
//   bestOfferLive: [],
//   bestOfferUpcoming: [],
//   bestOfferExpired: [],

//   superDealBillboards: [],
//   superDealBanner: [],
//   superDealLoading: false,
//   superDealError: null,

//   requestOfferLoading: false,
//   requestOfferError: null,
//   requestOfferSuccess: false,
// };

// /* =========================================================
//    SLICE
//    ========================================================= */

// const billboardSlice = createSlice({
//   name: 'billboards',
//   initialState,
//   reducers: {
//     clearBestOfferBillboards: (state) => {
//       state.bestOfferBillboards = [];
//       state.bestOfferBanner = [];
//       state.bestOfferError = null;
//       state.bestOfferLive = [];
//       state.bestOfferUpcoming = [];
//       state.bestOfferExpired = [];
//     },
//     clearSuperDeals: (state) => {
//       state.superDealBillboards = [];
//       state.superDealBanner = [];
//       state.superDealError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* ---- Best Offer Billboards ---- */
//       .addCase(fetchBestOfferBillboards.pending, (state) => {
//         state.bestOfferLoading = true;
//         state.bestOfferError = null;
//       })
//       .addCase(fetchBestOfferBillboards.fulfilled, (state, action) => {
//         state.bestOfferLoading = false;
//         state.bestOfferBanner = action.payload.data?.banner ?? [];

//         const card = action.payload.data?.card;

//         // Support both old flat array and new { live, upcoming, expired } shape
//         if (Array.isArray(card)) {
//           state.bestOfferBillboards = card;
//           state.bestOfferLive = [];
//           state.bestOfferUpcoming = [];
//           state.bestOfferExpired = [];
//         } else if (card && typeof card === 'object') {
//           state.bestOfferLive     = card.live     ?? [];
//           state.bestOfferUpcoming = card.upcoming ?? [];
//           state.bestOfferExpired  = card.expired  ?? [];
//           // Merge all into flat array for backward compat
//           state.bestOfferBillboards = [
//             ...(card.live     ?? []),
//             ...(card.upcoming ?? []),
//             ...(card.expired  ?? []),
//           ];
//         } else {
//           state.bestOfferBillboards = [];
//           state.bestOfferLive = [];
//           state.bestOfferUpcoming = [];
//           state.bestOfferExpired = [];
//         }
//       })
//       .addCase(fetchBestOfferBillboards.rejected, (state, action) => {
//         state.bestOfferLoading = false;
//         state.bestOfferError = action.payload;
//       })

//       /* ---- Super Deals ---- */
//       .addCase(fetchSuperDeals.pending, (state) => {
//         state.superDealLoading = true;
//         state.superDealError = null;
//       })
//       .addCase(fetchSuperDeals.fulfilled, (state, action) => {
//         state.superDealLoading = false;
//         state.superDealBillboards = action.payload.data?.card ?? [];
//         state.superDealBanner = action.payload.data?.banner ?? [];
//       })
//       .addCase(fetchSuperDeals.rejected, (state, action) => {
//         state.superDealLoading = false;
//         state.superDealError = action.payload;
//       })

//       /* ---- Request Expired Offer ---- */
//       .addCase(requestExpiredOffer.pending, (state) => {
//         state.requestOfferLoading = true;
//         state.requestOfferError = null;
//         state.requestOfferSuccess = false;
//       })
//       .addCase(requestExpiredOffer.fulfilled, (state) => {
//         state.requestOfferLoading = false;
//         state.requestOfferSuccess = true;
//       })
//       .addCase(requestExpiredOffer.rejected, (state, action) => {
//         state.requestOfferLoading = false;
//         state.requestOfferError = action.payload;
//       });
//   },
// });

// /* =========================================================
//    EXPORTS
//    ========================================================= */

// export const { clearBestOfferBillboards, clearSuperDeals } = billboardSlice.actions;

// export default billboardSlice.reducer;


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
   ASYNC THUNKS
   ========================================================= */

export const fetchBestOfferBillboards = createAsyncThunk(
  'billboards/fetchBestOfferBillboards',
  async (params = {}, { rejectWithValue }) => {
    try {
      const LocationId = params?.LocationId;

      const url = LocationId
        ? `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true&LocationId=${LocationId}`
        : `${API_BASE}/GET_Isbestoffer_Products?isbestoffer=true`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

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

export const fetchSuperDeals = createAsyncThunk(
  'billboards/fetchSuperDeals',
  async (params = {}, { rejectWithValue }) => {
    try {
      const LocationId = params?.LocationId;

      const url = LocationId
        ? `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true&LocationId=${LocationId}`
        : `${API_BASE}/GET_Issupperdeal_Products?isbestoffer=true`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

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

export const requestExpiredOffer = createAsyncThunk(
  'billboards/requestExpiredOffer',
  async ({ Productid }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/SupperdealRequest`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ Productid }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to submit offer request');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

/* ---- NEW: Notify Me for Upcoming Offers ----
   NOTE: Adjust the endpoint path (`SupperdealNotify`) below to match
   whatever your backend team names the actual "notify me" API route.
   Everything else follows the exact same pattern as requestExpiredOffer
   so it's a drop-in sibling thunk. */
export const notifyUpcomingOffer = createAsyncThunk(
  'billboards/notifyUpcomingOffer',
  async ({ Productid }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/NotifyRequest`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ Productid }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to submit notify request');
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
  // flat fallback (old API shape)
  bestOfferBillboards: [],
  bestOfferBanner: [],
  bestOfferLoading: false,
  bestOfferError: null,

  // new sectioned shape
  bestOfferLive: [],
  bestOfferUpcoming: [],
  bestOfferExpired: [],

  superDealBillboards: [],
  superDealBanner: [],
  superDealLoading: false,
  superDealError: null,

  requestOfferLoading: false,
  requestOfferError: null,
  requestOfferSuccess: false,

  // NEW: Notify Me (upcoming offers) state
  notifyOfferLoading: false,
  notifyOfferError: null,
  notifyOfferSuccess: false,
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
      state.bestOfferBanner = [];
      state.bestOfferError = null;
      state.bestOfferLive = [];
      state.bestOfferUpcoming = [];
      state.bestOfferExpired = [];
    },
    clearSuperDeals: (state) => {
      state.superDealBillboards = [];
      state.superDealBanner = [];
      state.superDealError = null;
    },
    // NEW: allow resetting the notify success/error flags (e.g. after closing a toast/modal)
    clearNotifyOfferStatus: (state) => {
      state.notifyOfferLoading = false;
      state.notifyOfferError = null;
      state.notifyOfferSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- Best Offer Billboards ---- */
      .addCase(fetchBestOfferBillboards.pending, (state) => {
        state.bestOfferLoading = true;
        state.bestOfferError = null;
      })
      .addCase(fetchBestOfferBillboards.fulfilled, (state, action) => {
        state.bestOfferLoading = false;
        state.bestOfferBanner = action.payload.data?.banner ?? [];

        const card = action.payload.data?.card;

        // Support both old flat array and new { live, upcoming, expired } shape
        if (Array.isArray(card)) {
          state.bestOfferBillboards = card;
          state.bestOfferLive = [];
          state.bestOfferUpcoming = [];
          state.bestOfferExpired = [];
        } else if (card && typeof card === 'object') {
          state.bestOfferLive     = card.live     ?? [];
          state.bestOfferUpcoming = card.upcoming ?? [];
          state.bestOfferExpired  = card.expired  ?? [];
          // Merge all into flat array for backward compat
          state.bestOfferBillboards = [
            ...(card.live     ?? []),
            ...(card.upcoming ?? []),
            ...(card.expired  ?? []),
          ];
        } else {
          state.bestOfferBillboards = [];
          state.bestOfferLive = [];
          state.bestOfferUpcoming = [];
          state.bestOfferExpired = [];
        }
      })
      .addCase(fetchBestOfferBillboards.rejected, (state, action) => {
        state.bestOfferLoading = false;
        state.bestOfferError = action.payload;
      })

      /* ---- Super Deals ---- */
      .addCase(fetchSuperDeals.pending, (state) => {
        state.superDealLoading = true;
        state.superDealError = null;
      })
      .addCase(fetchSuperDeals.fulfilled, (state, action) => {
        state.superDealLoading = false;
        state.superDealBillboards = action.payload.data?.card ?? [];
        state.superDealBanner = action.payload.data?.banner ?? [];
      })
      .addCase(fetchSuperDeals.rejected, (state, action) => {
        state.superDealLoading = false;
        state.superDealError = action.payload;
      })

      /* ---- Request Expired Offer ---- */
      .addCase(requestExpiredOffer.pending, (state) => {
        state.requestOfferLoading = true;
        state.requestOfferError = null;
        state.requestOfferSuccess = false;
      })
      .addCase(requestExpiredOffer.fulfilled, (state) => {
        state.requestOfferLoading = false;
        state.requestOfferSuccess = true;
      })
      .addCase(requestExpiredOffer.rejected, (state, action) => {
        state.requestOfferLoading = false;
        state.requestOfferError = action.payload;
      })

      /* ---- NEW: Notify Me (Upcoming Offer) ---- */
      .addCase(notifyUpcomingOffer.pending, (state) => {
        state.notifyOfferLoading = true;
        state.notifyOfferError = null;
        state.notifyOfferSuccess = false;
      })
      .addCase(notifyUpcomingOffer.fulfilled, (state) => {
        state.notifyOfferLoading = false;
        state.notifyOfferSuccess = true;
      })
      .addCase(notifyUpcomingOffer.rejected, (state, action) => {
        state.notifyOfferLoading = false;
        state.notifyOfferError = action.payload;
      });
  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const {
  clearBestOfferBillboards,
  clearSuperDeals,
  clearNotifyOfferStatus,
} = billboardSlice.actions;

export default billboardSlice.reducer;