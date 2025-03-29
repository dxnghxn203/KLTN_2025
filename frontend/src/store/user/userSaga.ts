
import { call, put, takeLatest } from "redux-saga/effects";

import {
    fetchInsertUserFailure,
    fetchInsertUserStart,
    fetchInsertUserSuccess,

    fetchVerifyOtpStart,
    fetchVerifyOtpSuccess,
    fetchVerifyOtpFailure,

    fetchSendOtpStart,
    fetchSendOtpSuccess,    
    fetchSendOtpFailure,

    fetchGetAllUserAdminStart,
    fetchGetAllUserAdminSuccess,
    fetchGetAllUserAdminFailure,
} from "./userSlice";
import { getAllUserAdmin, insertUser, sendOtp, verifyOtp } from "@/services/userService";

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
function* userSendOtpWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;    
    try {
        const response = yield call(sendOtp, payload);
        if (response.status_code === 200) {
            yield put(fetchSendOtpSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchSendOtpFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchSendOtpFailure());
    }
}

function* userGetAllUserAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    try {
        const response = yield call(getAllUserAdmin, payload);
        if (response.status_code === 200) {
            yield put(fetchGetAllUserAdminSuccess(response.data));
        } else {
            yield put(fetchGetAllUserAdminFailure());
        }
    } catch (error: any) {
        yield put(fetchGetAllUserAdminFailure());
    }
}

export function* userSaga() {
    yield takeLatest(fetchInsertUserStart.type, userInsertWorkerSaga);
    yield takeLatest(fetchVerifyOtpStart.type, userVerifyOtpWorkerSaga);
    yield takeLatest(fetchSendOtpStart.type, userSendOtpWorkerSaga);
    yield takeLatest(fetchGetAllUserAdminStart.type, userGetAllUserAdminWorkerSaga);
}

