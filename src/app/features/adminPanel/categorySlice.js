import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE =
  "https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const getFromStorage = (key) => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") return null;
  return value;
};

// 1️⃣ GET Categories
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Categories`, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2️⃣ CREATE Category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Categories`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3️⃣ UPDATE Category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/Categories`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4️⃣ DELETE Category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(
        `${API_BASE}/Categories?Categoryid=${categoryId}`,
        {
          method: "DELETE",
          headers: getHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
  success: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    resetCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (c) => c.Categoryid !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryStatus, resetCategories } = categorySlice.actions;

export const selectCategories = (state) => state.category.categories;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;
export const selectCategorySuccess = (state) => state.category.success;

export default categorySlice.reducer;
