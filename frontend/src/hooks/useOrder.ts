import { fetchCheckOrderStart, fetchGetAllOrderAdminStart, fetchGetAllOrderStart, selectAllOrder, selectAllOrderAdmin } from "@/store/order";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useOrder() {
    const dispatch = useDispatch();
    const allOrder = useSelector(selectAllOrder);
    const allOrderAdmin = useSelector(selectAllOrderAdmin);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        dispatch(fetchGetAllOrderStart({
            page: page,
            pageSize: pageSize,
        }));
    }, []);

    const checkOrder = async (data: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCheckOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }
    const getAllOrdersAdmin = async () => {
        dispatch(fetchGetAllOrderAdminStart({
            page: page,
            pageSize: pageSize,
        }))
    };

    return {
        allOrder,
        checkOrder,
        getAllOrdersAdmin,
        allOrderAdmin,
        page,
        setPage,
        pageSize,
        setPageSize,
    }
}

