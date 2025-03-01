import { call, put, takeLatest } from 'redux-saga/effects';
import * as productService from '@/services/productService';
import {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,
} from './productSlice';

// Fetch product by slug
function* fetchProductBySlug(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductBySlug, payload);
        if (product.status === 200) {
            yield put(fetchProductBySlugSuccess(product.data));
            return;
        }
        yield put(fetchProductBySlugFailed("Product not found"));

    } catch (error) {
        yield put(fetchProductBySlugFailed("Failed to fetch product by slug"));
    }
}

export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
}
