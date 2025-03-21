import { fetchCheckOrderStart, fetchGetAllOrderStart, selectAllOrder } from "@/store/order";
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

    const checkOrder = async (data: any, onSuccess: (data: any)=> void,onFailed: ()=>void ) => {
        dispatch(fetchCheckOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }
    
    return {
        allOrder,
        checkOrder
    };
}

