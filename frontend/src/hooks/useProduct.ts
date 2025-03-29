import { fetchAddProductStart, fetchAllProductAdminStart, fetchProductBySlugStart, selectProductAdmin, selectProductBySlug } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);
    const allProductAdmin = useSelector(selectProductAdmin);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchProductBySlug = async (slug: string) => {
        dispatch(fetchProductBySlugStart(slug));
    }
    const getAllProductsAdmin = () => {
        dispatch(fetchAllProductAdminStart({
            page: page,
            pageSize: pageSize,
        }))
    };

    const addProduct = async (
        product: any,
        onsucces: () => void,
        onfailed: () => void
    ) => {
        dispatch(fetchAddProductStart({
            ...product,
            onsucces: onsucces,
            onfailed: onfailed
        }));
    }

    return {
        addProduct,
        productBySlug,
        fetchProductBySlug,
        getAllProductsAdmin,
        page,
        setPage,
        pageSize,
        setPageSize,
        allProductAdmin
    };
}

