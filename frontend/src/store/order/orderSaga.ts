import { call, put, takeLatest } from 'redux-saga/effects';
import * as orderService from '@/services/orderService';
import {
    fetchGetAllOrderStart,
    fetchGetAllOrderSuccess,
    fetchGetAllOrderFailed,

    fetchCheckOrderStart,
    fetchCheckOrderSuccess,
    fetchCheckOrderFailed,

    fetchGetAllOrderAdminStart,
    fetchGetAllOrderAdminSuccess,
    fetchGetAllOrderAdminFailed,
} from './orderSlice';

// Fetch all order
function* fetchGetAllOrder(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(orderService.getAllOrder, payload);
        if (product.status === 200) {
            yield put(fetchGetAllOrderSuccess(product.data));
            return;
        }
        yield put(fetchGetAllOrderFailed("Order not found"));

    } catch (error) {
        yield put(fetchGetAllOrderFailed("Failed to fetch order"));
    }
}
// Check order
function* fetchCheckOrder(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            onSuccess = () => { },
            onFailed = () => { },
            ...orderData
        } = payload;

        const addressInfo = orderData.addressInfo || {};
        const product = orderData.product || {};
        
        const apiPayload = {
            product: [
                {
                    "product_id": "PRODUCTL4A1742438024",
                    "price_id": "PRICEGXM1742438022",
                    "product_name": "NutriGrow Nutrimed",
                    "unit": "Hộp",
                    "quantity": 1,
                    "price": 480000
                }
            ],
            pick_from: {
                "name": "medicare",
                "phone_number": "string",
                "email": "string",
                "address": {
                    "address": "string",
                    "ward": "string",
                    "district": "string",
                    "province": "string"
                }
            },
            pick_to: {
                "name": "Hên",
                "phone_number": "0799699159",
                "email": "null",
                "address": {
                    "address": addressInfo.address || "",
                    "ward": addressInfo.ward || "",
                    "district": addressInfo.district || "",
                    "province": addressInfo.city || ""
                }
            },
            "sender_province_code": 0,
            "sender_district_code": 0,
            "sender_commune_code": 0,
            "receiver_province_code": addressInfo.cityCode || 0,
            "receiver_district_code": addressInfo.districtCode || 0,
            "receiver_commune_code": addressInfo.wardCode || 0,
            "delivery_instruction": ""
        };

        console.log(apiPayload);
        const rs = yield call(orderService.checkOrder, apiPayload);
        
        // Check if response is an image (QR code)
        // if (rs.headers && 
        //     rs.headers['content-type'] === 'image/png' && 
        //     rs.headers['content-disposition']?.includes('attachment')) {
        //     onSuccess(rs.data);
        //     yield put(fetchCheckOrderSuccess({}));
        //     return;
        // }
        
        onSuccess(rs.data);
        yield put(fetchCheckOrderSuccess({}));
        // Check for regular success response
        // if (rs.status === 'success') {
        //     onSuccess(rs.data);
        //     yield put(fetchCheckOrderSuccess({}));
        //     return;
        // }
        // onFailed();
        // yield put(fetchCheckOrderFailed("Order not found"));
    }
    catch (error) {
        console.log(error);
        yield put(fetchCheckOrderFailed("Failed to fetch order"));
    }
}

function* fetchGetAllOrderAdmin(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(orderService.getAllOrderAdmin, payload);
        if (product.status_code === 200) {
            yield put(fetchGetAllOrderAdminSuccess(product.data));
            return;
        }
        yield put(fetchGetAllOrderAdminFailed());
    } catch (error) {
        yield put(fetchGetAllOrderAdminFailed());
    }
}
// 
export function* orderSaga() {
    yield takeLatest(fetchGetAllOrderStart.type, fetchGetAllOrder);
    yield takeLatest(fetchCheckOrderStart.type, fetchCheckOrder);
    yield takeLatest(fetchGetAllOrderAdminStart.type, fetchGetAllOrderAdmin);
}
