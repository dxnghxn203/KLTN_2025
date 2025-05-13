/* Core */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";

interface UserSliceState {
    responseInsertUser: any;
    loading: boolean;
    allUserAdmin: any[];
    allPharmacist: any[];
    allAdmin: any[];
    token: any;
}

const initialState: UserSliceState = {
    responseInsertUser: null,
    loading: false,
    allUserAdmin: [],
    allPharmacist: [],
    allAdmin: [],
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
            console.log("fetchForgotPasswordStart")
            state.loading = true;
        },
        fetchForgotPasswordSuccess: (state) => {
            console.log("fetchForgotPasswordSuccess")
            state.loading = false;
        },
        fetchForgotPasswordFailure: (state) => {
            console.log("fetchForgotPasswordFailure")
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
            console.log("fetchForgotPasswordAdminStart")
            state.loading = true;

        },
        fetchForgotPasswordAdminSuccess: (state) => {
            console.log("fetchForgotPasswordAdminSuccess")
            state.loading = false;
        },
        fetchForgotPasswordAdminFailure: (state) => {
            console.log("fetchForgotPasswordAdminFailure")
            state.loading = false;
        },
        // update statusUser
        fetchUpdateStatusUserStart: (state, action) => {
            state.loading = true;
        },
        fetchUpdateStatusUserSuccess: (state) => {
            state.loading = false;
        },
        fetchUpdateStatusUserFailure: (state) => {
            state.loading = false;
        },
        // change password pharmacist
        fetchChangePasswordPharmacistStart: (state, action) => {
            state.loading = true;
        },
        fetchChangePasswordPharmacistSuccess: (state) => {
            state.token = true;
            state.loading = false;
        },
        fetchChangePasswordPharmacistFailure: (state) => {
            state.loading = false;
        },
        // forgot password pharmacist
        fetchForgotPasswordPharmacistStart: (state, action) => {
            console.log("fetchForgotPasswordPharmacistStart")
            state.loading = true;
        },
        fetchForgotPasswordPharmacistSuccess: (state) => {
            console.log("fetchForgotPasswordPharmacistSuccess")
            state.loading = false;
        },
        fetchForgotPasswordPharmacistFailure: (state) => {
            console.log("fetchForgotPasswordPharmacistFailure")
            state.loading = false;
        },
        //fetch all pharmacist
        fetchGetAllPharmacistStart: (state, action) => {
            state.loading = true;
        },
        fetchGetAllPharmacistSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.allPharmacist = action.payload;
        },
        fetchGetAllPharmacistFailure: (state) => {
            state.loading = false;
        },
        //fetch all admin
        fetchGetAllAdminStart: (state, action) => {
            console.log("fetchGetAllAdminStart")
            state.loading = true;
        },
        fetchGetAllAdminSuccess: (state, action: PayloadAction<any>) => {
            console.log("fetchGetAllAdminSuccess", action.payload)
            state.loading = false;
            state.allAdmin = action.payload;
        },
        fetchGetAllAdminFailure: (state) => {
            console.log("fetchGetAllAdminFailure")
            state.loading = false;
        },
        // update status pharmacist
        fetchUpdateStatusPharmacistStart: (state, action) => {
            state.loading = true;
        },
        fetchUpdateStatusPharmacistSuccess: (state) => {
            state.loading = false;
        },
        fetchUpdateStatusPharmacistFailure: (state) => {
            state.loading = false;
        },
        // update status admin
        fetchUpdateStatusAdminStart: (state, action) => {
            state.loading = true;
        },
        fetchUpdateStatusAdminSuccess: (state) => {
            state.loading = false;
        },
        fetchUpdateStatusAdminFailure: (state) => {
            state.loading = false;
        },
        // insert pharmacist 
        fetchInsertPharmacistStart: (state, action) => {
            console.log("fetchInsertPharmacistStart", action.payload)
            state.loading = true;
        },
        fetchInsertPharmacistSuccess: (state, action) => {
            console.log("fetchInsertPharmacistSuccess", action.payload)
            state.loading = false;
        },
        fetchInsertPharmacistFailure: (state) => {
            console.log("fetchInsertPharmacistFailure")
            state.loading = false;
        },
        // fetch register admin
        fetchRegisterAdminStart: (state, action) => {
            state.loading = true;
        },
        fetchRegisterAdminSuccess: (state) => {
            state.loading = false;
        },
        fetchRegisterAdminFailure: (state) => {
            state.loading = false;
        },
        // fecth verifyOtp Admin 
        fetchVerifyOtpAdminStart: (state, action) => {
            console.log("fetchVerifyOtpAdminStart")
            state.loading = true;
        },
        fetchVerifyOtpAdminSuccess: (state) => {
            console.log("fetchVerifyOtpAdminSuccess")
            state.loading = false;
        },
        fetchVerifyOtpAdminFailure: (state) => {
            console.log("fetchVerifyOtpAdminFailure")
            state.loading = false;
        },
        // fetch sendOTP admin
        fetchSendOtpAdminStart: (state, action) => {
            
            state.loading = true;
        },
        fetchSendOtpAdminSuccess: (state) => {
            state.loading = false;
        },
        fetchSendOtpAdminFailure: (state) => {
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

    fetchUpdateStatusUserFailure,
    fetchUpdateStatusUserStart,
    fetchUpdateStatusUserSuccess,

    fetchChangePasswordPharmacistFailure,
    fetchChangePasswordPharmacistStart,
    fetchChangePasswordPharmacistSuccess,

    fetchForgotPasswordPharmacistFailure,
    fetchForgotPasswordPharmacistStart,
    fetchForgotPasswordPharmacistSuccess,

    fetchGetAllPharmacistStart,
    fetchGetAllPharmacistSuccess,
    fetchGetAllPharmacistFailure,

    fetchGetAllAdminStart,
    fetchGetAllAdminSuccess,
    fetchGetAllAdminFailure,

    fetchUpdateStatusPharmacistFailure,
    fetchUpdateStatusPharmacistStart,
    fetchUpdateStatusPharmacistSuccess,

    fetchUpdateStatusAdminFailure,
    fetchUpdateStatusAdminStart,
    fetchUpdateStatusAdminSuccess,

    fetchInsertPharmacistStart,
    fetchInsertPharmacistSuccess,
    fetchInsertPharmacistFailure,

    fetchRegisterAdminFailure ,
    fetchRegisterAdminStart,
    fetchRegisterAdminSuccess,

    fetchSendOtpAdminFailure,
    fetchSendOtpAdminStart,
    fetchSendOtpAdminSuccess,

    fetchVerifyOtpAdminFailure,
    fetchVerifyOtpAdminStart,
    fetchVerifyOtpAdminSuccess

} = userSlice.actions;

export default userSlice.reducer;

