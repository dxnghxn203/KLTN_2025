import { fetchProductBySlugStart, selectProductBySlug } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export function useProduct() {
    const dispatch = useDispatch();
    const productBySlug = useSelector(selectProductBySlug);

    const getProductBySlug= async (slug: string) => {
        dispatch(fetchProductBySlugStart(slug));
    }

    return {
        productBySlug,
        getProductBySlug
    };
}

