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
} from './authSlice';
import { getSession, signIn, signOut } from 'next-auth/react';
import { LoginCredentials } from '@/types/auth';
import { PayloadAction } from '@reduxjs/toolkit';

// Google Login
function* handleGoogleLogin(): Generator<any, void, any> {
    try {
        const signInGG = yield call(signIn, "google", {
            redirect: false,
            prompt: "select_account"
        });

        const session = yield call(getSession);
        if (!session) {
            yield put(googleLoginFailure('Đăng nhập bằng Google thất bại'));
        } else {
            yield put(googleLoginSuccess(session.user));
        }
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
function* handleLogout(): Generator<any, void, any> {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(signOut, { redirect: false });

        if (token) {
            yield call(authService.logout, token);
        }
        localStorage.removeItem('token');
        yield put(logoutSuccess());

        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
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
export function* authSaga() {
    yield takeLatest(googleLoginStart.type, handleGoogleLogin);
    yield takeLatest(loginStart.type, handleLogin);
    yield takeLatest(logoutStart.type, handleLogout);
}
