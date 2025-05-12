"use client";

import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaCamera } from "react-icons/fa6";
import { X } from "lucide-react";
import {
  ADMIN_ROUTES,
  PARTNER_ROUTES,
  PHARMACIST_ROUTES,
} from "@/utils/constants";
import { getToken, getTokenAdmin, getTokenPharmacist } from "@/utils/cookie";

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

  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      <div>
        {isAdmin || isPartner || isPharmacist ? null : <Header />}
        {children}
        {isAdmin || isPartner || isPharmacist ? null : <Footer />}
        {isAdmin || isPartner || isPharmacist
          ? null
          : !showChatbot && (
              <button
                onClick={() => setShowChatbot(true)}
                className="fixed bottom-8 right-6 z-50 w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl"
                aria-label="Mở chatbot AI"
              >
                🤖
              </button>
            )}
      </div>
      {showChatbot && (
        <div className="fixed bottom-12 right-6 w-96 h-[450px] bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span className="font-bold">Chat với Dược sĩ AI</span>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white text-xl"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
            {/* Nội dung chat sẽ nằm ở đây */}
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
      )}
    </>
  );
}
