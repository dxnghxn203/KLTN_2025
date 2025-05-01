import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';
import { locationSlice } from './location/locationSlice';
import categoryReducer from './category/categorySlice';
import userReducer from "./user/userSlice";
import reviewReducer from "./review/reviewSlice";
import { getToken } from '@/utils/cookie';
import { setClientToken } from '@/utils/configs/axiosClient';

// Import other reducers here

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  location: locationSlice.reducer,
  category: categoryReducer,
  user:userReducer,
  review: reviewReducer,
  // Add other reducers here
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "authen/fetchLogoutStart") {
    return reducer(undefined, action); 
  }   

  const token = getToken();
  // console.log("Token from cookie:", token);

  if (token) {
    setClientToken(token);
  }

  return reducer(state, action);
};

export default rootReducer;
