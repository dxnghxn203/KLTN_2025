export const selectAllReview = (state: any) => state.review.reviews;
export const selectAllComment = (state: any) => state.review.comments;
export const selectLoading = (state: any) => state.review.loading;
export const insertReviewSelector = (state: any) => state.review.responseInsertReview;
export const insertCommentSelector = (state: any) => state.review.responseInsertComment;