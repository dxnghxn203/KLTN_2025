import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    orders: any[];
    ordersAdmin: any[];
    ordersByUser: any[];
    statistics365Days: any[];
    allRequestOrder: any[];
    allRequestOrderApprove: any[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    ordersAdmin: [],
    ordersByUser: [],
    statistics365Days: [],
    allRequestOrder: [],
    allRequestOrderApprove: [],
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

        // statistics365days
        fetchGetStatistics365DaysStart(state, action: PayloadAction<any>) {
            console.log('fetchGetStatistics365DaysStart')
            state.loading = true;
        },
        fetchGetStatistics365DaysSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetStatistics365DaysSuccess')
            state.statistics365Days = action.payload
            state.loading = false; 
        },
        fetchGetStatistics365DaysFailed(state) {
            console.log('fetchGetStatistics365DaysFailed')
            state.loading = false;
        },
        // fetch request prescription
        fetchRequestPrescriptionStart(state, action: PayloadAction<any>) {
            
            state.loading = true;
        },
        fetchRequestPrescriptionSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
        },
        fetchRequestPrescriptionFailed(state) {
            state.loading = false;
        },
         // fetch get request-order
        fetchGetRequestOrderStart(state, action: PayloadAction<any>) {
            // console.log('fetchGetRequestOrderStart')
            state.loading = true;
        },
        fetchGetRequestOrderSuccess(state, action: PayloadAction<any>) {
            // console.log('fetchGetRequestOrderSuccess')
            state.allRequestOrder = action.payload
            state.loading = false;
        },
        fetchGetRequestOrderFailed(state) {
            // console.log('fetchGetRequestOrderFailed')
            state.loading = false;
        },
        // fetch get approve request-order
        fetchGetApproveRequestOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchGetApproveRequestOrderStart')
            state.loading = true;
        },
        fetchGetApproveRequestOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchGetApproveRequestOrderSuccess')
            state.allRequestOrderApprove = action.payload;
            state.loading = false;
            state.error = null;
           
        },
        fetchGetApproveRequestOrderFailed(state) {
            console.log('fetchGetApproveRequestOrderFailed')
            state.loading = false;
            state.error = null;
        },
        // fetch approve request-order
        fetchApproveRequestOrderStart(state, action: PayloadAction<any>) {
            console.log('fetchApproveRequestOrderStart')
            state.loading = true;
        },
        fetchApproveRequestOrderSuccess(state, action: PayloadAction<any>) {
            console.log('fetchApproveRequestOrderSuccess')
            state.loading = false;
            state.error = null;
        },
        fetchApproveRequestOrderFailed(state) {
            console.log('fetchApproveRequestOrderFailed')
            state.loading = false;
            state.error = null;
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

    fetchGetStatistics365DaysFailed,
    fetchGetStatistics365DaysStart,
    fetchGetStatistics365DaysSuccess,

    fetchRequestPrescriptionFailed,
    fetchRequestPrescriptionStart,
    fetchRequestPrescriptionSuccess,

    fetchGetRequestOrderFailed,
    fetchGetRequestOrderStart,
    fetchGetRequestOrderSuccess,

    fetchGetApproveRequestOrderFailed,
    fetchGetApproveRequestOrderStart,
    fetchGetApproveRequestOrderSuccess,
    
    fetchApproveRequestOrderFailed,
    fetchApproveRequestOrderStart,  
    fetchApproveRequestOrderSuccess

} = orderSlice.actions;

export default orderSlice.reducer;


