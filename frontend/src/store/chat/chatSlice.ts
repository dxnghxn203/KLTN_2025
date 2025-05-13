import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: any = {
        allConversationWaiting : [],

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

        fetchGetAllConversationWaitingStart (state, action) {
                    state.loading = true
        
                },
                fetchGetAllConversationWaitingSuccess(state, action: PayloadAction<any>) {
                    state.allConversationWaiting = action.payload;
                    state.loading = false;
                },
                fetchGetAllConversationWaitingFailed(state, action: PayloadAction<string>) {
                    state.loading = false;
                    state.error = action.payload;
                },

    },
});

export const {
    fetchChatBoxInitStart,
    fetchChatBoxSuccess,
    fetchChatBoxFailed,
     fetchGetAllConversationWaitingStart,
    fetchGetAllConversationWaitingSuccess,
    fetchGetAllConversationWaitingFailed,
} = chatSlice.actions;

export default chatSlice.reducer;


