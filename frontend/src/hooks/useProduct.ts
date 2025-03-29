import { fetchAddProductStart, fetchProductBySlugStart, selectProductBySlug } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);

    const fetchProductBySlug = async (slug: string) => {
        dispatch(fetchProductBySlugStart(slug));
        
    }
    console.log("SlugHook:", productBySlug);

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
        fetchProductBySlug
    };
}

