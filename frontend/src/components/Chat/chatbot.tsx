import React, {useRef, useState, useEffect, useCallback} from "react";
import {X, Send} from "lucide-react"; // Thêm Send icon
import {ConfirmCloseModal} from "./confirmCloseModal";

type Props = {
    setShowChatbot: (show: boolean) => void;
};

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const ChatBot: React.FC<Props> = ({setShowChatbot}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const [errorSession, setErrorSession] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [errorSendingMessage, setErrorSendingMessage] = useState<string | null>(null);

    const messagesEndRef = useRef<null | HTMLDivElement>(null); // Để scroll xuống tin nhắn mới nhất

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        const startConversation = async () => {
            setIsLoadingSession(true);
            setErrorSession(null);
            try {
                const response = await fetch('https://recommendation.medicaretech.io.vn/v1/conversation/start', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                    },
                    body: ''
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({message: "Lỗi không xác định khi bắt đầu session."}));
                    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
                }
                const result = await response.json();
                if (result.status_code === 200 && result.data && result.data.session_id) {
                    setSessionId(result.data.session_id);
                    setMessages([{
                        id: `ai-welcome-${Date.now()}`,
                        text: "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?",
                        sender: "ai",
                        timestamp: new Date()
                    }]);
                } else {
                    throw new Error(result.message || "Không lấy được session_id từ API.");
                }
            } catch (error: any) {
                console.error("Lỗi khi bắt đầu conversation:", error);
                setErrorSession(error.message || "Có lỗi xảy ra khi khởi tạo chat session.");
            } finally {
                setIsLoadingSession(false);
            }
        };
        startConversation();
    }, []);

    const handleClose = useCallback(() => {
        setShowConfirmModal(true);
    }, []);

    const handleConfirmClose = useCallback(() => {
        setShowConfirmModal(false);
        setShowChatbot(false);
    }, [setShowChatbot]);

    const handleCancelClose = useCallback(() => {
        setShowConfirmModal(false);
    }, []);

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || !sessionId || isSendingMessage) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: currentMessage,
            sender: "user",
            timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setCurrentMessage("");
        setIsSendingMessage(true);
        setErrorSendingMessage(null);

        try {
            const response = await fetch('https://recommendation.medicaretech.io.vn/v1/message', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: userMessage.text,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({message: "Lỗi không xác định khi gửi tin nhắn."}));
                throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.status_code === 200 && result.data && result.data.ai_answer) {
                const aiMessage: Message = {
                    id: `ai-${Date.now()}`,
                    text: result.data.ai_answer,
                    sender: "ai",
                    timestamp: new Date()
                };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } else {
                throw new Error(result.message || "Không nhận được câu trả lời hợp lệ từ AI.");
            }
        } catch (error: any) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setErrorSendingMessage(error.message || "Có lỗi xảy ra khi gửi tin nhắn.");
            const errorAiMessage: Message = {
                id: `ai-error-${Date.now()}`,
                text: `Lỗi: ${error.message || "Không thể nhận phản hồi từ AI."}`,
                sender: "ai",
                timestamp: new Date()
            };
            setMessages(prevMessages => [...prevMessages, errorAiMessage]);
        } finally {
            setIsSendingMessage(false);
        }
    };


    return (
        <>
            <div className="h-full bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div
                    className="fixed bottom-24 right-6 w-96 h-[500px] bg-white border border-blue-200 rounded-2xl shadow-2xl z-50 flex flex-col">
                    {/* Header */}
                    <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 py-3 rounded-t-2xl flex justify-between items-center shadow">
                        <span className="font-bold text-lg">💊 Chat với AI</span>
                        <button
                            onClick={handleClose}
                            className="text-white text-2xl hover:text-red-200 transition"
                        >
                            <X/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isLoadingSession && <p className="text-center text-gray-500">Đang khởi tạo chat...</p>}
                        {errorSession && <p className="text-center text-red-500">Lỗi khởi tạo: {errorSession}</p>}

                        {!isLoadingSession && !errorSession && !sessionId && (
                            <p className="text-center text-gray-500">Không thể khởi tạo session ID.</p>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg shadow ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {errorSendingMessage &&
                            <p className="text-center text-xs text-red-500 mt-1">Lỗi gửi: {errorSendingMessage}</p>}
                        <div ref={messagesEndRef}/>
                    </div>

                    {sessionId && !isLoadingSession && !errorSession && (
                        <div className="p-3 border-t border-blue-100">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                                    disabled={isSendingMessage}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSendingMessage || !currentMessage.trim()}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                                >
                                    {isSendingMessage ? (
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Send size={20}/>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmCloseModal
                isOpen={showConfirmModal}
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
            />
        </>
    );
};

export default ChatBot;