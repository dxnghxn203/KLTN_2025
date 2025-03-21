import { fetchGetAllCitiesStart, fetchGetDistrictsByCityIdStart, fetchGetWardsByDistrictIdStart, selectCities, selectDistricts, selectWards } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export function useLocation() {
    const dispatch = useDispatch();
    const cities = useSelector(selectCities);
    const districts = useSelector(selectDistricts);
    const wards = useSelector(selectWards);

    const getCities = async () => {
        dispatch(fetchGetAllCitiesStart());
    }
    const getDistrictsByCityId = async (cityId: string) => {
        dispatch(fetchGetDistrictsByCityIdStart(cityId));
    }
    const getWardsByDistrictId = async (districtId: string) => {
        dispatch(fetchGetWardsByDistrictIdStart(districtId));
    }

    return {
        cities,
        districts,
        wards,
        getDistrictsByCityId,
        getCities,
        getWardsByDistrictId
    }
}

