import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';
import { locationSlice } from './location/locationSlice';
import categoryReducer from './category/categorySlice';
import userReducer from "./user/userSlice";

// Import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  location: locationSlice.reducer,
  category: categoryReducer,
  user:userReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
