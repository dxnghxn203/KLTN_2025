import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        fetchGetAllCategoryStart(state) {
            state.loading = true;
        },
        fetchGetAllCategorySuccess(state, action: PayloadAction<any[]>) {
            state.categories = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCategoryFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,
} = categorySlice.actions;

export default categorySlice.reducer;


