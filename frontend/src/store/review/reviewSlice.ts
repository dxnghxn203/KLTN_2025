import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReviewState {
    reviews: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        // Fetch product by slug
        fetchGetAllReviewStart(state, action: PayloadAction<any>) {
            console.log("fetchGetAllReviewStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllReviewSuccess(state, action: PayloadAction<any[]>) {
            console.log("fetchGetAllReviewSuccess", action.payload);
            state.reviews = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllReviewFailed(state, action: PayloadAction<string>) {
            console.log("fetchGetAllReviewFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        
    },
});

export const {
    fetchGetAllReviewStart,
    fetchGetAllReviewSuccess,
    fetchGetAllReviewFailed,
} = reviewSlice.actions;

export default reviewSlice.reducer;


