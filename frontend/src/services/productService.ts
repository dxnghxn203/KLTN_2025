import axiosClient from "@/utils/configs/axiosClient";

export const getProductBySlug = async (slug: string) => {
    try {
        const response = await axiosClient.get(`/v1/product/${slug}`);
        return response;
    } catch (error) {
        // console.error("Error fetching child category:", error);
        throw error;
    }
    
}

export const addProduct = async (data : any) => {
    try {
        console.log("==> API", data);
        // const response = await axiosClient.post(`/products`, data);
        // return response.data;
        // return {
        //     status: 200,
        //     message: "success",
        //     data: null
        // }
        return {
            status: 500,
            message: "Internal server error",
            data: null
        }
    }
    catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}