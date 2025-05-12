import axiosClient from "@/utils/configs/axiosClient";

export const startChatBoxUser = async (params: any) => {
    try {
        return await axiosClient.post(`/v1/conversations/user?user_id=${params.user_id}`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi bắt đầu chatbox USER',
        };
    }
}

export const startChatBoxGuest = async (params: any) => {
    try {
        return await axiosClient.post(`/v1/conversations/guest`, params);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi bắt đầu chatbox USER',
        };
    }
}



