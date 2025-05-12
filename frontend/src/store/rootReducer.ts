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
    // Add other reducers here
});

const rootReducer = (state: any, action: any) => {
    if (action.type === "authen/fetchLogoutStart") {
        return reducer(undefined, action);
    }

    let token = null;

    const actionType = action.type.split('/')[1];

    if ((ROLE_ACTIONS_ADMIN as string[]).includes(actionType as string)) {
        token = getTokenAdmin()
    } else if ((ROLE_ACTIONS_PHARMACIST as string[]).includes(actionType as string)) {
        token = getTokenPharmacist()
    } else {
        token = getToken();
    }

    if (token) {
        setClientToken(token);
    }

    return reducer(state, action);
};

export default rootReducer;
