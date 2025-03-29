import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
    products: any[];
    productsAdmin: any[];
    product: any;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    productsAdmin: [],
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
            console.log("Fetching product by slug started");
            state.loading = true;
        },
        fetchProductBySlugSuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching product by slug successful, data:", action.payload);
            state.product = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductBySlugFailed(state, action: PayloadAction<string>) {
            console.log("Fetching product by slug failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch add product
        fetchAddProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAddProductSuccess(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = null;
        },
        fetchAddProductFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch all product admin
        fetchAllProductAdminStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductAdminSuccess(state, action: PayloadAction<any[]>) {
            state.productsAdmin = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductAdminFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,

    fetchAddProductStart,
    fetchAddProductSuccess,
    fetchAddProductFailed,

    fetchAllProductAdminStart,
    fetchAllProductAdminSuccess,
    fetchAllProductAdminFailed,
} = productSlice.actions;

export default productSlice.reducer;


