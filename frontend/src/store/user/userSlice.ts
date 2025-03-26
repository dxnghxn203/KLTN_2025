/* Core */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
    responseInsertUser: any;
    loading: boolean;
}

const initialState: UserSliceState = {
    responseInsertUser: null,
    loading: false,
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
        }
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
    fetchSendOtpFailure

} = userSlice.actions;

export default userSlice.reducer;

