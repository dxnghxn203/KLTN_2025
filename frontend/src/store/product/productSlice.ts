import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
    products: any[];
    product: any;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    product: null,
    loading: false,
    error: null,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Fetch product by slug
        fetchProductBySlugStart(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        fetchProductBySlugSuccess(state, action: PayloadAction<any[]>) {
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductBySlugFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,
} = productSlice.actions;

export default productSlice.reducer;


