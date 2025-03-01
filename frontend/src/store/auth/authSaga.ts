import { call, put, takeLatest } from 'redux-saga/effects';
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
    checkAuthStart,
    checkAuthSuccess,
    checkAuthFailure,
} from './authSlice';
import { signIn } from 'next-auth/react';
import { LoginCredentials } from '@/types/auth';
import { PayloadAction } from '@reduxjs/toolkit';

// Google Login
function* handleGoogleLogin(): Generator<any, void, any> {
    try {
        const signInGG = yield call(signIn, "google",{prompt: "select_account", callbackUrl: "/home"});
        yield put(googleLoginSuccess());
    } catch (error: any) {
        yield put(googleLoginFailure(error.message || 'Đăng nhập bằng Google thất bại'));
    }
}

// Login with credentials
function* handleLogin(action: PayloadAction<LoginCredentials>): Generator<any, void, any> {
    try {
        const response = yield call(authService.login, action.payload);

        if (response.success) {
            localStorage.setItem('token', response.token);

            yield put(
                loginSuccess({
                    user: response?.user || null,
                    token: response?.token || null,
                })
            );

        } else {
            yield put(loginFailure(response.message || 'Đăng nhập thất bại'));
        }
    } catch (error: any) {
        yield put(loginFailure(error.message || 'Đăng nhập thất bại'));
    }
}

// Logout
function* handleLogout() {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            yield call(authService.logout, token);
        }

        // Clear local storage
        localStorage.removeItem('token');

        yield put(logoutSuccess());

        // Redirect to home page
        // if (typeof window !== 'undefined') {
        //     window.location.href = '/login';
        // }
    } catch (error: any) {
        yield put(logoutFailure(error.message || 'Đăng xuất thất bại'));
        // Still remove token and redirect even if server request fails
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    }
}

// Check auth status
function* checkAuth(): Generator<any, void, any> {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            yield put(checkAuthFailure());
            return;
        }

        const response = yield call(authService.verifyToken, token);

        if (response.isValid) {
            yield put(checkAuthSuccess({
                user: response.userData,
                token,
            }));
        } else {
            // Token is invalid
            localStorage.removeItem('token');
            yield put(checkAuthFailure());
        }
    } catch (error) {
        localStorage.removeItem('token');
        yield put(checkAuthFailure());
    }
}

export function* authSaga() {
    yield takeLatest(googleLoginStart.type, handleGoogleLogin);
    yield takeLatest(loginStart.type, handleLogin);
    yield takeLatest(logoutStart.type, handleLogout);
    yield takeLatest(checkAuthStart.type, checkAuth);
}
