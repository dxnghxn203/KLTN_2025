import axiosClient from "@/configs/axiosClient";

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
                imagesPrimary: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4rOSGJQe6S1GAzUpack7oTQPQJB7zIy3C2mZ_fxGN6zJtsQxagPFEKVbEItsCnAewQlk&usqp=CAU',
                images: [
                    {
                        id: 1,
                        url: "https://bcp.cdnchinhphu.vn/334894974524682240/2023/12/18/thuoc2-17028933895421798906044.jpg",
                    },
                    {
                        id: 2,
                        url: "https://data-service.pharmacity.io/pmc-upload-media/production/pmc-ecm-asm/posts/luu-y-su-dung-thuoc-khang-sinh-1.webp",
                    },
                    {
                        id: 3,
                        url: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/8/14/thuoc-vien-1-16919846518291434355354.jpeg",
                    },
                    {
                        id: 4,
                        url: "https://cdn.thegioididong.com/Products/Images/10039/131560/phosphalugel-0-1.jpg",
                    },
                    {
                        id: 5,
                        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt6bZsHxupuKhfopLLVuEAaIhDwm9-b61q6KeywOTDfn6oQVzpe_uQzrHEgZzIEvM9n-w&usqp=CAU",
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