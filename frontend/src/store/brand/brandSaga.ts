import {call, put, takeLatest} from 'redux-saga/effects';
import {
    fetchGetAllBrandAdminStart,
    fetchGetAllBrandAdminSuccess,
    fetchGetAllBrandAdminFailure,
    
} from '@/store';
import * as brandService from '@/services/brandService';

import {getToken, setSession} from '@/utils/cookie';

function* fetchGetAllBrandAdmin(action: any): Generator<any, void, any> {
   const {payload} = action;
       const {
           
           onSuccess = () => {
           },
           onFailure = () => {
           },
       } = payload;
   
       try {
           const response = yield call(brandService.getAllBrandsAdmin);
           if (response.status_code === 200) {
               onSuccess(response.data)
               yield put(fetchGetAllBrandAdminSuccess(response.data));
               return;
           }
           onFailure()
           yield put(fetchGetAllBrandAdminFailure("Failed to get all vouchers"));
   
       } catch (error) {
           onFailure()
           yield put(fetchGetAllBrandAdminFailure("Failed to get all vouchers"));
       }
}




export function* brandSaga() {
    yield takeLatest(fetchGetAllBrandAdminStart, fetchGetAllBrandAdmin);
   
}