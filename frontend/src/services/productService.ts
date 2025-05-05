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

export const addProduct = async (data: any) : Promise<any>=> {
    try {
        const response: any = await axiosClient.post(`/v1/product/add`, data);
        console.log("response", response);
        return {
            status_code: response.status_code,
            message: response.message,
            data: response.data,
                }

    }
    catch (error: any) {
        // console.log("error", error?.response?.data?.message);
        return {
            status_code: error?.response?.status || 500,
            message: error?.response?.data?.message || "Internal server error",
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

export const getProductsBestDeal = async (params: any) => {
    try {
        const response: any = await axiosClient.get(`/v1/products/best-deal`, { params });
        return response;
    } catch (error: any) {
        return {
            status_code: 500,
            message: error?.response?.data?.message || "Internal server error",
            data: null
        }
    }
}

export const deleteProduct = async (product_id: any) => {
    try {
        const params = `/v1/product/delete?product_id=${product_id}`;
        const response: any = await axiosClient.delete(params);
        return {
          status_code: response.status_code,
          message: response.message,
          data: response.data,
        };
      } catch (error: any) {
          throw error;
        }
      
}

export const getAllProductApproved = async () => {
    try {
        const response: any = await axiosClient.get("/v1/products/get-approve-product");
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

export const approveProductByPharmacist = async (params: any) => {
    try {
        const response: any = await axiosClient.post("/v1/products/approve", params);
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

export const updateProduct = async (params: any) => {
    try {
        const response: any = await axiosClient.put("/v1/products/update-product", params);
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