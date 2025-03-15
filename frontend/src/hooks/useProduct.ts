import { fetchAddProductStart, fetchProductBySlugStart, selectProductBySlug } from "@/store";
import { on } from "events";
import { useDispatch, useSelector } from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);

    const getProductBySlug = async (slug: string) => {
        dispatch(fetchProductBySlugStart(slug));
    }

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
        getProductBySlug
    };
}

