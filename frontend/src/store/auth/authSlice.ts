import {Admin, AuthState, User} from "@/types/auth";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    admin: null,
    pharmacist: null,
    isAdmin: false,
    isPharmacist: false,
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
            state.error = null;
            state.admin = null;
            state.pharmacist = null;
            state.isAdmin = false;
            state.isPharmacist = false;

        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout actions
        logoutStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            if (state.isAdmin) {
                state.admin = null;
            } else if (state.isPharmacist) {
                state.pharmacist = null;
            }
            else {
                state.user = null;
            }
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        //login Admin
        loginAdminStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginAdminSuccess: (state, action: PayloadAction<{ admin: Admin; token: string }>) => {
            state.loading = false;
            state.admin = action.payload.admin;
            state.isAdmin = true;
            state.user = null;
            state.pharmacist = null;
            state.isPharmacist = false;
        },
        loginAdminFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // login pharmacist
        loginPharmacistStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginPharmacistSuccess: (state, action: PayloadAction<{ pharmacist: any; token: string }>) => {
            state.loading = false;
            state.pharmacist = action.payload.pharmacist;
            state.isPharmacist = true;
            state.user = null;
            state.admin = null;
            state.isAdmin = false;
        },
        loginPharmacistFailure: (state, action: PayloadAction<string>) => {
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

    loginPharmacistStart,
    loginPharmacistSuccess,
    loginPharmacistFailure,
} = authSlice.actions;

export default authSlice.reducer;


