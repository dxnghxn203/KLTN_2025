import axiosClient from "@/utils/configs/axiosClient";
import { message } from "antd";
export const insertUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/user/register_email";
        console.log("param:", params);
        const paramsReq = {
            "phone_number": params.phoneNumber,
            "user_name": params.username,
            "email": params.email,
            "password": params.password,
            "gender": params.gender,
            "birthday": params.dateOfBirth
        }

        const result = await axiosClient.post(url, paramsReq);
        return result;

    } catch (error) {
        throw error;
    }
}

export const verifyOtp = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/verify-email";
        const result = await axiosClient.post(url, params);
        return result;

    } catch (error) {
        throw error;
    }
}