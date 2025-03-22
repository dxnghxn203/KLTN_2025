import axiosClient from "@/utils/configs/axiosClient";

export const getAllCategory = async () : Promise<any>=> {
    try {
        const response = await axiosClient.get("/v1/category");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}
export const getMainCategory = async (mainslug:any) : Promise<any>=> {
    try {
        const response = await axiosClient.get(`/v1/category/${mainslug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getSubCategory = async (mainslug:any, subslug:any) : Promise<any>=> {
    try {
        const response = await axiosClient.get(`/v1/category/${mainslug}/sub-category/${subslug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}