import {Middleware} from 'redux';
import {getToken, getTokenAdmin, getTokenPharmacist} from "@/utils/cookie";
import {setClientToken} from "@/utils/configs/axiosClient";
import {ROLE_ACTIONS_ADMIN, ROLE_ACTIONS_PHARMACIST} from "@/utils/roleAction";

export const tokenMiddleware: Middleware = store => next => action => {
    const actionType = typeof action === 'object' && action !== null && 'type' in action ? (action.type as string).split('/')[1] || '' : '';
    let token = null;

    if (ROLE_ACTIONS_ADMIN.includes(actionType)) {
        token = getTokenAdmin();
    } else if (ROLE_ACTIONS_PHARMACIST.includes(actionType)) {
        token = getTokenPharmacist();
    } else {
        token = getToken();
    }

    if (token) {
        setClientToken(token);
    }

    return next(action);
};