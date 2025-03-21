import axiosClient from "@/utils/configs/axiosClient";

export const getAllCities = async () => {
    const response = await axiosClient.get(`/v1/location/cities`);
    return response.data;
}

export const getDistrictsByCityId = async (cityId: string) => {
    const response = await axiosClient.get(`/v1/location/districts/${cityId}`);
    return response.data;
}

export const getWardsByDistrictId = async (districtId: string) => {
    const response = await axiosClient.get(`/v1/location/wards/${districtId}`);
    return response.data;
}