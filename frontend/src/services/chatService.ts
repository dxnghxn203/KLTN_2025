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

export const getAllConversationWaiting = async (limit: any) : Promise<any>=> {
    try {
        const params = `/v1/conversations/waiting?limit=${limit}`;
        const response = await axiosClient.get(params);
        // console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}



