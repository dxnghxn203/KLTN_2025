import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categories: any[];
    products: any[];
    categoryAdmin: any[];
    mainCategories: any[];
    subCategories: any[];
    childCategories:any[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    categoryAdmin: [],
    mainCategories: [],
    subCategories: [],
    childCategories:[],
    products: [],
    loading: false,
    error: null,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        fetchGetAllCategoryStart(state) {
            // console.log("Fetching categories started");
            state.loading = true;
        },
        fetchGetAllCategorySuccess(state, action: PayloadAction<any[]>) {
            // console.log("Fetching categories successful, data:", action.payload);
            state.categories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCategoryFailed(state, action: PayloadAction<string>) {
            // console.log("Fetching categories failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        },
        fetchGetMainCategoryStart(state) {
            // console.log("Fetching categories started");  
            state.loading = true;  
        },
        fetchGetMainCategorySuccess(state, action: PayloadAction<any[]>) {
            // console.log("Fetching categories successful, data:", action.payload);
            state.mainCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetMainCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        } ,
        fetchGetSubCategoryStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetSubCategorySuccess(state, action: PayloadAction<any[]>) {
            state.subCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetSubCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categories failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        },

        fetchGetChildCategoryStart(state, action: PayloadAction<any>) {
            console.log("Fetching categories started");

            state.loading = true;
        },
        fetchGetChildCategorySuccess(state, action: PayloadAction<any[]>) {
            console.log("Fetching categories successful, data:", action.payload);

            state.childCategories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetChildCategoryFailed(state, action: PayloadAction<string>) {
            console.log("Fetching categuuories failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        },
        // fetch product by main slug
        fetchGetProductByMainSlugStart(state, action: PayloadAction<string>) {
            console.log("Fetching product by main slug started");
            state.loading = true;
        },
        fetchGetProductByMainSlugSuccess(state, action: PayloadAction<any[]>) { 
            console.log("Fetching product by main slug successful, data:", action.payload);      
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetProductByMainSlugFailed(state, action: PayloadAction<string>) {
            console.log("Fetching product by main slug failed, error:", action);
            state.loading = false;
            state.error = action.payload;
        },
        // fetch all category for admin
        fetchGetAllCategoryForAdminStart(state) {
            state.loading = true;
        },
        fetchGetAllCategoryForAdminSuccess(state, action: PayloadAction<any[]>) {
            state.categoryAdmin = action.payload
            state.loading = false;
        },
        fetchGetAllCategoryForAdminFailed(state, action: PayloadAction<string>) {
            state.loading = false;
        },
    },
});

export const {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,

    fetchGetMainCategoryStart,
    fetchGetMainCategorySuccess,
    fetchGetMainCategoryFailed,

    fetchGetSubCategoryStart,
    fetchGetSubCategorySuccess,
    fetchGetSubCategoryFailed,

    fetchGetChildCategoryStart,
    fetchGetChildCategorySuccess,
    fetchGetChildCategoryFailed,

    fetchGetProductByMainSlugStart,
    fetchGetProductByMainSlugSuccess,
    fetchGetProductByMainSlugFailed,

    fetchGetAllCategoryForAdminStart,
    fetchGetAllCategoryForAdminSuccess,
    fetchGetAllCategoryForAdminFailed,
} = categorySlice.actions;

export default categorySlice.reducer;


