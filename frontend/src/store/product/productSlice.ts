import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
    products: any[];
    productsAdmin: any[];
    productsTopSelling: any[];
    productsRelated: any[];
    productsGetRecentlyViewed: any[];
    product: any;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    productsAdmin: [],
    productsTopSelling: [],
    productsGetRecentlyViewed: [],
    productsRelated: [],
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
        },
        // Fetch add product
        fetchAddProductStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAddProductSuccess(state) {
            state.loading = false;
            state.error = null;
        },
        fetchAddProductFailed(state) {
            state.loading = false;
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
        },
        // Fetch all product top selling
        fetchAllProductTopSellingStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductTopSellingSuccess(state, action: PayloadAction<any[]>) {
            state.productsTopSelling = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductTopSellingFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch all product related
        fetchAllProductRelatedStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchAllProductRelatedSuccess(state, action: PayloadAction<any[]>) {
            state.productsRelated = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductRelatedFailed(state, action: PayloadAction<string>) {    
            state.loading = false;
            state.error = action.payload;
        },

        // Fetch all product get-recently-viewed
        fetchAllProductGetRecentlyViewedStart(state) {
            state.loading = true;
        },
        fetchAllProductGetRecentlyViewedSuccess(state, action: PayloadAction<any[]>) {
            state.productsGetRecentlyViewed = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchAllProductGetRecentlyViewedFailed(state) {
            state.loading = false;
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

    fetchAllProductTopSellingStart,
    fetchAllProductTopSellingSuccess,
    fetchAllProductTopSellingFailed,
    
    fetchAllProductRelatedStart,
    fetchAllProductRelatedSuccess,
    fetchAllProductRelatedFailed,

    fetchAllProductGetRecentlyViewedStart,
    fetchAllProductGetRecentlyViewedSuccess,
    fetchAllProductGetRecentlyViewedFailed,
    
} = productSlice.actions;

export default productSlice.reducer;


