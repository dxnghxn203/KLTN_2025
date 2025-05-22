import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { all } from "axios";
import { fetchGetAllAdminFailure } from "../user";
import { getAllBrands } from "@/services/productService";

const initialState: any = {
    getAllBrandsAdmin: [],
   
    loading: false,
    error: null,
};

export const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        // getallbrand admin
        fetchGetAllBrandAdminStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        fetchGetAllBrandAdminSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.getAllBrandsAdmin = action.payload;
        },
        fetchGetAllBrandAdminFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        
    },
});

export const {
    fetchGetAllBrandAdminStart,
    fetchGetAllBrandAdminSuccess,
    fetchGetAllBrandAdminFailure,
   
    
} = brandSlice.actions;

export default brandSlice.reducer;


