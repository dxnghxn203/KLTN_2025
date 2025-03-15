import { call, put, takeLatest } from 'redux-saga/effects';
import * as orderService from '@/services/orderService';
import {
    fetchGetAllOrderStart,
    fetchGetAllOrderSuccess,
    fetchGetAllOrderFailed,
} from './orderSlice';

// Fetch all order
function* fetchGetAllOrder(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(orderService.getAllOrder, payload);
        if (product.status === 200) {
            yield put(fetchGetAllOrderSuccess(product.data));
            return;
        }
        yield put(fetchGetAllOrderFailed("Order not found"));

    } catch (error) {
        yield put(fetchGetAllOrderFailed("Failed to fetch order"));
    }
}

export function* orderSaga() {
    yield takeLatest(fetchGetAllOrderStart.type, fetchGetAllOrder);
}
