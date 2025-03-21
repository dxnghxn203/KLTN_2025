import { RootState } from "../rootReducer";

export const selectLocation = (state: RootState) => state.location;
export const selectCities = (state: RootState) => state.location.cities;
export const selectDistricts = (state: RootState) => state.location.districts;
export const selectWards = (state: RootState) => state.location.wards;
export const selectLoading = (state: RootState) => state.location.loading;
export const selectError = (state: RootState) => state.location.error;