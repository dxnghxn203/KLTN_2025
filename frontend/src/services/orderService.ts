import axiosClient from "@/utils/configs/axiosClient";

export const getAllOrder = async (slug: string) => {
    try {
        // const response = await axiosClient.get(`/orders`);

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
                    createdAt: "2021-09-01T00:00:00.000Z",
                    updated_date: "2021-09-01T00:00:00.000Z"
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
                    createdAt: "2021-09-01T00:00:00.000Z",
                    updated_date: "2021-09-01T00:00:00.000Z"
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
                    createdAt: "2021-09-01T00:00:00.000Z",
                    updated_date: "2021-09-01T00:00:00.000Z"
                }
            ]
        }
    } catch (error) {
        throw error;
    }
}