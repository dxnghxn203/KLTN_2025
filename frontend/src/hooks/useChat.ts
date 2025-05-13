import {useDispatch, useSelector} from 'react-redux';
import {fetchChatBoxInitStart, fetchGetAllConversationWaitingStart} from "@/store";
import { useState } from 'react';
import { selectAllConversationWaiting } from '@/store/chat/chatSelector';

export function useChat() {
    const dispatch = useDispatch();

    const initChatBox = (
        onSuccess: (data: any) => void,
        onFailure: () => void
    ) => {
        dispatch(
            fetchChatBoxInitStart(
                {
                    onSuccess: onSuccess,
                    onFailure: onFailure
                }
            )
        )
    }


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
        initChatBox,
         page,
        setPage,
        pageSize,
        setPageSize,
        allConversationWaiting,
        fetchGetAllConversationWaiting

    };
}

