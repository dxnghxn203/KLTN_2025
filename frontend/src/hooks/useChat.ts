import {useDispatch, useSelector} from 'react-redux';
import {fetchChatBoxInitStart} from "@/store";

export function useChat() {
    const dispatch = useDispatch();

    const initChatBox = (
        data: any,
        onSuccess: (data: any) => void,
        onFailure: () => void
    ) => {
        dispatch(
            fetchChatBoxInitStart(
                {
                    data: data,
                    onSuccess: onSuccess,
                    onFailure: onFailure
                }
            )
        )
    }

    return {
        initChatBox

    };
}

