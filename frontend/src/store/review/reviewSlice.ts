import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReviewState {
    reviews: any[];
    comments: any[];
    responseInsertReview: any;
    responseInsertComment: any;
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    comments: [],
    responseInsertReview: null,
    responseInsertComment: null,
    loading: false,
    error: null,
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        // Fetch product by slug
        fetchGetAllReviewStart(state, action: PayloadAction<any>) {
            // console.log("fetchGetAllReviewStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllReviewSuccess(state, action: PayloadAction<any[]>) {
            // console.log("fetchGetAllReviewSuccess", action.payload);
            state.reviews = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllReviewFailed(state, action: PayloadAction<string>) {
            // console.log("fetchGetAllReviewFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // Fetch comments by product ID
        fetchGetAllCommentStart(state, action: PayloadAction<any>) {
            // console.log("fetchGetAllCommentStart reducer: ", action.payload);
            state.loading = true;
        },
        fetchGetAllCommentSuccess(state, action: PayloadAction<any[]>) {
            // console.log("fetchGetAllCommentSuccess", action.payload);
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchGetAllCommentFailed(state, action: PayloadAction<string>) {
            // console.log("fetchGetAllCommentFailed", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        // Insert review
        fetchReviewStart: (state) => {
            console.log("fetchReviewStart reducer: ");
            state.loading = true;
        },
        fetchReviewSuccess: (state) => {
            console.log("fetchReviewSuccess reducer: ");
            state.responseInsertReview = true;
            state.loading = false;
        },
        fetchReviewFailure: (state) => {
            console.log("fetchReviewFailure reducer: ");
            state.responseInsertReview = false;
            state.loading = false;
        },

        // Insert comment
        fetchCommentStart: (state) => {
            console.log("fetchCommentStart reducer: ");
            state.loading = true;
        },
        fetchCommentSuccess: (state) => {
            console.log("fetchCommentSuccess reducer: ");
            state.responseInsertComment = true;
            state.loading = false;
        },
        fetchCommentFailure: (state) => {
            console.log("fetchCommentFailure reducer: ");
            state.responseInsertComment = false;
            state.loading = false;
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

    fetchReviewStart,
    fetchReviewSuccess,
    fetchReviewFailure,

    fetchCommentStart,
    fetchCommentSuccess,
    fetchCommentFailure,

} = reviewSlice.actions;

export default reviewSlice.reducer;


