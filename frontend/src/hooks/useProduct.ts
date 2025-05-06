import { fetchAddMediaProductStart, fetchAddProductStart, fetchAllProductAdminStart, fetchAllProductBestDealStart, fetchAllProductGetProductFeaturedStart, fetchAllProductGetRecentlyViewedStart, fetchAllProductRelatedStart, fetchAllProductTopSellingStart, fetchApproveProductByPharmacistStart, fetchDeleteProductStart, fetchProductApprovedStart, fetchProductBySlugStart, fetchUpdateCertificateFileProductStart, fetchUpdateImagesPrimaryProductStart, fetchUpdateImagesProductStart, fetchUpdateProductStart, selectProductAdmin, selectProductApproved, selectProductBySlug, selectProductGetRecentlyViewed, selectProductRelated, selectProductTopSelling } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);
    const allProductAdmin = useSelector(selectProductAdmin);
    const productsTopSelling = useSelector(selectProductTopSelling);
    const productRelated = useSelector(selectProductRelated);
    const productGetRecentlyViewed = useSelector(selectProductGetRecentlyViewed);
    const productGetFeatured = useSelector(selectProductRelated);
    const productBestDeal = useSelector(selectProductTopSelling);
    const productApproved = useSelector(selectProductApproved);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [top_n, setTopN] = useState(10);

    const fetchProductBySlug = async (slug: string, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
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
            page_size: pageSize,
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

    const fetchProductBestDeal = () => {
        dispatch(fetchAllProductBestDealStart({
            top_n: top_n
        }))
    }

    const deleteProduct = async (product_id: any, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchDeleteProductStart({
            product_id: product_id,
            onSuccess: onSuccess,
            onFailed: onFailed
        }))
    }

    const fetchProductApproved = () => {
        dispatch(fetchProductApprovedStart({
            
        }))
    }

    const fetchApproveProductByPharmacist = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchApproveProductByPharmacistStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
      };
    
    const fetchUpdateProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchUpdateProductStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
      }

    const fetchAddMediaProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchAddMediaProductStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
      }
    
      const fetchUpdateCertificateFileProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchUpdateCertificateFileProductStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
      }

      const fetchUpdateImagesPrimaryProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchUpdateImagesPrimaryProductStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
      }

      const fetchUpdateImagesProduct = async (
        params: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
      ) => {
        dispatch(
          fetchUpdateImagesProductStart({
            ...params,
            onSuccess,
            onFailure: onFailed
          })
        );
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
        productBestDeal,
        fetchProductBestDeal,
        deleteProduct,
        fetchProductApproved,
        productApproved,
        fetchApproveProductByPharmacist,

        fetchUpdateProduct,
        fetchAddMediaProduct,

        fetchUpdateCertificateFileProduct,
        fetchUpdateImagesPrimaryProduct,
        fetchUpdateImagesProduct,
    };
}

