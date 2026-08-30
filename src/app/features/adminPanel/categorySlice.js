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

// 5️⃣ GET SubCategories (Optional Categoryid or SubCategoryid)
export const getSubCategories = createAsyncThunk(
  "category/getSubCategories",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");
      const url = categoryId
        ? `${API_BASE}/SubCatogory?Categoryid=${categoryId}`
        : `${API_BASE}/SubCatogory`;

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subcategories");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 6️⃣ GET Single SubCategory
export const getSingleSubCategory = createAsyncThunk(
  "category/getSingleSubCategory",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(
        `${API_BASE}/SubCatogory?SubCategoryid=${subCategoryId}`,
        {
          method: "GET",
          headers: getHeaders(token),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch single subcategory");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 7️⃣ CREATE SubCategory
export const createSubCategory = createAsyncThunk(
  "category/createSubCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/SubCatogory`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subcategory");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 8️⃣ UPDATE SubCategory
export const updateSubCategory = createAsyncThunk(
  "category/updateSubCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/SubCatogory`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update subcategory");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 9️⃣ DELETE SubCategory
export const deleteSubCategory = createAsyncThunk(
  "category/deleteSubCategory",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const token = getFromStorage("authToken");

      const response = await fetch(`${API_BASE}/SubCatogory`, {
        method: "DELETE",
        headers: getHeaders(token),
        body: JSON.stringify({ SubCategoryid: subCategoryId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subcategory");
      }

      return subCategoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  subCategories: [],
  loading: false,
  subLoading: false,
  error: null,
  subError: null,
  success: false,
  subSuccess: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryStatus: (state) => {
      state.error = null;
      state.success = false;
      state.subError = null;
      state.subSuccess = false;
    },
    resetCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET CATEGORIES
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

      // CREATE CATEGORY
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

      // UPDATE CATEGORY
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

      // DELETE CATEGORY
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
      })

      // GET SUB CATEGORIES
      .addCase(getSubCategories.pending, (state) => {
        state.subLoading = true;
        state.subError = null;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.subLoading = false;
        state.subCategories = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || action.payload?.subcategories || action.payload?.SubCategory || [];
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.subLoading = false;
        state.subError = action.payload;
      })

      // CREATE SUB CATEGORY
      .addCase(createSubCategory.pending, (state) => {
        state.subLoading = true;
        state.subError = null;
        state.subSuccess = false;
      })
      .addCase(createSubCategory.fulfilled, (state) => {
        state.subLoading = false;
        state.subSuccess = true;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.subLoading = false;
        state.subError = action.payload;
      })

      // UPDATE SUB CATEGORY
      .addCase(updateSubCategory.pending, (state) => {
        state.subLoading = true;
        state.subError = null;
        state.subSuccess = false;
      })
      .addCase(updateSubCategory.fulfilled, (state) => {
        state.subLoading = false;
        state.subSuccess = true;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.subLoading = false;
        state.subError = action.payload;
      })

      // DELETE SUB CATEGORY
      .addCase(deleteSubCategory.pending, (state) => {
        state.subLoading = true;
        state.subError = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.subLoading = false;
        state.subCategories = state.subCategories.filter(
          (sc) => (sc.SubCategoryid || sc.Subcategoryid) !== action.payload
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.subLoading = false;
        state.subError = action.payload;
      });
  },
});

export const { clearCategoryStatus, resetCategories } = categorySlice.actions;

export const selectCategories = (state) => state.category.categories;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;
export const selectCategorySuccess = (state) => state.category.success;

export const selectSubCategories = (state) => state.category.subCategories;
export const selectSubCategoryLoading = (state) => state.category.subLoading;
export const selectSubCategoryError = (state) => state.category.subError;
export const selectSubCategorySuccess = (state) => state.category.subSuccess;

export default categorySlice.reducer;

