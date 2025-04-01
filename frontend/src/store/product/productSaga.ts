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
    fetchAllProductTopSellingFailed,

    fetchAllProductRelatedStart,
    fetchAllProductRelatedSuccess,
    fetchAllProductRelatedFailed,

    fetchAllProductGetRecentlyViewedStart,
    fetchAllProductGetRecentlyViewedSuccess,
    fetchAllProductGetRecentlyViewedFailed,
} from './productSlice';
import { getSession, getToken, setSession } from '@/utils/cookie';

// Fetch product by slug
function* fetchProductBySlug(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const token: any= getToken();
        const session = getSession();
        const product = token ?
            yield call(productService.getProductBySlug, payload) :
            yield call(productService.getProductBySlugSession, payload, session)
            ;
        if (product?.status_code === 200) {
            yield put(fetchProductBySlugSuccess(product?.data?.product));
            if (product?.data?.session_id && product?.data?.session_id !== session) {
                setSession(product?.data?.session_id);
            }
            return;
        }
        yield put(fetchProductBySlugFailed("Product not found"));

    } catch (error) {
        yield put(fetchProductBySlugFailed("Failed to fetch product by slug"));
    }
}

// Add product reviewed
function* fetchGetProductGetRecentlyViewed(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const token: any = getToken();
        const session = getSession();

        const product:any = token ?
            yield call(productService.getProductReviewToken) :
            yield call(productService.getProductReviewSession, session)
            ;

        if (product?.status_code === 200) {
            yield put(fetchAllProductGetRecentlyViewedSuccess(product?.data));
            return;
        }
        yield put(fetchAllProductGetRecentlyViewedFailed());
    }
    catch (error) {
        yield put(fetchAllProductGetRecentlyViewedFailed());
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

// Fetch all product related
function* handlerGetAllProductRelated(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductsRelated, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductRelatedSuccess(product.data));
            return;
        }
        yield put(fetchAllProductRelatedFailed("Product not found"));
    }
    catch (error) {
        yield put(fetchAllProductRelatedFailed("Failed to fetch product by slug"));
    }
}
export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
    yield takeLatest(fetchAddProductStart.type, handlerAddProduct);
    yield takeLatest(fetchAllProductAdminStart.type, handlerGetAllProductAdmin);
    yield takeLatest(fetchAllProductTopSellingStart.type, handlerGetAllProductTopSelling);
    yield takeLatest(fetchAllProductRelatedStart.type, handlerGetAllProductRelated);
    yield takeLatest(fetchAllProductGetRecentlyViewedStart.type, fetchGetProductGetRecentlyViewed);
}
