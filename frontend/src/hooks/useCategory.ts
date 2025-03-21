import { fetchGetAllCategoryStart, selectAllCategory } from "@/store/category";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useCategory() {
    const dispatch = useDispatch();
    const allCategory = useSelector(selectAllCategory);

    useEffect(() => {
        dispatch(fetchGetAllCategoryStart(
            
        ));
    }, [dispatch]);

    return {
        allCategory
    };
}

