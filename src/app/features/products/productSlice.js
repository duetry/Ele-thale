// src/app/features/products/productSlice.js
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

// 1️⃣ Fetch Categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/Categories`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 2️⃣ Fetch Subcategories by Category ID
export const fetchSubcategories = createAsyncThunk(
  'products/fetchSubcategories',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/Subcategories?categoryId=${categoryId}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch subcategories');
      }

      return {
        categoryId,
        subcategories: await response.json(),
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// 3️⃣ Fetch Products with Filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { categoryId, subcategoryId, search, sortBy = 'featured' },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (categoryId) params.append('categoryId', categoryId);
      if (subcategoryId) params.append('subcategoryId', subcategoryId);
      // if (search) params.append('search', search);
      // if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(
        `${API_BASE}/GET_Products_By_Id?${params.toString()}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
// 4️⃣ Fetch Product Offer Details (Unlock Offer)
// export const fetchProductOffer = createAsyncThunk(
//   'products/fetchProductOffer',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${API_BASE}/GET_CouponCode/${productId}`,
//         {
//           method: 'GET',
//           headers: getHeaders(),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to fetch product offer');
//       }

//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );
export const fetchProductOffer = createAsyncThunk(
  'products/fetchProductOffer',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/GET_CouponCode?productId=${productId}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch product offer');
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
  // Categories
  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  // Subcategories mapped by categoryId
  subcategories: {},
  subcategoriesLoading: false,
  subcategoriesError: null,

  // Products
  products: [],
  productsLoading: false,
  productsError: null,


  // Product Offer Popup
productOffer: null,
productOfferLoading: false,
productOfferError: null,


  // UI Filters
  filters: {
    searchQuery: '',
    selectedCategory: '',
    selectedSubCategory: '',
    sortBy: 'featured',
  },
};

/* =========================================================
   SLICE
   ========================================================= */

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.filters.selectedCategory = action.payload;
      state.filters.selectedSubCategory = '';
    },
    setSelectedSubCategory: (state, action) => {
      state.filters.selectedSubCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data ?? [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })

      // Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.subcategoriesLoading = true;
        state.subcategoriesError = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategoriesLoading = false;
        const { categoryId, subcategories } = action.payload;
        state.subcategories[categoryId] = subcategories;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.subcategoriesLoading = false;
        state.subcategoriesError = action.payload;
      })

      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })

      // Product Offer (Unlock Offer)
.addCase(fetchProductOffer.pending, (state) => {
  state.productOfferLoading = true;
  state.productOfferError = null;
})
.addCase(fetchProductOffer.fulfilled, (state, action) => {
  state.productOfferLoading = false;
  state.productOffer = action.payload.data; // adjust if API structure differs
})
.addCase(fetchProductOffer.rejected, (state, action) => {
  state.productOfferLoading = false;
  state.productOfferError = action.payload;
});

  },
});

/* =========================================================
   EXPORTS
   ========================================================= */

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedSubCategory,
  setSortBy,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;