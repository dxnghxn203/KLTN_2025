import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { cartSaga } from './cart';

export default function* rootSaga() {
    yield all([fork(authSaga)]);
    yield all([fork(cartSaga)]);

}
