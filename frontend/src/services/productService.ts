import axiosClient from "@/utils/configs/axiosClient";

export const getProductBySlug = async (slug: string) => {
    try {
        // const response = await axiosClient.get(`/products/${slug}`);
        // return response.data;
        if (slug !== "allerphast-180-mg") {
            return {
                status: 404,
                message: "Not found",
                data: null
            }
        }

        return {
            status: 200,
            message: "success",
            data: {
                id: "SP0001",
                name: "Allerphast 180 mg",
                namePrimary: "Thuốc Allerphast 180mg Mebiphar điều trị viêm mũi dị ứng theo mùa, mày đay mạn tính vô căn (1 vỉ x 10 viên)",
                prices: [
                    {
                        id: "1111",
                        price: 100000,
                        originalPrice: 110000,
                        unitPrice: "VNĐ",
                        discount: 10,
                        unit: "Hộp"
                    },
                    {
                        id: "2222",
                        price: 10000,
                        originalPrice: 11000,
                        unitPrice: "VNĐ",
                        discount: 10,
                        unit: "Viên"
                    }
                ],
                slug: "allerphast-180-mg",
                description: "Allerphast 180 mg là một sản phẩm của công ty cổ phần dược phẩm và sinh học y tế Mebiphar, thành phần chính chứa fexofenadin hydroclorid, là thuốc dùng để điều trị triệu chứng trong viêm mũi dị ứng theo mùa, mày đay mạn tính vô căn ở người lớn và trẻ em trên 6 tuổi.Allerphast 180 mg được bào chế dưới dạng viên nén bao phim, hộp 1 vỉ, mỗi vỉ 10 viên.",
                imagesPrimary: 'https://cdn.nhathuoclongchau.com.vn/unsafe/375x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_8995_62c3_large_9d0ee4c833.jpg',
                images: [
                    {
                        id: 1,
                        url: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_1656985945_ff663bc14d.jpg",
                    },
                    {
                        id: 2,
                        url: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_3056_62c3_large_a418eeb691.jpg",
                    },
                    {
                        id: 3,
                        url: "https://cdn.nhathuoclongchau.com.vn/unsafe/636x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_8331_62c3_large_decc2051b9.jpg",
                    },
                    {
                        id: 4,
                        url: "https://cdn.nhathuoclongchau.com.vn/unsafe/636x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_1768_62c3_large_c73cd07223.png",
                    },
                    {
                        id: 5,
                        url: "https://cdn.nhathuoclongchau.com.vn/unsafe/636x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00009581_soki_tium_giup_tre_ngu_ngon_4678_62c3_large_76a0490e8d.jpg",
                    }
                ],
                category: {
                    id: 1,
                    name: "Thuốc dị ứng",
                    slug: "thuoc-di-ung",
                },
            }
        }
    } catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const addProduct = async (data : any) => {
    try {
        console.log("==> API", data);
        // const response = await axiosClient.post(`/products`, data);
        // return response.data;
        // return {
        //     status: 200,
        //     message: "success",
        //     data: null
        // }
        return {
            status: 500,
            message: "Internal server error",
            data: null
        }
    }
    catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}