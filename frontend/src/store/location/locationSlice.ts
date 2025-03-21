import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    cities: any[];
    districts: any[];
    wards: any[];
    loading: boolean;
    error: string | null;
}

const initialState: LocationState = {
    cities: [],
    districts: [],
    wards: [],
    loading: false,
    error: null,
};

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        fetchGetAllCitiesStart(state) {
            state.loading = true;
        },
        fetchGetAllCitiesSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.cities = action.payload;
        }
        ,
        fetchGetAllCitiesFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
        ,
        fetchGetDistrictsByCityIdStart(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        fetchGetDistrictsByCityIdSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.districts = action.payload;
        }
        ,
        fetchGetDistrictsByCityIdFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
        ,
        fetchGetWardsByDistrictIdStart(state, action: PayloadAction<string>) {
            state.loading = true;
        }
        ,
        fetchGetWardsByDistrictIdSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.wards = action.payload;
        }
        ,
        fetchGetWardsByDistrictIdFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    fetchGetAllCitiesStart,
    fetchGetAllCitiesSuccess,
    fetchGetAllCitiesFailed,
    fetchGetDistrictsByCityIdStart,
    fetchGetDistrictsByCityIdSuccess,
    fetchGetDistrictsByCityIdFailed,
    fetchGetWardsByDistrictIdStart,
    fetchGetWardsByDistrictIdSuccess,
    fetchGetWardsByDistrictIdFailed,
} = locationSlice.actions;

export default locationSlice.reducer;


