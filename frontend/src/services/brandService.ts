import axiosClient from "@/utils/configs/axiosClient";

export const getAllBrandsAdmin = async () => {
    try {
        return await axiosClient.get(`v1/brands/get-brands-admin`);
    } catch (error: any) {
        return {
            status: false,
            message: 'Lỗi lấy danh sách voucher',
        };
    }
}
