import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';
import categoryReducer from './category/categorySlice';

// Import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  category: categoryReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
