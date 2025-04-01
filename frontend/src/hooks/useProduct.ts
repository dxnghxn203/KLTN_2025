import { fetchAddProductStart, fetchAllProductAdminStart, fetchAllProductGetProductFeaturedStart, fetchAllProductGetRecentlyViewedStart, fetchAllProductRelatedStart, fetchAllProductTopSellingStart, fetchProductBySlugStart, selectProductAdmin, selectProductBySlug, selectProductGetRecentlyViewed, selectProductRelated, selectProductTopSelling } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "redux-saga/effects";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);
    const allProductAdmin = useSelector(selectProductAdmin);
    const productsTopSelling = useSelector(selectProductTopSelling);
    const productRelated = useSelector(selectProductRelated);
    const productGetRecentlyViewed = useSelector(selectProductGetRecentlyViewed);
    const productGetFeatured = useSelector(selectProductRelated);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [top_n, setTopN] = useState(5);

    const fetchProductBySlug = async (slug: string, onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchProductBySlugStart({
            slug: slug,
            onSucces: onSuccess,
            onFailed: onFailed
        }));
    }
    
    const fetchProductFeatured = (
        mainCategory: string | null,
        subCategory: string | null,
        childCategory: string | null,
        top_n: number,
        onSuccess: () => void,
        onFailed: () => void,
    ) => {
        dispatch(fetchAllProductGetProductFeaturedStart(
            {
                mainCategory: mainCategory,
                subCategory: subCategory,
                childCategory: childCategory,
                top_n: top_n,
                onSuccess: onSuccess,
                onFailed: onFailed
            }
        ))
    }

    const getAllProductsAdmin = () => {
        dispatch(fetchAllProductAdminStart({
            page: page,
            pageSize: pageSize,
        }))
    };

    const getProductTopSelling = () => {
        dispatch(fetchAllProductTopSellingStart({
            top_n
        }))
    }

    const addProduct = async (
        product: any,
        onsucces: (message: any) => void,
        onfailed: (message: any) => void
    ) => {
        dispatch(fetchAddProductStart({
            form: product,
            onsucces: onsucces,
            onfailed: onfailed
        }));
    }

    const fetchProductRelated = async (product_id: any) => {
        dispatch(fetchAllProductRelatedStart({
            product_id: product_id,
            top_n: top_n
        }));
    }
    const fetchProductRecentlViewed = () => {
        dispatch(fetchAllProductGetRecentlyViewedStart())
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
        allProductAdmin,
        getProductTopSelling,
        productsTopSelling,
        fetchProductRelated,
        productRelated,
        productGetRecentlyViewed,
        fetchProductRecentlViewed,
        productGetFeatured,
        fetchProductFeatured,
    };
}

