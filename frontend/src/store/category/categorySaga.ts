import { call, put, takeLatest } from 'redux-saga/effects';
import * as categoryService from '@/services/categoryService';
import {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,

    fetchGetMainCategoryStart, 
    fetchGetMainCategorySuccess,
    fetchGetMainCategoryFailed,
} from './categorySlice';

// Fetch all category
function* fetchGetAllCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const category = yield call(categoryService.getAllCategory);
        if (category.code === 200) {
            yield put(fetchGetAllCategorySuccess(category.data));
            return;
        }
        yield put(fetchGetAllCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetAllCategoryFailed("Failed to fetch order"));
    }
}
function* fetchGetMainCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const category = yield call(categoryService.getMainCategory, payload);
        if (category.code === 200) {
            yield put(fetchGetMainCategorySuccess(category.data));
            return;
        }
        yield put(fetchGetMainCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetMainCategoryFailed("Failed to fetch category"));
    }
}

export function* categorySaga() {
    yield takeLatest(fetchGetAllCategoryStart.type, fetchGetAllCategory);
    yield takeLatest(fetchGetMainCategoryStart.type, fetchGetMainCategory);

}
