import {
    fetchCallWebhookStart, fetchCancelOrderStart, fetchCheckOrderStart,
    fetchCheckShippingFeeStart, fetchGetAllOrderAdminStart, fetchGetAllOrderStart,
    fetchGetOrderByUserStart, selectAllOrder, selectAllOrderAdmin, selectOrdersByUser,
    fetchGetTrackingCodeStart, fetchDownloadInvoiceStart, fetchGetStatistics365DaysStart,
    fetchRequestPrescriptionStart, fetchGetRequestOrderStart, fetchGetApproveRequestOrderStart,
    fetchApproveRequestOrderStart, fetchGetOverviewStatisticsOrderStart,
    fetchGetMonthlyRevenueStatisticsOrderStart, fetchGetCategoryMonthlyRevenueStatisticsOrderStart,
    fetchGetTypeMonthlyRevenueStatisticsOrderStart
} from "@/store/order";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

export function useOrder() {
    const dispatch = useDispatch();
    const allOrder = useSelector(selectAllOrder);
    const allOrderAdmin = useSelector(selectAllOrderAdmin);
    const ordersUser = useSelector(selectOrdersByUser);
    const statistics365Days = useSelector((state: any) => state.order.statistics365Days);
    const allRequestOrder = useSelector((state: any) => state.order.allRequestOrder);
    const allRequestOrderApprove = useSelector((state: any) => state.order.allRequestOrderApprove);
    const overviewStatisticsOrder = useSelector((state: any) => state.order.overviewStatisticsOrder);
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

    const allStatistics365Days = async (onSuccess: () => void, onFailed: () => void) => {
        dispatch(fetchGetStatistics365DaysStart({
            onSuccess,
            onFailed,

        }))
    }

    const fetchRequestPrescription = async (
        data: any,
        onSuccess: (message: any) => void,
        onFailed: (message: any) => void
    ) => {
        console.log(data, "hook");
        dispatch(fetchRequestPrescriptionStart({
            formData: data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }


    const fetchGetRequestOrder = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetRequestOrderStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }
    const fetchGetApproveRequestOrder = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetApproveRequestOrderStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchApproveRequestOrder = async (data: any, onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchApproveRequestOrderStart({
            ...data,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetOverviewSatisticsOrder = async (onSuccess: (message: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetOverviewStatisticsOrderStart({

            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetMonthlyRevenueStatisticsOrder = async (year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetMonthlyRevenueStatisticsOrderStart({
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetCategoryMonthlyRevenueStatisticsOrder = async (month: number, year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetCategoryMonthlyRevenueStatisticsOrderStart({
            month: month,
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
        }));
    }

    const fetchGetTypeMonthlyRevenueStatisticsOrder = async (month: number, year: number, onSuccess: (data: any) => void, onFailed: (message: any) => void) => {
        dispatch(fetchGetTypeMonthlyRevenueStatisticsOrderStart({
            month: month,
            year: year,
            onSuccess: onSuccess,
            onFailed: onFailed
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
        downloadInvoice,

        allStatistics365Days,
        statistics365Days,
        fetchRequestPrescription,
        fetchGetRequestOrder,
        allRequestOrder,

        fetchGetApproveRequestOrder,
        allRequestOrderApprove,
        fetchApproveRequestOrder,

        fetchGetOverviewSatisticsOrder,
        overviewStatisticsOrder,

        fetchGetMonthlyRevenueStatisticsOrder,

        fetchGetCategoryMonthlyRevenueStatisticsOrder,

        fetchGetTypeMonthlyRevenueStatisticsOrder
    }
}

