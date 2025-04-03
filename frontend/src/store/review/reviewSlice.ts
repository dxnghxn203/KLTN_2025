import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReviewState {
    reviews: any[];
    comments: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    comments: [],
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
        // Fetch comments by product ID
        fetchGetAllCommentStart(state, action: PayloadAction<any>) {
            console.log("fetchGetAllCommentStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllCommentSuccess(state, action: PayloadAction<any[]>) {
            console.log("fetchGetAllCommentSuccess", action.payload);
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCommentFailed(state, action: PayloadAction<string>) {
            console.log("fetchGetAllCommentFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        }  

        
    },
});

export const {
    fetchGetAllReviewStart,
    fetchGetAllReviewSuccess,
    fetchGetAllReviewFailed,
    fetchGetAllCommentStart,
    fetchGetAllCommentSuccess,
    fetchGetAllCommentFailed,
} = reviewSlice.actions;

export default reviewSlice.reducer;


