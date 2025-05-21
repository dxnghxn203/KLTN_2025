import {useDispatch, useSelector} from 'react-redux';
import {selectAllVoucher, selectAllVoucherUser} from "@/store/voucher/voucherSelector";
import {
    fetchAddVoucherStart,
    fetchAllVouchersStart,
    fetchDeleteVoucherStart,
    fetchGetAllVoucherUserStart,
    fetchUpdateStatusStart
} from '@/store';


export function useVoucher() {
    const dispatch = useDispatch();
    const allVouchers = useSelector(selectAllVoucher);
    const allVoucherUser = useSelector(selectAllVoucherUser);

    const fetchAllVouchers = (page: any, page_size: any, onSuccess: () => void, onFailure: () => void,) => {
        dispatch(fetchAllVouchersStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                page: page,
                page_size: page_size,
            }
        ));
    };
    const fetchAddVoucher = (params: any, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchAddVoucherStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                ...params,
            }
        ));
    }
    const fetchDeleteVoucher = (voucher_id: any, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchDeleteVoucherStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                voucher_id: voucher_id,
            }
        ));
    }

    const fetchUpdateStatusVoucher = (params: {
        voucher_id: string;
        status_voucher: boolean
    }, onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchUpdateStatusStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
                ...params
            }
        ));
    }

    const fetchGetAllVoucherUser = (onSuccess: () => void, onFailure: () => void) => {
        dispatch(fetchGetAllVoucherUserStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
    }


    return {
        allVouchers,
        fetchAllVouchers,
        fetchAddVoucher,
        fetchDeleteVoucher,
        fetchUpdateStatusVoucher,
        allVoucherUser,
        fetchGetAllVoucherUser,
    };
}

