import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
// Import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
