import {call, put, takeLatest} from 'redux-saga/effects';
import * as chatboxService from '@/services/chatboxService';
import {
    fetchGetAllConversationWaitingFailed,
    fetchGetAllConversationWaitingStart,
    fetchGetAllConversationWaitingSuccess,

} from './chatboxSlice';
import {getSession, getToken} from '@/utils/cookie';

function* getAllConversationWaiting(action: any): Generator<any, void, any> {
   const { payload } = action;
        const {
            limit,
            onSuccess = () => {},
            onFailure = () => {},
        } = payload;
    try {
        const response = yield call(chatboxService.getAllConversationWaiting, limit);
        if (response.status_code === 200) {
                    yield put(fetchGetAllConversationWaitingSuccess(response.data));
                    return;
                }
                yield put(fetchGetAllConversationWaitingFailed("Category not found"));
        
    } catch (error) {
            yield put(fetchGetAllConversationWaitingFailed("Failed to fetch order"));
        }
}






export function* chatboxSaga() {
    yield takeLatest(fetchGetAllConversationWaitingStart.type, getAllConversationWaiting);
   
}
