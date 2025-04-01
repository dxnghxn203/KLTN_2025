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

    fetchGetChildCategoryStart,
    fetchGetChildCategorySuccess,
    fetchGetChildCategoryFailed,

    fetchGetAllCategoryForAdminStart,
    fetchGetAllCategoryForAdminSuccess,
    fetchGetAllCategoryForAdminFailed,

    // fetchGetProductByMainSlugStart,
    // fetchGetProductByMainSlugSuccess,
    // fetchGetProductByMainSlugFailed
} from './categorySlice';
import { on } from 'events';

// Fetch all category
function* fetchGetAllCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const category = yield call(categoryService.getAllCategory);
        if (category.status_code === 200) {
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
        const {
            mainCategory,
            onSuccess = () => {},
            onFailure = () => {},
        } = payload;

        const category = yield call(categoryService.getMainCategory, mainCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetMainCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetMainCategoryFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetMainCategoryFailed("Failed to fetch category"));
    }
}
function* fetchGetSubCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            mainCategory,
            subCategory,
            onSuccess = () => {},
            onFailure = () => {},
        } = payload;
        const category = yield call(categoryService.getSubCategory, mainCategory,subCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetSubCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetSubCategoryFailed("Category not found")); 
    }
    catch (error) {
        yield put(fetchGetSubCategoryFailed("Failed to fetch category"));
    }
}

function* fetchGetChildCategory(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            mainCategory,
            subCategory,
            childCategory,
            onSuccess = () => {},
            onFailure = () => {},
        } = payload;
        const category = yield call(categoryService.getChildCategory, mainCategory, subCategory, childCategory);
        if (category.status_code === 200) {
            onSuccess()
            yield put(fetchGetChildCategorySuccess(category.data));
            return;
        }
        onFailure()
        yield put(fetchGetChildCategoryFailed("Category not found")); 
    }
    catch (error) {
        yield put(fetchGetChildCategoryFailed("Failed to fetch catfffegory"));
    }
}
// function* fetchGetProductByMainSlug(action: any): Generator<any, void, any> {
//     try {
//         const { payload } = action;
//         const product = yield call(categoryService.getProductByMainSlug, payload);
//         if (product.status_code === 200) {
//             yield put(fetchGetProductByMainSlugSuccess(product.data));
//             console.log("SAGA", product.data);
//             return;
//         }
//         yield put(fetchGetProductByMainSlugFailed("Product not found"));

//     }
//     catch (error) {
//         yield put(fetchGetProductByMainSlugFailed("Failed to fetch product"));
//     }
// }

// Fetch all category for admin
function* fetchGetAllCategoryForAdmin(action: any): Generator<any, void, any> {
    try {
        const category = yield call(categoryService.getAllCategoryForAdmin);
        if (category.status_code === 200) {
            yield put(fetchGetAllCategoryForAdminSuccess(category.data));
            return;
        }
        yield put(fetchGetAllCategoryForAdminFailed("Category not found"));

    } catch (error) {
        yield put(fetchGetAllCategoryForAdminFailed("Failed to fetch order"));
    }
}

export function* categorySaga() {
    yield takeLatest(fetchGetAllCategoryStart.type, fetchGetAllCategory);
    yield takeLatest(fetchGetMainCategoryStart.type, fetchGetMainCategory);
    yield takeLatest(fetchGetSubCategoryStart.type, fetchGetSubCategory);
    yield takeLatest(fetchGetChildCategoryStart.type, fetchGetChildCategory);
    yield takeLatest(fetchGetAllCategoryForAdminStart.type, fetchGetAllCategoryForAdmin);
    // yield takeLatest(fetchGetProductByMainSlugStart.type, fetchGetProductByMainSlug);


}
