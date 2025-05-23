"use client";

import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaCamera } from "react-icons/fa6";
import { X } from "lucide-react";
import {
  ADMIN_ROUTES,
  PARTNER_ROUTES,
  PHARMACIST_ROUTES,
} from "@/utils/constants";
import ChatBoxPharmacist from "@/components/Chat/chatBoxPharmacist";
import ChatBot from "@/components/Chat/chatbot";
import AIImage from "@/images/AIImage.png";
import chatIcon from "@/images/chatbotAI.png";
import pharmacistIcon from "@/images/pharmacist_female.png";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = ADMIN_ROUTES.some(
    (route) => pathname?.startsWith(route) ?? false
  );
  const isPartner = PARTNER_ROUTES.some(
    (route) => pathname?.startsWith(route) ?? false
  );
  const isPharmacist = PHARMACIST_ROUTES.some(
    (route) => pathname?.startsWith(route) ?? false
  );

  const [showChatbotAI, setShowChatbotAI] = useState(false);
  const [showChatbotPharmacist, setShowChatbotPharmacist] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 5000);

    return () => clearTimeout(timer); // Dọn dẹp timer nếu component bị unmount
  }, []);
  const handleToggleTooltip = () => {
    setIsTooltipVisible((prev) => !prev);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleShowChatAI = () => {
    setShowChatbotAI(!showChatbotAI);
  };
  const handleShowChatPharmacist = () => {
    setShowChatbotPharmacist(!showChatbotPharmacist);
  };

  return (
    <>
      <div className="w-full h-full">
        {isAdmin || isPartner || isPharmacist ? null : <Header />}
        {children}
        {isAdmin || isPartner || isPharmacist ? null : <Footer />}
        {isAdmin || isPartner || isPharmacist
          ? null
          : !showChatbotAI &&
            !showChatbotPharmacist && (
              <div className="fixed bottom-2 right-6 transform -translate-y-1/2 -translate-x-1/2">
                <div className=" flex flex-col items-end">
                  <button
                    onClick={handleToggleMenu}
                    className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
                  >
                    <img src={AIImage.src} alt="AI" className="p-2" />
                  </button>
                </div>
              </div>
            )}
        {isTooltipVisible && (
          <div
            className="px-4 py-2 bg-white text-black text-sm rounded-t-lg rounded-tr-lg rounded-br-none rounded-bl-lg shadow-md animate-fade-in z-50 w-64 fixed bottom-24"
            style={{ right: "6.5rem", bottom: "5.5rem" }}
          >
            👋Xin chào! Chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </div>
        )}

        {showMenu && (
          <div
            className="mb-2 fixed bottom-24 right-6 z-50 bg-white rounded-t-lg rounded-tr-lg rounded-br-none rounded-bl-lg animate-fade-in text-sm flex flex-col shadow-md"
            style={{ right: "6.5rem", bottom: "5.5rem" }}
          >
            <button
              className="px-4 py-3 hover:bg-gray-100 text-left flex items-center"
              onClick={() => {
                handleShowChatAI();
              }}
            >
              <img src={chatIcon.src} alt="AI" className="w-6 h-6 mr-2" />
              Chat với AI
            </button>
            <button
              className="px-4 py-3 hover:bg-gray-100 text-left flex items-center"
              onClick={() => {
                // Handle Pharmacist chat
                handleShowChatPharmacist();
              }}
            >
              <img src={pharmacistIcon.src} alt="AI" className="w-6 h-6 mr-2" />
              Chat với Dược sĩ
            </button>
          </div>
        )}
        {showChatbotAI && (
          <div className="h-full">
            <div className="fixed bottom-24 right-6 w-96 h-1/2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
                <span className="font-bold">Chat với AI</span>
                <button
                  onClick={() => setShowChatbotAI(false)}
                  className="text-white text-xl"
                >
                  <X />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
              </div>
              <div className="p-3 border-t flex space-x-2 justify-between items-center">
                <button>
                  <FaCamera className="text-xl text-gray-500" />
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-2 py-1.5 border rounded-full placeholder:text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                />
                <button className="text-blue-600">
                  <IoSend className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        )}
        {showChatbotPharmacist && (
          <ChatBoxPharmacist
            setShowChatbotPharmacist={setShowChatbotPharmacist}
          />
        )}
        {showChatbotAI && <ChatBot setShowChatbot={setShowChatbotAI} />}
      </div>
    </>
  );
}
