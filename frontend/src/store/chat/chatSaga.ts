import {call, put, takeLatest} from 'redux-saga/effects';
import * as chatService from '@/services/chatService';
import {
    fetchChatBoxInitStart,
    fetchChatBoxSuccess,
    fetchChatBoxFailed,
} from '@/store';

import {getSession, getToken, setSession} from '@/utils/cookie';

function* handleInitChatBox(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;
        const token = getToken()
        const params = {
            "guest_name": "string",
            "guest_email": "user@example.com",
            "guest_phone": "string"
        };
        const response = token ?
            yield call(chatService.startChatBoxGuest, params)
            : yield call(chatService.startChatBoxUser, {token});
        if (response?.status_code === 200) {
            onSuccess(response?.data);
            setSession(response?.data);
            yield put(fetchChatBoxSuccess(response?.data));
            return;
        }
        onFailure(response.message);
        yield put(fetchChatBoxFailed(response.message));
    } catch (error) {
        yield put(fetchChatBoxFailed('Lỗi lấy giỏ hàng'));
    }
}

export function* chatSaga() {
    yield takeLatest(fetchChatBoxInitStart.type, handleInitChatBox);
}