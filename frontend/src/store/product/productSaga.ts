import { call, put, takeLatest } from 'redux-saga/effects';
import * as productService from '@/services/productService';
import {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,

    fetchAddProductStart,
    fetchAddProductSuccess,
    fetchAddProductFailed,

    fetchAllProductAdminStart,
    fetchAllProductAdminSuccess,
    fetchAllProductAdminFailed,

    fetchAllProductTopSellingStart,
    fetchAllProductTopSellingSuccess,
    fetchAllProductTopSellingFailed
} from './productSlice';

// Fetch product by slug
function* fetchProductBySlug(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductBySlug, payload);
        if (product.status_code === 200) {
            yield put(fetchProductBySlugSuccess(product.data));
            return;
        }
        console.log("Product Sagaa:", product.data);
        yield put(fetchProductBySlugFailed("Product not found"));

    } catch (error) {
        yield put(fetchProductBySlugFailed("Failed to fetch product by slug"));
    }
}

function* handlerAddProduct(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            form,
            onsucces = () => { },
            onfailed = () => { }
        } = payload;
        
        const formData = new FormData();
        
        Object.entries(form).forEach(([key, value]) => {
            if (key !== 'images' && key !== 'thumbnail' && value !== undefined) {
                formData.append(key, value as string);
            }
        });
        
        if (form.thumbnail instanceof File) {
            formData.append('thumbnail', form.thumbnail);
        }
        
        if (form.images && Array.isArray(form.images)) {
            form.images.forEach((file: File, index: number) => {
                if (file instanceof File) {
                    formData.append(`images[${index}]`, file);
                }
            });
        }
        
        if (form.attributes && typeof form.attributes === 'object') {
            formData.append('attributes', JSON.stringify(form.attributes));
        }

        const product = yield call(productService.addProduct, formData);
        if (product.status_code === 200) {
            onsucces(product.message);
            yield put(fetchAddProductSuccess());
            return;
        }
        onfailed(product.message);
        yield put(fetchAddProductFailed());

    } catch (error) {
        yield put(fetchAddProductFailed());
    }
}

function* handlerGetAllProductAdmin(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getAllProductAdmin, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductAdminSuccess(product.data));
            return;
        }
        yield put(fetchAllProductAdminFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductAdminFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product top selling
function* handlerGetAllProductTopSelling(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductTopSelling, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductTopSellingSuccess(product.data));
            return;
        }
        yield put(fetchAllProductTopSellingFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductTopSellingFailed("Failed to fetch product by slug"));
    }
}

export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
    yield takeLatest(fetchAddProductStart.type, handlerAddProduct);
    yield takeLatest(fetchAllProductAdminStart.type, handlerGetAllProductAdmin);
    yield takeLatest(fetchAllProductTopSellingStart.type, handlerGetAllProductTopSelling);
}
