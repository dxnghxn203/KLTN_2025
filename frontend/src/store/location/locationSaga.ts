import { call, put, takeLatest } from 'redux-saga/effects';
import * as locationService from '@/services/locationService';
import {
    fetchGetAllCitiesStart,
    fetchGetAllCitiesSuccess,
    fetchGetAllCitiesFailed,
    fetchGetDistrictsByCityIdStart,
    fetchGetDistrictsByCityIdSuccess,
    fetchGetDistrictsByCityIdFailed,
    fetchGetWardsByDistrictIdStart,
    fetchGetWardsByDistrictIdSuccess,
    fetchGetWardsByDistrictIdFailed,
} from './locationSlice';

function* fetchGetAllCities(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getAllCities);
        yield put(fetchGetAllCitiesSuccess(response));

    } catch (error) {
        yield put(fetchGetAllCitiesFailed("Failed to fetch cities"));
    }
}
function* fetchGetDistrictsByCityId(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getDistrictsByCityId, action.payload);
        yield put(fetchGetDistrictsByCityIdSuccess(response));
    } catch (error) {
        yield put(fetchGetDistrictsByCityIdFailed("Failed to fetch districts"));
    }
}
function* fetchGetWardsByDistrictId(action: any): Generator<any, void, any> {
    try {
        const response = yield call(locationService.getWardsByDistrictId, action.payload);
        yield put(fetchGetWardsByDistrictIdSuccess(response));
    } catch (error) {   
        yield put(fetchGetWardsByDistrictIdFailed("Failed to fetch wards"));
    }
}

export function* locationSaga() {
    yield takeLatest(fetchGetAllCitiesStart.type, fetchGetAllCities);
    yield takeLatest(fetchGetDistrictsByCityIdStart.type, fetchGetDistrictsByCityId);
    yield takeLatest(fetchGetWardsByDistrictIdStart.type, fetchGetWardsByDistrictId);
}
