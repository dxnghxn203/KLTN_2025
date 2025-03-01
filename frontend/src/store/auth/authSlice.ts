import { AuthState, User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Google login actions
        googleLoginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        googleLoginSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
        },
        googleLoginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Normal login actions
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout actions
        logoutStart: (state) => {
            state.loading = true;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Check auth status action
        checkAuthStart: (state) => {
            state.loading = true;
        },
        checkAuthSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        checkAuthFailure: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});

export const {
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
} = authSlice.actions;

export default authSlice.reducer;


