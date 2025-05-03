import {call, put, takeLatest} from 'redux-saga/effects';
import * as authService from '@/services/authService';
import {
    googleLoginStart,
    googleLoginSuccess,
    googleLoginFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    logoutStart,
    logoutSuccess,
    logoutFailure,
    loginAdminStart,
    loginAdminSuccess,
    loginAdminFailure,
    loginPharmacistStart,
    loginPharmacistSuccess,
    loginPharmacistFailure,
} from './authSlice';
import {getSession, signIn, signOut} from 'next-auth/react';
import {PayloadAction} from '@reduxjs/toolkit';
import {removeToken, setToken, getToken, setTokenAdmin, setTokenPharmacist} from '@/utils/cookie';
import {getDeviceId} from '@/utils/deviceId';
import {setClientToken} from '@/utils/configs/axiosClient';

// Google Login
function* handleGoogleLogin(): Generator<any, void, any> {
    try {
        const signInGG = yield call(signIn, "google", {
            redirect: false,
            prompt: "select_account"
        });

        if (signInGG?.error) {
            yield put(googleLoginFailure('Đăng nhập bằng Google thất bại'));
        } else {
            const session = yield call(getSession)
            yield put(googleLoginSuccess(session.user));
        }
    } catch (error: any) {
        yield put(googleLoginFailure(error.message || 'Đăng nhập bằng Google thất bại'));
    }
}

// Login with credentials
function* handleLogin(action: PayloadAction<any>): Generator<any, void, any> {

    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailed = () => {
        },
        ...credentials
    } = payload;

    const device_id = getDeviceId();

    const form = new FormData();
    form.append('email', credentials.email);
    form.append('password', credentials.password);
    form.append('device_id', device_id);

    try {
        const response = yield call(authService.login, form);
        if (response.status_code === 200) {
            onSuccess();
            setToken(response?.token);
            yield put(
                loginSuccess({
                    user: response?.user || null,
                    token: response?.token || null,
                })
            );

        } else {
            console.log('Login failed:', response.message);
            onFailed(response.message);
            yield put(loginFailure(response.message || 'Đăng nhập thất bại'));
        }
    } catch (error: any) {
        onFailed(error?.message || 'Đăng nhập thất bại');
        yield put(loginFailure(error.message || 'Đăng nhập thất bại'));
    }
}

// Logout
function* handleLogout(): Generator<any, void, any> {
    try {
        const response = yield call(signOut, {redirect: false});
        const token = getToken();
        if (token) {
            yield call(authService.logout, token);
        }
        removeToken();
        yield put(logoutSuccess());
    } catch (error: any) {
        console.log('Logout error:', error);
        yield put(logoutFailure(error.message || 'Đăng xuất thất bại'));
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    }
}

// loginAdmin
function* handleLoginAdmin(action: PayloadAction<any>): Generator<any, void, any> {
    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailure = () => {
        },
        ...credentials
    } = payload;
    const device_id = getDeviceId();
    const form = new FormData();
    form.append('email', credentials.email);
    form.append('password', credentials.password);
    form.append('device_id', device_id);
    try {
        const response = yield call(authService.loginAdmin, form);
        if (response.success) {
            onSuccess(response?.message);
            setTokenAdmin(response?.token);
            yield put(
                loginAdminSuccess({
                    admin: response?.admin || null,
                    token: response?.token || null,

                })
            );
        } else {
            onFailure(response.message);
            yield put(loginAdminFailure(response.message));
        }
    } catch (error: any) {
        onFailure(error?.message || 'Đăng nhập thất bại');
        yield put(loginAdminFailure(error.message || 'Đăng nhập thất bại'));
    }
}

// loginPharmacist
function* handleLoginPharmacist(action: PayloadAction<any>): Generator<any, void, any> {
    const {payload} = action;
    const {
        onSuccess = () => {
        },
        onFailure = () => {
        },
        ...credentials
    } = payload;
    const device_id = getDeviceId();
    const form = new FormData();
    form.append('email', credentials.email);
    form.append('password', credentials.password);
    form.append('device_id', device_id);
    try {
        const response = yield call(authService.loginPharmacist, form);
        if (response.success) {
            onSuccess(response?.message);
            setTokenPharmacist(response?.token);
            yield put(
                loginPharmacistSuccess({
                    pharmacist: response?.pharmacist || null,
                    token: response?.token || null,

                })
            );
        } else {
            onFailure(response.message);
            yield put(loginPharmacistFailure(response.message));
        }
    } catch (error: any) {
        onFailure(error?.message || 'Đăng nhập thất bại');
        yield put(loginPharmacistFailure(error.message || 'Đăng nhập thất bại'));
    }
}

// Check auth status
export function* authSaga() {
    yield takeLatest(googleLoginStart.type, handleGoogleLogin);
    yield takeLatest(loginStart.type, handleLogin);
    yield takeLatest(logoutStart.type, handleLogout);
    yield takeLatest(loginAdminStart.type, handleLoginAdmin);
    yield takeLatest(loginPharmacistStart.type, handleLoginPharmacist);
}
