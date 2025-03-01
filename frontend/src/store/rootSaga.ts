import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth/authSaga';
// Import other sagas here

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    // Add other sagas here
  ]);
}
