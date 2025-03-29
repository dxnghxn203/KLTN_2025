import { stat } from "fs";
import { RootState } from "../rootReducer";

export const selectProduct = (state: RootState) => state.product;
export const selectProducts = (state: RootState) => state.product.products;
export const selectProductBySlug = (state: RootState) => state.product.product;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
export const selectProductAdmin = (state: RootState)=> state.product.productsAdmin