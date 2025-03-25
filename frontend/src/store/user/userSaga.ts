
import { call, put, takeLatest } from "redux-saga/effects";

import {
    fetchInsertUserFailure,
    fetchInsertUserStart,
    fetchInsertUserSuccess,
} from "./userSlice";
import { insertUser } from "@/services/userService";

function* userInsertWorkerSaga(action: any): Generator<any, void, any> {
    console.log("Sageisn")
    const { payload } = action;
    try {
        const response = yield call(insertUser, payload);
        if (response.status_code === 201) {
            yield put(fetchInsertUserSuccess());
        } else {
            yield put(fetchInsertUserFailure());
        }
    } catch (error: any) {
        yield put(fetchInsertUserFailure());
    }
}



export function* userSaga() {
    yield takeLatest(fetchInsertUserStart.type, userInsertWorkerSaga);
}

