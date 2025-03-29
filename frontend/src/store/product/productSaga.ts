import { call, put, takeLatest } from 'redux-saga/effects';
import * as productService from '@/services/productService';
import {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,

    fetchAddProductStart,
    fetchAddProductSuccess,
    fetchAddProductFailed

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
            name,
            price,
            description,
            category,
            quantity,
            images,
            onsucces = () => { },
            onfailed = () => { }
        } = payload
        const form = new FormData();
        form.append('name', name);
        form.append('price', price);
        form.append('description', description);
        form.append('category', category);
        form.append('quantity', quantity);
        form.append('images', images);

        const product = yield call(productService.addProduct, form);
        if (product.status === 200) {
            onsucces("Product added successfully");
            yield put(fetchAddProductSuccess(product.data));
            return;
        }
        onfailed("Failed to add product");
        yield put(fetchAddProductFailed("Product not found"));

    } catch (error) {
        yield put(fetchAddProductFailed("Failed to fetch product by slug"));
    }
}

export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
    yield takeLatest(fetchAddProductStart.type, handlerAddProduct);
}
