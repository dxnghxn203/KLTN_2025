import { all, fork } from 'redux-saga/effects';
import { productSagas } from './product';

export default function* rootSaga() {
    yield all([fork(productSagas)]);
}
