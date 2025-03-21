import { call, put, takeLatest } from 'redux-saga/effects';
import * as categoryService from '@/services/categoryService';
import {
    fetchGetAllCategoryStart,
    fetchGetAllCategorySuccess,
    fetchGetAllCategoryFailed,

    fetchGetMainCategoryStart, 
    fetchGetMainCategorySuccess,
    fetchGetMainCategoryFailed,

    fetchGetSubCategoryStart,
    fetchGetSubCategorySuccess,
    fetchGetSubCategoryFailed,
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


function* fetchGetSubCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const category = yield call(categoryService.getSubCategory, payload.mainCategory, payload.subCategory);
        if (category.code === 200) {
            yield put(fetchGetSubCategorySuccess(category.data));
            return;
        }
        yield put(fetchGetSubCategoryFailed("Category not found")); 
    }
    catch (error) {
        yield put(fetchGetSubCategoryFailed("Failed to fetch category"));
    }
}
export function* categorySaga() {
    yield takeLatest(fetchGetAllCategoryStart.type, fetchGetAllCategory);
    yield takeLatest(fetchGetMainCategoryStart.type, fetchGetMainCategory);
    yield takeLatest(fetchGetSubCategoryStart.type, fetchGetSubCategory);

}
