"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { FiLogOut, FiUser } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuFileClock } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonalInformation from "@/components/Profile/profile";

export default function Profile() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("profile"); // Mặc định là "profile"

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          {pathname === "/personal" && (
            <>
              <span className="text-gray-500"> / Cá nhân</span>
              {activeTab === "profile" && (
                <span className="text-gray-500"> / Thông tin cá nhân</span>
              )}
              {activeTab === "orders" && (
                <span className="text-gray-500"> / Lịch sử đơn hàng</span>
              )}
            </>
          )}
        </div>

        <div className="flex min-h-screen p-5">
          {/* Sidebar */}
          <div className="w-1/4">
            <div className="bg-[#F5F7F9] h-40 p-6 rounded-lg flex flex-col items-center justify-center">
              {user?.image ? (
                <img
                  src={user?.image}
                  alt={user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-8 h-8 text-[#0053E2]" />
              )}
              <h2 className="text-lg text-black font-semibold mt-2">
                {user?.name}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            <div className="bg-[#F5F7F9] mt-2 rounded-lg">
              <div>
                <button
                  className={`font-semibold px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      activeTab === "profile"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <FaRegCircleUser className="mr-2 text-xl font-medium" />
                  Thông tin cá nhân
                </button>
                <button
                  className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                    ${
                      activeTab === "orders"
                        ? "bg-[#F0F5FF] text-[#0053E2]"
                        : "text-gray-800 hover:bg-[#EBEBEB]"
                    }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <LuFileClock className="mr-2 text-xl" />
                  Lịch sử đơn hàng
                </button>
                <button
                  className="font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer text-gray-800 hover:bg-[#EBEBEB]"
                  onClick={logout}
                >
                  <FiLogOut className="mr-2 text-xl" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 px-5">
            <div className="bg-[#F5F7F9] p-6 rounded-lg">
              {activeTab === "profile" && <PersonalInformation />}
              {activeTab === "orders" && <h2>Lịch sử đơn hàng</h2>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
