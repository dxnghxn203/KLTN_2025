import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categories: any[];
    mainCategories: any[];
    subCategories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    mainCategories: [],
    subCategories: [],
    categories: [],
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
            console.log("Fetching categories started");  
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
        }

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
} = categorySlice.actions;

export default categorySlice.reducer;


