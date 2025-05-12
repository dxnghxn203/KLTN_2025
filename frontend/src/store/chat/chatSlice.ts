import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: any = {
    loading: false,
    error: null,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        fetchChatBoxInitStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchChatBoxSuccess(state, action) {
            state.loading = false;
        },
        fetchChatBoxFailed(state, action) {
            state.loading = false;
        },

    },
});

export const {
    fetchChatBoxInitStart,
    fetchChatBoxSuccess,
    fetchChatBoxFailed
} = chatSlice.actions;

export default chatSlice.reducer;


