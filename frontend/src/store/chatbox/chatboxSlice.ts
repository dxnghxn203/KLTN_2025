import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ChatboxState {
    allConversationWaiting : any[]
    loading: boolean;
    error: string | null;
}

const initialState: ChatboxState = {
    
    allConversationWaiting : [],
    loading: false,
    error: null,
};

export const chatboxSlice = createSlice({
    name: "chatbox",
    initialState,
    reducers: {

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
    
    fetchGetAllConversationWaitingStart,
    fetchGetAllConversationWaitingSuccess,
    fetchGetAllConversationWaitingFailed,
    

} = chatboxSlice.actions;

export default chatboxSlice.reducer;


