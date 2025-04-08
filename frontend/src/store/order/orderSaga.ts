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

    fetchGetOrderByUserStart,
    fetchGetOrderByUserSuccess,
    fetchGetOrderByUserFailed,
} from './orderSlice';
import { getSession, getToken } from '@/utils/cookie';

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
            orderData
        } = payload;

        const session = getSession();
        const addressInfo = orderData.addressInfo;
        const ordererInfo = orderData.ordererInfo;
        const products = () => {
            return orderData.product.map((item: any) => ({
                product_id: item.product_id,
                price_id: item.price_id,
                product_name: item.products_name,
                unit: item.unit,
                quantity: item.quantity,
                price: item.price.price
            }))
        }   
        
        const apiPayload = {
            product: products(),
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
                "name": ordererInfo.fullName || "",
                "phone_number": ordererInfo.phone || "",
                "email": ordererInfo.email || "",
                "address": {
                    "address": addressInfo.address || "",
                    "ward": addressInfo.ward || "",
                    "district": addressInfo.district || "",
                    "province": addressInfo.city || ""
                }
            },
            "sender_province_code": 79,
            "sender_district_code": 765,
            "sender_commune_code": 26914,
            "receiver_province_code": addressInfo.cityCode || 0,
            "receiver_district_code": addressInfo.districtCode || 0,
            "receiver_commune_code": addressInfo.wardCode || 0,
            "delivery_instruction": orderData?.note || "",
            "payment_type": orderData.paymentMethod,
        };

        const rs = yield call(orderService.checkOrder, apiPayload, session);
        if (rs.status_code === 200) {
            yield put(fetchCheckOrderSuccess(rs.data));
            if (rs?.data?.qr_code && rs?.data?.qr_code !== "") {
                onSuccess({
                    "isQR": true,
                    "message": rs.message,
                    "qr_code": rs.data.qr_code,
                    "order_id": rs.data.order_id,
                });
                return;
            }
            onSuccess({
                "isQR": false,
                "message": rs.message,
                "order_id": rs.data.order_id,
            });
            return;
        }
        onFailed(rs.message);
        yield put(fetchCheckOrderSuccess(""));
        onFailed("test");
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
// Get order by user
function* fetchGetOrderByUser(action: any): Generator<any, void, any> {
    try {
        const product = yield call(orderService.getOrderByUserId);
        if (product.status_code === 200) {
            yield put(fetchGetOrderByUserSuccess(product.data));
            return;
        }
        yield put(fetchGetOrderByUserFailed());
    } catch (error) {
        yield put(fetchGetOrderByUserFailed());
    }
}

export function* orderSaga() {
    yield takeLatest(fetchGetAllOrderStart.type, fetchGetAllOrder);
    yield takeLatest(fetchCheckOrderStart.type, fetchCheckOrder);
    yield takeLatest(fetchGetAllOrderAdminStart.type, fetchGetAllOrderAdmin);
    yield takeLatest(fetchGetOrderByUserStart.type, fetchGetOrderByUser);
}
