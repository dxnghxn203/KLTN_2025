import axiosClient from "@/utils/configs/axiosClient";

export const getProductBySlug = async (slug: string) => {
    try {
        const response = await axiosClient.get(`/v1/product/${slug}`);
        return response;
    } catch (error) {
        console.error("Error fetching child category:", error);
        throw error;
    }

}

export const getProductTopSelling = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/top-selling`, {params:{params}} );
        return response;
    } catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const addProduct = async (data: any) => {
    try {
        const response: any = await axiosClient.post(`/v1/product/add`, data);
        return response;
    }
    catch (error: any) {
        return {
            status: 500,
            message: error.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getAllProductAdmin = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/all-product-admin`, { params });
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data
        }
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductBySlugSession = async (slug: any, session_id: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/product/session/${slug}`, { params: { session_id } });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductsRelated = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/get-relate/`, { params });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }

}

export const getProductReviewSession = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/get-recently-viewed/${params}`, {  });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const getProductReviewToken = async () => {
    try {
        const response: any = await axiosClient.get(`/v1/products/get-recently-viewed`, {  });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}


export const getProductFeatured = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/featured`, { params });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}