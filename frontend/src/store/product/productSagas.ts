import { call, put, takeLatest } from "redux-saga/effects";
import {
    fetchListProductFailure,
    fetchListProductStart,
    fetchListProductSuccess,
} from "./productSlice";

function* getListProduct(action: any): Generator<any, void, any> {
    try {
        // const { payload } = action;
        // const response = yield call(productAPIs.getProductByUser, payload);
        // if (response.status === "success") {
        //     const { data } = response;
        //     const dataTable = data.map((m: any) => {
        //         return {
        //             ...m,
        //             key: m._id
        //         }
        //     }
        //     )
        //     yield put(fetchListProductSuccess(dataTable));
        // } else {
        //     yield put(fetchListProductFailure())
        // }
    } catch (error) {
        yield put(fetchListProductFailure());
    }
}


export function* productSagas() {
    yield takeLatest(fetchListProductStart.type, getListProduct);
}
