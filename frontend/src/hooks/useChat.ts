import {useDispatch, useSelector} from 'react-redux';
import {fetchChatBoxInitStart} from "@/store";

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

    return {
        initChatBox

    };
}

