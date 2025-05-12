import React, {useRef, useState, useEffect} from "react";
import {useChat} from "@/hooks/useChat";
import {X} from "lucide-react";
import {FaCamera} from "react-icons/fa6";
import {IoSend} from "react-icons/io5";
import {ChatWebSocket} from "@/components/Chat/chatWebSocket";
import Loading from "@/app/loading";

type Props = {
    setShowChatbotPharmacist: (show: boolean) => void;
};

const ChatBotPharmacist: React.FC<Props> = ({setShowChatbotPharmacist}) => {
    const {initChatBox} = useChat();
    const wsRef = useRef<{ sendMessage: (msg: any) => void, disconnect: () => void }>(null);

    const [conversationId, setConversationId] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [partnerConnected, setPartnerConnected] = useState(false);

    const [message, setMessage] = useState("");
    const [chatReady, setChatReady] = useState(false);

    useEffect(() => {
        initChatBox(
            (data) => {
                console.log(data);
                setConversationId(data._id);
                setChatReady(true);
            },
            () => {
                alert("Không thể khởi tạo chatbox");
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onBeforeUnload = () => {
            wsRef.current = null;
            setConversationId("");
            setMessages([]);
            setChatReady(false);
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            wsRef.current = null;
            setConversationId("");
            setMessages([]);
            setChatReady(false);
        };
    }, []);

    const handleReceive = (msg: any) => {
        if (msg.type === "partner_connected") {
            setPartnerConnected(true);
        }
        if (msg.type === "message" || msg.type === "new_message") {
            setMessages((prev) => [...prev, msg.message ? msg.message : msg]);
        }
    };
    
    const handleSend = () => {
        if (message.trim() && wsRef.current && conversationId) {
            wsRef.current.sendMessage({
                type: "message",
                sender_type: "guest",
                content: message,
            });
            setMessages((prev) => [
                ...prev,
                {
                    type: "message",
                    sender_type: "guest",
                    content: message,
                }
            ]);
            setMessage("");
        }
    };

    const handleClose = () => {
        wsRef.current?.disconnect();  // chủ động disconnect
        setShowChatbotPharmacist(false);
    };

    return (
        <div className="h-full bg-gradient-to-br from-blue-50 via-white to-green-50">


            <ChatWebSocket
                ref={wsRef}
                conversationId={conversationId}
                clientType="guest"
                onReceive={handleReceive}
            />
            <div
                className="fixed bottom-24 right-6 w-96 h-1/2 bg-white border border-blue-200 rounded-2xl shadow-2xl z-50 flex flex-col">
                <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 py-3 rounded-t-2xl flex justify-between items-center shadow">
                    <span className="font-bold text-lg">💊 Chat với Dược sĩ</span>
                    <button onClick={() => {
                        handleClose()
                    }}
                            className="text-white text-2xl hover:text-red-200 transition">
                        <X/>
                    </button>
                </div>
                {
                    conversationId ? (
                        <>
                            <div className="flex-1 p-4 overflow-y-auto bg-white">
                                <div className="text-gray-500 italic text-center mb-3">
                                    Xin chào! Tôi có thể giúp gì cho bạn?
                                </div>
                                {partnerConnected && (
                                    <div className="text-green-600 text-center font-semibold mb-2 animate-pulse">
                                        👩‍⚕️ Dược sĩ đã tham gia hỗ trợ bạn!
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`my-2 flex ${msg.sender_type === "guest" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-xl max-w-[70%] text-base whitespace-pre-line shadow
                                ${msg.sender_type === "guest"
                                                ? "bg-blue-100 text-blue-900 rounded-br-3xl"
                                                : "bg-green-100 text-green-900 rounded-bl-3xl"}`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="p-3 border-t flex space-x-2 justify-between items-center bg-white rounded-b-2xl">
                                <button className="hover:bg-blue-50 p-2 rounded-full transition">
                                    <FaCamera className="text-2xl text-gray-500"/>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-100 bg-blue-50"
                                />
                                <button className="text-blue-600 hover:text-blue-800 transition" onClick={handleSend}>
                                    <IoSend className="text-2xl"/>
                                </button>
                            </div>


                        </>) : (
                        <>
                            <Loading/>
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default ChatBotPharmacist;