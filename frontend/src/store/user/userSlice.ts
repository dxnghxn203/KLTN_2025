/* Core */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
    responseInsertUser: any;
    loading: boolean;
    allUserAdmin: any[];
}

const initialState: UserSliceState = {
    responseInsertUser: null,
    loading: false,
    allUserAdmin: []
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

} = userSlice.actions;

export default userSlice.reducer;

