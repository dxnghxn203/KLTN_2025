import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { cartSaga } from './cart';
import { productSaga } from './product';
import { orderSaga } from './order';

export default function* rootSaga() {
    yield all([fork(authSaga)]);
    yield all([fork(cartSaga)]);
    yield all([fork(productSaga)]);
    yield all([fork(orderSaga)]);
}
