import {call, put, takeLatest} from 'redux-saga/effects';
import * as chatService from '@/services/chatService';
import {fetchChatBoxFailed, fetchChatBoxInitStart, fetchChatBoxSuccess,} from '@/store';

import {getToken, setSession} from '@/utils/cookie';

function* handleInitChatBox(action: any): Generator<any, void, any> {
    try {
        const {payload} = action;
        const {
            data,
            onSuccess = () => {
            },
            onFailure = () => {
            },
        } = payload;
        const token = getToken()
        const response = token ?
            yield call(chatService.startChatBoxGuest, data)
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