import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';
import locationReducer from './location/locationSlice';
import categoryReducer from './category/categorySlice';
import userReducer from "./user/userSlice";
import reviewReducer from "./review/reviewSlice";
import chatReducer from "./chat/chatSlice";
import voucherReducer from "./voucher/voucherSlice";
import {getToken, getTokenAdmin, getTokenPharmacist} from '@/utils/cookie';
import {setClientToken} from '@/utils/configs/axiosClient';
import {ROLE_ACTIONS_ADMIN, ROLE_ACTIONS_PHARMACIST} from "@/utils/roleAction";

// Import other reducers here

const reducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    location: locationReducer,
    category: categoryReducer,
    user: userReducer,
    review: reviewReducer,
    chat: chatReducer,
    voucher: voucherReducer,
});

const rootReducer = (state: any, action: any) => {
    // if (action.type === "authen/fetchLogoutStart") {
    //     return reducer(undefined, action);
    // }
    //
    // let token = null;
    //
    // const typeParts = typeof action.type === 'string' ? action.type.split('/') : [];
    // const actionType = typeParts[1] || '';
    // console.log("actionType", actionType);
    // if ((ROLE_ACTIONS_ADMIN).includes(actionType)) {
    //     token = getTokenAdmin()
    //     console.log("1", token);
    // } else if ((ROLE_ACTIONS_PHARMACIST).includes(actionType)) {
    //     token = getTokenPharmacist()
    //     console.log("2", token);
    // } else {
    //     token = getToken();
    //     console.log("3", token);
    // }
    //
    // if (token) {
    //     setClientToken(token);
    // }

    return reducer(state, action);
};

export default rootReducer;
