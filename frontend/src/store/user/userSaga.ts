
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

    fetchForgotPasswordFailure,
    fetchForgotPasswordStart,
    fetchForgotPasswordSuccess,

    fetchChangePasswordFailure,
    fetchChangePasswordStart,
    fetchChangePasswordSuccess,

    fetchChangePasswordAdminFailure,
    fetchChangePasswordAdminStart,
    fetchChangePasswordAdminSuccess,

    fetchForgotPasswordAdminFailure,
    fetchForgotPasswordAdminStart,
    fetchForgotPasswordAdminSuccess,
    fetchUpdateStatusUserSuccess,
    fetchUpdateStatusUserFailure,
    fetchUpdateStatusUserStart,

    fetchChangePasswordPharmacistFailure,
    fetchChangePasswordPharmacistStart,
    fetchChangePasswordPharmacistSuccess,
    fetchForgotPasswordPharmacistStart,
    fetchForgotPasswordPharmacistFailure,
    fetchForgotPasswordPharmacistSuccess

} from "./userSlice";
import { getAllUserAdmin, insertUser, sendOtp, verifyOtp,forgotPasswordUser, changePasswordUser, changePasswordAdmin, forgotPasswordAdmin, updateStatusUser, changePasswordPharmacist, forgotPasswordPharmacist } from "@/services/userService";
import { getToken} from '@/utils/cookie';
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

function* userForgotPasswordWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    
    try
    {
            const response = yield call(forgotPasswordUser, body);
            if (response.status_code === 200) {
                yield put(fetchForgotPasswordSuccess(response.data));
                onSuccess(response.message);
            } else {
                yield put(fetchForgotPasswordFailure());
                onFailure(response.message);
            }
        }
    catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchForgotPasswordFailure());
    }
}

function* userChangePasswordWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    const token = getToken();
    try {
        const response = yield call(changePasswordUser, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordFailure());
    }
}

function* userChangePasswordAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    try {
        const response = yield call(changePasswordAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordAdminSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordAdminFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordAdminFailure());
    }
}

export function* userForgotPasswordAdminWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    try {
        const response = yield call(forgotPasswordAdmin, body);
        if (response.status_code === 200) {
            yield put(fetchForgotPasswordAdminSuccess(response.data));
            onSuccess(response.message);
            console.log("response", response)
        } else {
            yield put(fetchForgotPasswordAdminFailure());
            onFailure(response.message);
        console.log("response", response)
        }
    }
    catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchForgotPasswordAdminFailure());
    }
}

function* updateStatusUserWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
    } = payload;    
    try {
        const response = yield call(updateStatusUser, payload);
        if (response.status_code === 200) {
            yield put(fetchUpdateStatusUserSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchUpdateStatusUserFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        yield put(fetchUpdateStatusUserFailure());
    }
}

function* changePasswordPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        old_password,
        new_password,
    } = payload;    
    const body = {
        old_password,
        new_password
    };
    try {
        const response = yield call(changePasswordPharmacist, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordPharmacistSuccess());
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordPharmacistFailure());
    }
}

function* forgotPasswordPharmacistWorkerSaga(action: any): Generator<any, void, any> {
    const { payload } = action;
    const {
        onSuccess =()=> {},
        onFailure =()=> {},
        email
    } = payload;
    const body = {
        email
    };
    try {
        const response = yield call(forgotPasswordPharmacist, body);
        if (response.status_code === 200) {
            yield put(fetchChangePasswordPharmacistSuccess(response.data));
            onSuccess(response.message);
        } else {
            yield put(fetchChangePasswordPharmacistFailure());
            onFailure(response.message);
        }
    } catch (error: any) {
        onFailure(error?.response?.data?.message);
        yield put(fetchChangePasswordPharmacistFailure());
    }
}
export function* userSaga() {
    yield takeLatest(fetchInsertUserStart.type, userInsertWorkerSaga);
    yield takeLatest(fetchVerifyOtpStart.type, userVerifyOtpWorkerSaga);
    yield takeLatest(fetchSendOtpStart.type, userSendOtpWorkerSaga);
    yield takeLatest(fetchGetAllUserAdminStart.type, userGetAllUserAdminWorkerSaga);
    yield takeLatest(fetchForgotPasswordStart.type, userForgotPasswordWorkerSaga);
    yield takeLatest(fetchChangePasswordStart.type, userChangePasswordWorkerSaga);
    yield takeLatest(fetchChangePasswordAdminStart.type, userChangePasswordAdminWorkerSaga);
    yield takeLatest(fetchForgotPasswordAdminStart.type, userForgotPasswordAdminWorkerSaga);
    yield takeLatest(fetchUpdateStatusUserStart.type, updateStatusUserWorkerSaga);
    yield takeLatest(fetchChangePasswordPharmacistStart.type, changePasswordPharmacistWorkerSaga);
    yield takeLatest(fetchForgotPasswordPharmacistStart.type, forgotPasswordPharmacistWorkerSaga);
}

