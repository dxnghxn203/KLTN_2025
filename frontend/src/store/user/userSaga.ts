
import { call, put, takeLatest } from "redux-saga/effects";

import {
    fetchInsertUserFailure,
    fetchInsertUserStart,
    fetchInsertUserSuccess,

    fetchVerifyOtpStart,
    fetchVerifyOtpSuccess,
    fetchVerifyOtpFailure
} from "./userSlice";
import { insertUser, verifyOtp } from "@/services/userService";
import { on } from "events";

function* userInsertWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;
    
    try {
        const response = yield call(insertUser, payload);
        if (response.status_code === 201) {
            yield put(fetchInsertUserSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchInsertUserFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchInsertUserFailure());
    }
}

function* userVerifyOtpWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload; 
    
    try {
        const response = yield call(verifyOtp, payload);
        if (response.status_code === 200) {
            yield put(fetchVerifyOtpSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchVerifyOtpFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchVerifyOtpFailure());
    }
}


export function* userSaga() {
    yield takeLatest(fetchInsertUserStart.type, userInsertWorkerSaga);
    yield takeLatest(fetchVerifyOtpStart.type, userVerifyOtpWorkerSaga);
}

