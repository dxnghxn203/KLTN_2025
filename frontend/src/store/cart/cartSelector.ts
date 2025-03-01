import { RootState } from "../rootReducer";

export const selectCart = (state: RootState) => state.cart;
export const selectCartLocal = (state: RootState) => state.cart.cartlocal || [];
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
