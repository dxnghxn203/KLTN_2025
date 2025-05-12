import axiosClient from "@/utils/configs/axiosClient";



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

