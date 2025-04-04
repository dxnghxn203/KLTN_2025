import axiosClient from "@/utils/configs/axiosClient";
import { message } from "antd";

export const getAllReview = async (id: string) => {
    try {
        const response = await axiosClient.get(`/v1/review/product/${id}`);
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllComment = async (id: string) => {
    try {
        const response = await axiosClient.get(`/v1/comment/product/${id}`);
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const insertReview = async (params: any) => {
    try {
        const url = "/v1/review/add";
        console.log("param:", params);
        const paramsReq = {
            "rating": params.rating, 
            "comment": params.comment, 
            "images": params.images || null,
            "product_id": params.product_id,
        }
        const result = await axiosClient.post(url, paramsReq);
        console.log("result:", result);
        return result;
    } catch (error) {
        throw error;
    }
    
}

export const insertComment = async (params: any) => {
    try {
        const url = "/v1/comment/add";
        console.log("param:", params);
        const paramsReq = {
            "comment" : params.comment, 
            "product_id": params.productId,
        }
        const result = await axiosClient.post(url, paramsReq);
        console.log("result:", result);
        return result;
    } catch (error) {
        throw error;
    }
    
}

