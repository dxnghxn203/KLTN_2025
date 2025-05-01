import { Admin, AuthState, User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    admin: null,
    token: null,
    isAdmin: false,
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
        googleLoginSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
        },
        googleLoginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Normal login actions
        loginStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            state.isAdmin = false; // Reset isAdmin to false on normal login

        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout actions
        logoutStart: (state) => {
            console.log("logoutStart");
            state.loading = true;
        },
        logoutSuccess: (state, ) => {
            console.log("logoutSuccess");
            state.loading = false;
            state.isAuthenticated = false;
            if (state.isAdmin){
                state.admin = null; // Reset admin on logout
            }
            else {
                state.user = null; // Reset user on logout
            }
            state.token = null;
            state.isAdmin = false; // Reset isAdmin on logout
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            console.log("logoutFailure", action.payload);
            state.loading = false;
            state.error = action.payload;
        },
        //login Admin
        loginAdminStart: (state) => {
            console.log("loginAdminStart"); 
            state.loading = true;
            state.error = null;
        },
        loginAdminSuccess: (state, action: PayloadAction<{ admin: Admin; token: string}>) => {
            console.log("loginAdminSuccess", action.payload);
            state.loading = false;
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.isAdmin = true;
            // state.error = null;
        },
        loginAdminFailure: (state, action: PayloadAction<string>) => {
            console.log("loginAdminFailure", action.payload);
            state.loading = false;
            state.error = action.payload;
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

    loginAdminStart,
    loginAdminSuccess,
    loginAdminFailure,
} = authSlice.actions;

export default authSlice.reducer;


