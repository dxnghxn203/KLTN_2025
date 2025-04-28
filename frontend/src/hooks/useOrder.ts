import { fetchCallWebhookStart, fetchCancelOrderStart, fetchCheckOrderStart, fetchCheckShippingFeeStart, fetchGetAllOrderAdminStart, fetchGetAllOrderStart, fetchGetOrderByUserStart, selectAllOrder, selectAllOrderAdmin, selectOrdersByUser, fetchGetTrackingCodeStart, fetchDownloadInvoiceStart } from "@/store/order";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useOrder() {
    const dispatch = useDispatch();
    const allOrder = useSelector(selectAllOrder);
    const allOrderAdmin = useSelector(selectAllOrderAdmin);
    const ordersUser = useSelector(selectOrdersByUser);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        dispatch(fetchGetAllOrderStart({
            page: page,
            pageSize: pageSize,
        }));
    }, []);

    const getTrackingCode = async (order_id: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchGetTrackingCodeStart({
            order_id: order_id,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const checkOrder = async (data: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCheckOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const checkShippingFee = async (data: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCheckShippingFeeStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const cancelOrder = async (order_id: any, onSuccess: (data: any) => void, onFailed: (data: any) => void) => {
        dispatch(fetchCancelOrderStart({
            order_id: order_id,
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
    const getOrdersByUser = async () => {
        dispatch(fetchGetOrderByUserStart())
    }
    const callWebHook = async (data: any, onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchCallWebhookStart({
            data: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const downloadInvoice = async (order_id: any, onSuccess: (blob: any) => void, onFailed: () => void) => {
        dispatch(fetchDownloadInvoiceStart({
            order_id,
            onSuccess,
            onFailed,
        }));
    }

    return {
        allOrder,
        checkOrder,
        getAllOrdersAdmin,
        allOrderAdmin,
        page,
        setPage,
        pageSize,
        setPageSize,
        ordersUser,
        getOrdersByUser,
        callWebHook,
        checkShippingFee,
        cancelOrder,
        getTrackingCode,
        downloadInvoice
    }
}

