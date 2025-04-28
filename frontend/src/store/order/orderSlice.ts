import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    orders: any[];
    ordersAdmin: any[];
    ordersByUser: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    ordersAdmin: [],
    ordersByUser: [],
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
        },
        // 
        fetchGetAllOrderAdminStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetAllOrderAdminSuccess(state, action: PayloadAction<any[]>) {
            state.ordersAdmin = action.payload
            state.loading = false;
        },
        fetchGetAllOrderAdminFailed(state) {
            state.loading = false;
        },
        // get order by user
        fetchGetOrderByUserStart(state) {
            state.loading = true;
        },
        fetchGetOrderByUserSuccess(state, action: PayloadAction<any[]>) {
            state.ordersByUser = action.payload
            state.loading = false;
        },
        fetchGetOrderByUserFailed(state) {
            state.loading = false;
        },
        // call webhook
        fetchCallWebhookStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCallWebhookSuccess(state) {
            state.loading = false;
        },
        fetchCallWebhookFailed(state) {
            state.loading = false;
        },
        // check shipping fee
        fetchCheckShippingFeeStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCheckShippingFeeSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
        },
        fetchCheckShippingFeeFailed(state) {
            state.loading = false;
        },
        //cancel order
        fetchCancelOrderStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchCancelOrderSuccess(state) {
            state.loading = false;
        },
        fetchCancelOrderFailed(state) {
            state.loading = false;
        },
        //get tracking code
        fetchGetTrackingCodeStart(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchGetTrackingCodeSuccess(state, action: PayloadAction<any>) {
            state.loading = false; 
        },
        fetchGetTrackingCodeFailed(state) {
            state.loading = false;
        }, 

        // download invoice
        fetchDownloadInvoiceStart(state, action: PayloadAction<any>) {
            console.log('fetchDownloadInvoiceStart')
            state.loading = true;
        },
        fetchDownloadInvoiceSuccess(state, action: PayloadAction<any>) {
            console.log('fetchDownloadInvoiceSuccess')
            state.loading = false; 
        },
        fetchDownloadInvoiceFailed(state) {
            console.log('fetchDownloadInvoiceFailed')
            state.loading = false;
        },
    },
});

export const {
    fetchGetAllOrderStart,
    fetchGetAllOrderSuccess,
    fetchGetAllOrderFailed,

    fetchCheckOrderStart,
    fetchCheckOrderSuccess,
    fetchCheckOrderFailed,

    fetchGetAllOrderAdminStart,
    fetchGetAllOrderAdminSuccess,
    fetchGetAllOrderAdminFailed,

    fetchGetOrderByUserStart,
    fetchGetOrderByUserSuccess,
    fetchGetOrderByUserFailed,

    fetchCallWebhookStart,
    fetchCallWebhookSuccess,
    fetchCallWebhookFailed,

    fetchCheckShippingFeeStart,
    fetchCheckShippingFeeSuccess,
    fetchCheckShippingFeeFailed,

    fetchCancelOrderStart,
    fetchCancelOrderSuccess,
    fetchCancelOrderFailed,
    
    fetchGetTrackingCodeStart,
    fetchGetTrackingCodeSuccess,
    fetchGetTrackingCodeFailed,

    fetchDownloadInvoiceFailed,
    fetchDownloadInvoiceStart,
    fetchDownloadInvoiceSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;


