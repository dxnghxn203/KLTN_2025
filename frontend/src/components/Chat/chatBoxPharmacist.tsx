import React, {useRef, useState, useEffect} from "react";
import {X} from "lucide-react";
import {UserChat} from "@/components/Chat/userChat";
import {GuestChat} from "@/components/Chat/guestChat";
import {useAuth} from "@/hooks/useAuth";

type Props = {
    setShowChatbotPharmacist: (show: boolean) => void;
};

const ChatBoxPharmacist: React.FC<Props> = ({setShowChatbotPharmacist}) => {

    return (
        <div className="h-full bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div
                className="fixed bottom-24 right-6 w-96 h-[500px] bg-white border border-blue-200 rounded-2xl shadow-2xl z-50 flex flex-col">
                <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-5 py-3 rounded-t-2xl flex justify-between items-center shadow">
                    <span className="font-bold text-lg">💊 Chat với Dược sĩ</span>
                    <button
                        onClick={() => setShowChatbotPharmacist(false)}
                        className="text-white text-2xl hover:text-red-200 transition"
                    >
                        <X/>
                    </button>
                </div>

                <div className="flex-1 overflow-hidden"> {/* Thêm wrapper này */}
                    <GuestChat/>
                </div>
            </div>
        </div>
    );
};

export default ChatBoxPharmacist;