import { combineReducers } from 'redux';
import { productSlice } from './product';
import { authSlice } from './auth';

const reducer = combineReducers({
    product: productSlice.reducer,
    auth: authSlice.reducer,
});


const rootReducer = (state: any, action: any) => {
    if (action.type === "authen/fetchLogoutStart") {
        return reducer(undefined, action);
    }
    const token = action?.payload?.authen?.token || null;
    // if (action.type === "authen/fetchListAuthenSuccess") {
    //     onTokenRefresh()
    // }

    // if (token) {
    //     setClientToken(token);
    //     onTokenRefresh()
    // }

    return reducer(state, action);
};

export default rootReducer;
