import axiosClient from "@/config/axiosClient";

const BASE_URL = "http://127.0.0.1:8080";

export const productAPIs = {
    async getProductByUser(params: any) {
        // return await axiosClient.post(`${BASE_URL}/v1/getProduct`, params);
        return {
            status: 'success',
            data: [
                {
                    _id: ' 121212',
                    name: "product1",
                    uint: 'hộp',
                    stock: 100
                },
                {
                    _id: '55555',
                    name: "product2",
                    uint: 'típ',
                    stock: 99
                }
            ]
        }
    },

};
