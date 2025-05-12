import React, {useEffect, useRef, useImperativeHandle, forwardRef} from "react";
import {WsChatClient} from "@/utils/configs/wsChatClient";

type Props = {
    conversationId: string;
    clientType: string;
    userId?: string;
    onReceive: (msg: any) => void;
};

export const ChatWebSocket = forwardRef(function ChatWebSocket(
    {conversationId, clientType, userId, onReceive}: Props,
    ref
) {
    const wsClientRef = useRef<WsChatClient | null>(null);

    useEffect(() => {
        const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/v1/ws/${conversationId}/${clientType}` +
            (userId ? `?user_id=${userId}` : "");
        console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
        wsClientRef.current = new WsChatClient(wsUrl, onReceive);
        wsClientRef.current.connect();

        return () => {
            wsClientRef.current?.close();
        };
    }, [conversationId, clientType, userId, onReceive]);

    useImperativeHandle(ref, () => ({
        sendMessage: (msg: any) => {
            wsClientRef.current?.send(msg);
        },
        disconnect: () => {
            wsClientRef.current?.close();
        }
    }));

    return null;
});