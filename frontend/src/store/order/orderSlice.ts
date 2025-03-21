import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    orders: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        fetchGetAllOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetAllOrderSuccess(state, action: PayloadAction<any[]>) {
            state.orders = action.payload
            state.loading = false;
            state.error = null;
        },
        fetchGetAllOrderFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // check order
        fetchCheckOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckOrderSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.error = null;
        },
        fetchCheckOrderFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchGetAllOrderStart,
    fetchGetAllOrderSuccess,
    fetchGetAllOrderFailed,

    fetchCheckOrderStart,
    fetchCheckOrderSuccess,
    fetchCheckOrderFailed
} = orderSlice.actions;

export default orderSlice.reducer;


