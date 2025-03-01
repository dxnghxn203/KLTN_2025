/* Core */
import { ProductSliceState } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProductSliceState = {
    listProduct: [],
    loading: false,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        fetchListProductStart: (state) => {
            state.loading = true;
        },
        fetchListProductSuccess: (state, action) => {
            state.loading = false;
            state.listProduct = action.payload;
        },
        fetchListProductFailure: (state) => {
            state.loading = false;
        }
    },
});

export const {
    fetchListProductStart,
    fetchListProductSuccess,
    fetchListProductFailure,
} = productSlice.actions;

export default productSlice.reducer;


