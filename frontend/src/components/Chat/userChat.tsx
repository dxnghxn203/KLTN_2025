import {useState, useEffect} from 'react';
import {Conversation} from "@/types/chat";
import {useWebSocket} from "@/hooks/useWebsocket";

export const UserChat = () => {
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {messages, sendMessage, isConnected} = useWebSocket({
        conversationId: conversation?._id || '',
        isGuest: false
    });

    // useEffect(() => {
    //     const initializeChat = async () => {
    //         try {
    //             const response = await chatService.createUserConversation();
    //             setConversation(response);
    //         } catch (error) {
    //             setError('Failed to initialize chat. Please try again.');
    //             console.error('Error initializing chat:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //
    //     initializeChat();
    // }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const messageInput = (e.target as HTMLFormElement).message;
        if (messageInput.value.trim()) {
            sendMessage(messageInput.value);
            messageInput.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-blue-500 text-white p-4">
                <h1 className="text-xl">Chat with Pharmacist</h1>
                <p className="text-sm">
                    {isConnected ? 'Connected' : 'Connecting...'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.map((message: any, index: any) => (
                    <div
                        key={index}
                        className={`p-2 rounded max-w-[80%] ${
                            message.sender === 'user'
                                ? 'bg-blue-100 ml-auto'
                                : 'bg-gray-100'
                        }`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        name="message"
                        className="flex-1 p-2 border rounded"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        disabled={!isConnected}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};