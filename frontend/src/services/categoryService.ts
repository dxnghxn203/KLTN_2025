import axiosClient from "@/utils/configs/axiosClient";
import { message } from "antd";

export const getAllCategory = async () : Promise<any>=> {
    try {
        const response = await axiosClient.get("/v1/category");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}
export const getMainCategory = async (main_slug:any) : Promise<any>=> {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getSubCategory = async (main_slug:any, sub_slug:any) : Promise<any>=> {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}/sub-category/${sub_slug}`);
        // console.log("service");
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getChildCategory = async (main_slug:any, sub_slug:any, child_slug:any) : Promise<any>=> {
    try {
        const response = await axiosClient.get(`/v1/category/${main_slug}/sub-category/${sub_slug}/child-category/${child_slug}`);

        return response;
    } catch (error) {
        // console.error("Error fetching child category:", error);
        throw error;
    }
};

export const getAllCategoryForAdmin = async () : Promise<any>=> {
    try {
        const response: any = await axiosClient.get("/v1/categories/get-all-for-admin");
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to fetch categories",
        }
    }
};

export const updateMainCategory = async (mainCategory: any, data: any) : Promise<any>=> {
    try {
        const params = `v1/category/update/${mainCategory}?main_category_name=${data.main_category_name}&main_category_slug=${data.main_category_slug}`;
        const response: any = await axiosClient.put(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to update category",
        }
    }
}

export const updateSubCategory = async (subCategoryId: any, data: any) : Promise<any>=> {
    try {
        const params = `v1/category/sub-category/update/${subCategoryId}?sub_category_name=${data.sub_category_name}&sub_category_slug=${data.sub_category_slug}`;
        const response: any = await axiosClient.put(params);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
        }
    } catch (error) {
        return {
            error: true,
            message: "Failed to update category",
        }
    }
}

