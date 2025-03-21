import axiosClient from "@/utils/configs/axiosClient";

export const getAllCategory = async () : Promise<any>=> {
    try {
        const response = await axiosClient.get("/v1/category");
        console.log(response.data);
        return response;
    } catch (error) {
        throw error;
    }
}