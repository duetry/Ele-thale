// src/app/features/admin/adminPanelSlice.js
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
   SAFE LOCAL STORAGE HELPERS (SSR FIX)
   ========================================================= */

const getFromStorage = (key) => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") return null;
  return value;
};

/* =========================================================
   ASYNC THUNKS
   ========================================================= */

// 1️⃣ POST Search Log
export const postSearchLog = createAsyncThunk(
  "admin/postSearchLog",
  async ({ searchKeywords }, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      const response = await fetch(`${API_BASE}/GET_SearchLog`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({
          Searchkeywords: searchKeywords,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log search");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// 2️⃣ GET Search Log (with or without phoneno)
export const getSearchLog = createAsyncThunk(
  "admin/getSearchLog",
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      let url = `${API_BASE}/GET_SearchLog`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch search logs");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// 3️⃣ GET Coupon Code List (using GET_Coupon_By_User)
export const getCouponCodeList = createAsyncThunk(
  'admin/getCouponCodeList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      const id = typeof params === 'object' ? (params?.userId || params?.shopOwnerId) : params;
      let url = `${API_BASE}/GET_Coupon_By_User`;
      if (id) {
        url += `?userId=${id}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupon codes");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getCouponByUser = createAsyncThunk(
  'admin/getCouponByUser',
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      const id = typeof params === 'object' ? (params?.userId || params?.shopOwnerId) : params;
      let url = `${API_BASE}/GET_Coupon_By_User`;
      if (id) {
        url += `?userId=${id}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupons by user");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const unlockCoupon = createAsyncThunk(
  'admin/unlockCoupon',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const token = getFromStorage('authToken');
      const response = await fetch(
        `${API_BASE}/GET_CouponCode?productId=${productId}`,
        {
          method: 'GET',
          headers: getHeaders(token),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unlock coupon');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const getLocationList = createAsyncThunk(
  "admin/getLocationList",
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      let url = `${API_BASE}/GET_Location`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupon codes");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const getGamesList = createAsyncThunk(
  "admin/getGamesList",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      const response = await fetch(`${API_BASE}/Games`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch games list");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const userTracking = createAsyncThunk(
  "admin/userTracking",
  async (pageName, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Update_UserTracking`, {
        method: "POST",
        headers: {
          ...getHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pagename: pageName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update user tracking",
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const getUserTracking = createAsyncThunk(
  "admin/getUserTracking",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/GET_UserTracking`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user tracking");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// 4️⃣ GET Login User Details (with or without phoneno)
export const getLoginUserDetails = createAsyncThunk(
  "admin/getLoginUserDetails",
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      let url = `${API_BASE}/GET_LoginUserDetails`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);
export const getAdminOffers = createAsyncThunk(
  "admin/getAdminOffers",
  async (phoneno = null, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      let url = `${API_BASE}/List_Products`;
      if (phoneno) {
        url += `?phoneno=${phoneno}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const postAdminOffers = createAsyncThunk(
  "admin/postAdminOffers",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Update_Products`, {
        method: "POST",
        headers: {
          ...getHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create offer");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);
export const updateAdminOffers = createAsyncThunk(
  "admin/updateAdminOffers",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Put_Products`, {
        method: "POST",
        headers: {
          ...getHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create offer");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const deleteAdminOffer = createAsyncThunk(
  "admin/deleteAdminOffer",
  async (productId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Delete_Product`, {
        method: "POST",
        headers: {
          ...getHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Productid: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
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

  // locationData
  locationData: [],
  locationLoading: false,
  locationError: null,
  selectedLocation: null,

  // Login User Details
  loginUsers: [],
  userTrackingData: [],
  userDetailLoading: false,
  userDetailError: null,

  // admin offers
  adminOffers: [],
  userTrackingData: [],
  adminOffersLoading: false,
  adminOffersError: null,
  adminOffersSuccess: false,

  // POST Search Log
  postSearchLoading: false,
  postSearchError: null,
  postSearchSuccess: false,

  // Coupon
  unlockedCoupon: null,
  unlockLoading: false,
  unlockError: null,

  // Games Data
  gamesData: [],
  gamesLoading: false,
  gamesError: null,
};

/* =========================================================
   SLICE
   ========================================================= */

const adminPanelSlice = createSlice({
  name: "adminPanel",
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
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
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

      .addCase(userTracking.pending, (state) => {
        state.postSearchLoading = true;
        state.postSearchError = null;
        state.postSearchSuccess = false;
      })
      .addCase(userTracking.fulfilled, (state, action) => {
        state.postSearchLoading = false;
        state.postSearchSuccess = true;
        // state.userTrackingData = action.payload;
      })
      .addCase(userTracking.rejected, (state, action) => {
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
        state.searchLogs = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
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
        state.couponLoading = false;
        state.couponCodes = action.payload?.coupons || action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(getCouponCodeList.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })
      .addCase(getCouponByUser.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(getCouponByUser.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.couponCodes = action.payload?.coupons || action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(getCouponByUser.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })
      // GET Coupon Code List

      .addCase(getLocationList.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(getLocationList.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.locationData = action.payload?.data;
      })
      .addCase(getLocationList.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload;
      })

      // GET Games List
      .addCase(getGamesList.pending, (state) => {
        state.gamesLoading = true;
        state.gamesError = null;
      })
      .addCase(getGamesList.fulfilled, (state, action) => {
        state.gamesLoading = false;
        state.gamesData = action.payload?.data || action.payload || [];
      })
      .addCase(getGamesList.rejected, (state, action) => {
        state.gamesLoading = false;
        state.gamesError = action.payload;
      })

      // GET Login User Details
      .addCase(getLoginUserDetails.pending, (state) => {
        state.userDetailLoading = true;
        state.userDetailError = null;
      })
      .addCase(getLoginUserDetails.fulfilled, (state, action) => {
        state.userDetailLoading = false;
        state.loginUsers = Array.isArray(action.payload)
          ? action.payload?.data
          : [action.payload?.data];
      })
      .addCase(getLoginUserDetails.rejected, (state, action) => {
        state.userDetailLoading = false;
        state.userDetailError = action.payload;
      })
      // GET Login User Details
      .addCase(getAdminOffers.pending, (state) => {
        state.adminOffersLoading = true;
        state.adminOffersError = null;
      })
      .addCase(getAdminOffers.fulfilled, (state, action) => {
        state.adminOffersLoading = false;
        state.adminOffers = Array.isArray(action.payload)
          ? action.payload?.data
          : action.payload?.data;
      })
      .addCase(getAdminOffers.rejected, (state, action) => {
        state.adminOffersLoading = false;
        state.adminOffersError = action.payload;
      })

      .addCase(postAdminOffers.pending, (state) => {
        state.adminOffersLoading = true;
        state.adminOffersError = null;
        state.adminOffersSuccess = false;
      })
      .addCase(postAdminOffers.fulfilled, (state) => {
        state.adminOffersLoading = false;
        state.adminOffersSuccess = true;
      })
      .addCase(postAdminOffers.rejected, (state, action) => {
        state.adminOffersLoading = false;
        state.adminOffersError = action.payload;
      })
      .addCase(updateAdminOffers.pending, (state) => {
        state.adminOffersLoading = true;
        state.adminOffersError = null;
        state.adminOffersSuccess = false;
      })
      .addCase(updateAdminOffers.fulfilled, (state) => {
        state.adminOffersLoading = false;
        state.adminOffersSuccess = true;
      })
      .addCase(updateAdminOffers.rejected, (state, action) => {
        state.adminOffersLoading = false;
        state.adminOffersError = action.payload;
      })
      .addCase(deleteAdminOffer.pending, (state) => {
        state.adminOffersLoading = true;
        state.adminOffersError = null;
        state.adminOffersSuccess = false;
      })
      .addCase(deleteAdminOffer.fulfilled, (state) => {
        state.adminOffersLoading = false;
        state.adminOffersSuccess = true;
      })
      .addCase(deleteAdminOffer.rejected, (state, action) => {
        state.adminOffersLoading = false;
        state.adminOffersError = action.payload;
      })
      .addCase(getUserTracking.pending, (state) => {
        state.userTrackingLoading = true;
        state.userTrackingError = null;
      })
      .addCase(getUserTracking.fulfilled, (state, action) => {
        state.userTrackingLoading = false;
        state.userTrackingData = action.payload ?? [];
      })
      .addCase(getUserTracking.rejected, (state, action) => {
        state.userTrackingLoading = false;
        state.userTrackingError = action.payload;
      })


      .addCase(unlockCoupon.pending, (state) => {
  state.unlockLoading = true;
  state.unlockError = null;
  state.unlockedCoupon = null;
})
.addCase(unlockCoupon.fulfilled, (state, action) => {
  state.unlockLoading = false;
  state.unlockedCoupon = action.payload?.data;
})
.addCase(unlockCoupon.rejected, (state, action) => {
  state.unlockLoading = false;
  state.unlockError = action.payload;
})
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
  setSelectedLocation,
  resetAdminState,
} = adminPanelSlice.actions;

// Selectors
export const selectSearchLogs = (state) => state.adminPanel.searchLogs;
export const selectSearchLogLoading = (state) =>
  state.adminPanel.searchLogLoading;
export const selectSearchLogError = (state) => state.adminPanel.searchLogError;

export const selectCouponCodes = (state) => state.adminPanel.couponCodes;
export const selectCouponLoading = (state) => state.adminPanel.couponLoading;
export const selectCouponError = (state) => state.adminPanel.couponError;

export const selectLocationList = (state) => state.adminPanel.locationData;
export const selectLocationLoading = (state) =>
  state.adminPanel.locationLoading;
export const selectLocationError = (state) => state.adminPanel.locationError;

export const selectLoginUsers = (state) => state.adminPanel.loginUsers;
export const selectUserDetailLoading = (state) =>
  state.adminPanel.userDetailLoading;
export const selectUserDetailError = (state) =>
  state.adminPanel.userDetailError;

export const selectAdminOffers = (state) => state.adminPanel.adminOffers;
export const selectAdminOffersLoading = (state) =>
  state.adminPanel.userDetailLoading;
export const selectAdminOffersError = (state) =>
  state.adminPanel.userDetailError;

export const selectPostSearchLoading = (state) =>
  state.adminPanel.postSearchLoading;
export const selectPostSearchError = (state) =>
  state.adminPanel.postSearchError;
export const selectPostSearchSuccess = (state) =>
  state.adminPanel.postSearchSuccess;
export const selectSelectedLocation = (state) => state.adminPanel.selectedLocation;


export const selectUnlockedCoupon = (state) => state.adminPanel.unlockedCoupon;
export const selectUnlockLoading = (state) => state.adminPanel.unlockLoading;
export const selectUnlockError = (state) => state.adminPanel.unlockError;

export default adminPanelSlice.reducer;
