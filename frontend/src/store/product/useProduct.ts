import { useDispatch, useSelector } from "react-redux";
import { fetchProductBySlugStart } from "./productSlice";
import { selectProductBySlug } from "./productSelector";

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

