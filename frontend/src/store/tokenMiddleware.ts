import {Middleware} from 'redux';
import {getToken, getTokenAdmin, getTokenPharmacist} from "@/utils/cookie";
import {setClientToken} from "@/utils/configs/axiosClient";
import {ROLE_ACTIONS_ADMIN, ROLE_ACTIONS_PHARMACIST, SYSTEM_ACTIONS} from "@/utils/roleAction";

export const tokenMiddleware: Middleware = store => next => action => {
    if (typeof action !== 'object' || action === null || !('type' in action)) {
        return next(action);
    }
    const actionType = (action.type as string).split('/')[1] || '';

    if (SYSTEM_ACTIONS.includes(actionType) || actionType.startsWith('@@')) {
        return next(action);
    }

    let token: string | undefined = undefined;

    if (ROLE_ACTIONS_ADMIN.includes(actionType)) {
        token = getTokenAdmin();
        if (!token) {
            console.warn(`Admin token required for action: ${actionType}`);
            return next({
                ...action,
                error: true,
                payload: {message: 'Admin token not found'}
            });
        }
    } else if (ROLE_ACTIONS_PHARMACIST.includes(actionType)) {
        token = getTokenPharmacist();
        if (!token) {
            console.warn(`Pharmacist token required for action: ${actionType}`);
            return next({
                ...action,
                error: true,
                payload: {message: 'Pharmacist token not found'}
            });
        }
    } else {
        token = getToken();
        if (!token) {
            console.warn(`User token required for action: ${actionType}`);
            return next({
                ...action,
                error: true,
                payload: {message: 'User token not found'}
            });
        }
    }

    if (token) {
        setClientToken(token);
    }

    return next(action);
};