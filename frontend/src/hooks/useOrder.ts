
import { fetchGetAllOrderStart, selectAllOrder } from "@/store/order";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useOrder() {
    const dispatch = useDispatch();
    const allOrder = useSelector(selectAllOrder);

    useEffect(() => {
        dispatch(fetchGetAllOrderStart({
            page: 1,
            limit: 10,
        }));
    }, [dispatch]);

    return {
        allOrder
    };
}

