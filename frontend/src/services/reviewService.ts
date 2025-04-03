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
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

