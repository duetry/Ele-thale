// store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/app/features/products/productSlice';
import authReducer from '@/app/features/auth/authSlice';
import billboardReducer from '@/app/features/billBoard/billBoardSlice';
import adminPanelReducer from '@/app/features/adminPanel/adminPanelSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer, 
    billboards: billboardReducer, // ✅ Changed from billBoard to billboards
  adminPanel: adminPanelReducer

  },
});

export default store;