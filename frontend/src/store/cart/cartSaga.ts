import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as cartService from '@/services/cartService';
import {
    addCartStart,
    addCartSuccess,
    addCartFailure,
    addCartLocal, 
    updateQuantityCartLocal, 
    removeCartLocal, 
    clearCartLocal 
} from './cartSlice';
import { selectCartLocal } from './cartSelector';

function* handleAddCart(): Generator<any, void, any> {
    try {
        const response = yield call(cartService.addCart, {});
        yield put(addCartSuccess(response));
    }
    catch (error) {
        yield put(addCartFailure('Lỗi thêm vào giỏ hàng'));
    }
}
export function* cartSaga() {
    yield takeLatest(addCartStart.type, handleAddCart);
}
