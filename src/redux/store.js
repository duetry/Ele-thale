import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/app/features/products/productSlice';
import authReducer from '@/app/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
     auth: authReducer, 
  },
});
