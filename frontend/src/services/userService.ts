import axiosClient from "@/utils/configs/axiosClient";
export const insertUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/user/register_email";
        // console.log("param:", params);
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

export const sendOtp = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/otp";
        const result = await axiosClient.post(url, params);
        return result;

    } catch (error) {
        throw error;
    }
}

export const getAllUserAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/all-user-admin";
        const result: any = await axiosClient.get(url, { params });
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error) {
        return {
            status_code: 500,
            message: "Lỗi không xác định",
            data: null
        }

    }
}

export const forgotPasswordUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/forgot-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const changePasswordUser = async (params: any): Promise<any> => {
    try {
        const url = "/v1/users/change-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

export const changePasswordAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/change-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data,
            data: null
        }

    }
}

export const forgotPasswordAdmin = async (params: any): Promise<any> => {
    try {
        const url = "/v1/admin/forgot-password";
        const result: any = await axiosClient.post(url, params);
        return {
            status_code: result.status_code,
            message: result.message,
            data: result.data
        }

    } catch (error: any) {
        return {
            status_code: 500,
            message: error.response?.data?.message,
            data: null
        }

    }
}

