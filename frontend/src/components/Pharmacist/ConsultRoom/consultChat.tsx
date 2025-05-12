"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "user1", text: "Chào bạn!" },
    { sender: "user2", text: "Bạn khỏe không?" },
  ]);
  const [input, setInput] = useState("");
  const [currentSender, setCurrentSender] = useState("user1");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tự động cuộn xuống cuối khi có tin nhắn mới
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: currentSender, text: input }]);
    setInput("");
    setCurrentSender(currentSender === "user1" ? "user2" : "user1");
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="p-4 font-semibold text-center text-lg">
        Chat giữa 2 người
      </div>

      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[50%] p-2 rounded-lg text-sm ${
              msg.sender === "user1"
                ? "bg-blue-100 self-start"
                : "bg-green-100 self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input area fixed at bottom */}
      <div className="bottom-1">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 focus:outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Nhập tin nhắn (${currentSender})`}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
