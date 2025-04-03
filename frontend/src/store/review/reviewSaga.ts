import { call, put, takeLatest } from 'redux-saga/effects';
import {
   fetchGetAllReviewStart,
    fetchGetAllReviewSuccess,
    fetchGetAllReviewFailed,

    fetchGetAllCommentStart,
    fetchGetAllCommentSuccess,
    fetchGetAllCommentFailed,
} from './reviewSlice';
import { getSession, getToken, setSession } from '@/utils/cookie';
import * as reviewService from '@/services/reviewService';

function* fetchGetAllReview(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const { id, onSuccess = () => {}, onFailure = () => {} } = payload;

        const review = yield call(reviewService.getAllReview, id);

        // Kiểm tra status_code từ response
        if (review.status_code === 200) {
            onSuccess();
            yield put(fetchGetAllReviewSuccess(review.data));
            // console.log(review.data, "review.data");
        } else {
            // Nếu status_code không phải 200
            onFailure();
            yield put(fetchGetAllReviewFailed("Review not found"));
            // console.log("API returned error status: ", review.status_code);
        }
    } catch (error) {
        // Log lỗi chi tiết nếu có
        // console.error("Error in fetchGetAllReview:", error);
        yield put(fetchGetAllReviewFailed("Failed to fetch Review"));
    }
}

function* fetchGetAllComment(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const { id, onSuccess = () => {}, onFailure = () => {} } = payload;

        const comment = yield call(reviewService.getAllComment, id);

        // Kiểm tra status_code từ response
        if (comment.status_code === 200) {
            onSuccess();
            yield put(fetchGetAllCommentSuccess(comment.data));
            console.log(comment.data, "comment.data");
        } else {
            // Nếu status_code không phải 200
            onFailure();
            yield put(fetchGetAllCommentFailed("Comment not found"));
            console.log("API returned error status: ", comment.status_code);
        }
    } catch (error) {
        // Log lỗi chi tiết nếu có
        console.error("Error in fetchGetAllComment:", error);
        yield put(fetchGetAllCommentFailed("Failed to fetch Comment"));
    }
}

export function* reviewSaga() {
    yield takeLatest(fetchGetAllReviewStart.type, fetchGetAllReview);
    yield takeLatest(fetchGetAllCommentStart.type, fetchGetAllComment);
    
    

}
