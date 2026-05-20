// store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/app/features/products/productSlice';
import authReducer from '@/app/features/auth/authSlice';
import billboardReducer from '@/app/features/billBoard/billBoardSlice';
import adminPanelReducer from '@/app/features/adminPanel/adminPanelSlice';
import shopOwnerReducer from '@/app/features/adminPanel/shopOwnerSlice';
import shopReducer from '@/app/features/adminPanel/shopSlice';
import flashDealReducer from '@/app/features/adminPanel/flashDealSlice';
import reactionsReducer from '@/app/features/adminPanel/reactionSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer, 
    billboards: billboardReducer,
  adminPanel: adminPanelReducer,
  shopOwner: shopOwnerReducer,
  shop: shopReducer,
  flashDeal: flashDealReducer,
  reactions: reactionsReducer
  },
});

export default store;