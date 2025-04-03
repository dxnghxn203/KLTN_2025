import axiosClient from "@/utils/configs/axiosClient";
import medicine from "@/images/medicinee.png";

export const getAllOrder = async (slug: string) => {
    try {
        return {
            status: 200,
            message: "success",
            data: [
                { 
                    id: "OD0001",
                    tracking_id: "TRACK0001",
                    order_id: "DH0001",
                    customer: {
                        id: "CUS0001",
                        name: "Nguyễn Văn A",
                        phone: "0987654321",
                        email: "",
                        address: {
                            city: "Hồ Chí Minh",
                            district: "Quận 1",
                            ward: "Phường Bến Thành",
                            street: "123 Nguyễn Trãi"
                        }
                    },
                    products: [
                        {
                            id: "SP0001",
                            name: "Allerphast 180 mg Allerphast 180 mg Allerphast 180 mg",
                            price: 100000,
                            quantity: 1,
                            unit: "Hộp",
                            img: medicine,
                        },
                        {
                            id: "SP0002",               
                            name: "Allerphast 180 mg",
                            price: 100000,
                            quantity: 1,
                            unit: "Hộp",
                            img: medicine,
                        }
                    ],
                    total: 200000,
                    status: "create_order",
                    createdAt: "2021-09-01",
                    updated_date: "2021-09-01"
                },
                {
                    id: "OD0002",
                    tracking_id: "TRACK0002",
                    order_id: "DH0002",
                    customer: {
                        id: "CUS0002",
                        name: "Nguyễn Văn B",
                        phone: "0987654321",
                        email: "",
                        address: {
                            city: "Hồ Chí Minh",
                            district: "Quận 1",
                            ward: "Phường Bến Thành",
                            street: "123 Nguyễn Trãi"
                        }
                    },
                    products: [
                        
                        {
                            id: "SP0002",
                            name: "Allerphast 180 mg",
                            price: 100000,
                            quantity: 1,
                            unit: "Hộp"
                        }
                    ],
                    total: 100000,
                    status: "create_order",
                    createdAt: "2021-09-01",
                    updated_date: "2021-09-01"
                },
                {
                    id: "OD0003",
                    tracking_id: "TRACK0003",
                    order_id: "DH0003",
                    customer: {
                        id: "CUS0003",
                        name: "Nguyễn Văn C",
                        phone: "0987654321",
                        email: "",
                        address: {
                            city: "Hồ Chí Minh",
                            district: "Quận 1",
                            ward: "Phường Bến Thành",
                            street: "123 Nguyễn Trãi"
                        }
                    },
                    products: [
                        {
                            id: "SP0001",
                            name: "Allerphast 180 mg",
                            price: 100000,
                            quantity: 1,
                            unit: "Hộp"
                        },
                        {
                            id: "SP0002",
                            name: "Allerphast 180 mg",
                            price: 100000,
                            quantity: 1,
                            unit: "Hộp"
                        }
                    ],
                    total: 200000,
                    status: "create_order",
                    createdAt: "2021-09-01",
                    updated_date: "2021-09-01"
                }
            ]
        }
    } catch (error) {
        throw error;
    }
}


export const checkOrder = async ( data: any, session: any): Promise<any> => {
    try {
        const url = session ? `/v1/order/check?session=${session}` : '/v1/order/check';
        const response: any = await axiosClient.post(url, data);
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lổi đặt hàng',
        };
    }
}
export const createOrder = async ( data: any): Promise<any> => {
    try {
        const response = await axiosClient.post('/v1/order/add', data);
        return {
            status: response?.status,
            message: 'Đặt hàng thành công',
            data: response.data
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lổi đặt hàng',
        };
    }
}

export const getAllOrderAdmin = async (params: any) => {
    try{
        const response: any= await axiosClient.get('/v1/order/all-orders-admin', { params });
        return {
            status_code: response?.status_code,
            message: response?.message,
            data: response.data
        };
    } catch (error) {
        return {
            status_code: false,
            message: 'Lổi lấy danh sách đơn hàng',
        }
    }

}