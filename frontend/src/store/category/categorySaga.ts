import { call, put, takeLatest } from 'redux-saga/effects';
import * as categoryService from '@/services/categoryService';
import {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,
} from './categorySlice';

// Fetch all category
function* fetchGetAllCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const category = yield call(categoryService.getAllCategory);
        if (category.status === 200) {
            yield put(fetchGetAllCategorySuccess(category.data));
            return;
        }
        yield put(fetchGetAllCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetAllCategoryFailed("Failed to fetch order"));
    }
}

export function* categorySaga() {
    yield takeLatest(fetchGetAllCategoryStart.type, fetchGetAllCategory);
}
