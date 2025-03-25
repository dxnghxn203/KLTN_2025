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

        fetchInsertUserStart: (state) => {
            console.log("Slice Start");
            state.loading = true;
        },
        fetchInsertUserSuccess: (state) => {
            console.log("Slice Success:");
            state.responseInsertUser = true;
            state.loading = false;
        },
        fetchInsertUserFailure: (state) => {

            console.log("Slice Failure");
            state.responseInsertUser = false
            state.loading = false;
        },

        
    },
});

export const {
    fetchInsertUserStart,
    fetchInsertUserSuccess,
    fetchInsertUserFailure,

} = userSlice.actions;

export default userSlice.reducer;

