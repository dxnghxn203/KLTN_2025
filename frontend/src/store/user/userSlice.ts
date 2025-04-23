/* Core */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
    responseInsertUser: any;
    loading: boolean;
    allUserAdmin: any[];
    token: any;
}

const initialState: UserSliceState = {
    responseInsertUser: null,
    loading: false,
    allUserAdmin: [],
    token: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        fetchInsertUserStart: (state, action) => {
            state.loading = true;
        },
        fetchInsertUserSuccess: (state) => {
            state.responseInsertUser = true;
            state.loading = false;
        },
        fetchInsertUserFailure: (state) => {
            state.responseInsertUser = false
            state.loading = false;
        },
        // verifyOtp: 
        fetchVerifyOtpStart: (state, action) => {
            state.loading = true;
        },
        fetchVerifyOtpSuccess: (state) => {
            state.loading = false;
        },
        fetchVerifyOtpFailure: (state) => {
            state.loading = false;
        },
        // sendOtp:
        fetchSendOtpStart: (state, action) => {
            state.loading = true;
        },
        fetchSendOtpSuccess: (state) => {
            state.loading = false;
        },
        fetchSendOtpFailure: (state) => {
            state.loading = false;
        },
        // getAllUserAdmin:
        fetchGetAllUserAdminStart: (state, action) => {
            state.loading = true;
        },
        fetchGetAllUserAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.allUserAdmin = action.payload;
        },
        fetchGetAllUserAdminFailure: (state) => {
            state.loading = false;
        },

        // forgotPassword:
        fetchForgotPasswordStart: (state, action) => {
            state.loading = true;
        },
        fetchForgotPasswordSuccess: (state) => {
            state.loading = false;
        },
        fetchForgotPasswordFailure: (state) => {
            state.loading = false;
        },
        // changePassword:
        fetchChangePasswordStart: (state, action) => {
            state.loading = true;
        },
        fetchChangePasswordSuccess: (state) => {
            state.token = true;
            state.loading = false;
        },
        fetchChangePasswordFailure: (state) => {
            state.loading = false;
        },
        // changePasswordAdmin:
        fetchChangePasswordAdminStart: (state, action) => {
            state.loading = true;
        },
        fetchChangePasswordAdminSuccess: (state) => {
            state.token = true;
            state.loading = false;
        },
        fetchChangePasswordAdminFailure: (state) => {
            state.loading = false;
        },

        //forgotPasswordAdmin
        fetchForgotPasswordAdminStart: (state, action) => {
            state.loading = true;
        },
        fetchForgotPasswordAdminSuccess: (state) => {
            state.loading = false;
        },
        fetchForgotPasswordAdminFailure: (state) => {
            state.loading = false;
        },

    },
});

export const {
    fetchInsertUserStart,
    fetchInsertUserSuccess,
    fetchInsertUserFailure,

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

} = userSlice.actions;

export default userSlice.reducer;

