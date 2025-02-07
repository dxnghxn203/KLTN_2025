import { ReduxState } from "../store";


export const listProductSelector = (state: ReduxState) =>
    state.product.listProduct;

export const loadingSelector = (state: ReduxState) =>
    state.product.loading;