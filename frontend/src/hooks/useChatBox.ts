import { fetchGetAllConversationWaitingFailed, fetchGetAllConversationWaitingStart, selectAllConversationWaiting } from "@/store";
import { fetchCallWebhookStart, fetchCancelOrderStart, fetchCheckOrderStart, fetchCheckShippingFeeStart, fetchGetAllOrderAdminStart, fetchGetAllOrderStart, fetchGetOrderByUserStart, selectAllOrder, selectAllOrderAdmin, selectOrdersByUser, fetchGetTrackingCodeStart, fetchDownloadInvoiceStart, fetchGetStatistics365DaysStart, fetchRequestPrescriptionStart, fetchGetRequestOrderStart, fetchGetApproveRequestOrderStart, fetchApproveRequestOrderStart } from "@/store/order";
import { on } from "events";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useChatBox() {
    const dispatch = useDispatch();
    
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allConversationWaiting = useSelector(selectAllConversationWaiting);
    //  const categoryAdmin: any = useSelector(selectCategoryAdmin);selectAllConversationWaiting
      const fetchGetAllConversationWaiting = (limit: any,
          onSuccess: () => void,
          onFailure: () => void) => {
          dispatch(fetchGetAllConversationWaitingStart({
            limit: limit,
            onSuccess: onSuccess,
            onFailure: onFailure,
          }));
        };


 
    


    return {
        
        page,
        setPage,
        pageSize,
        setPageSize,
        allConversationWaiting,
        fetchGetAllConversationWaiting
       
    }
}

