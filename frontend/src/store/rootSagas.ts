import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { cartSaga } from './cart';
import { productSaga } from './product';
import { orderSaga } from './order';
import { locationSaga } from './location';
import { categorySaga } from './category';

export default function* rootSaga() {
    yield all([fork(authSaga)]);
    yield all([fork(cartSaga)]);
    yield all([fork(productSaga)]);
    yield all([fork(orderSaga)]);
    yield all([fork(locationSaga)]);
    yield all([fork(categorySaga)]);
}
