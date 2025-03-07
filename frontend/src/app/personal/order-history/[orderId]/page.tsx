"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuFileClock } from "react-icons/lu";
import HistoryOrder from "@/components/Profile/historyOrder";
import PersonalInfomation from "@/components/Profile/personalInfo";
import OrderDetailPage from "@/components/Profile/detailOrder";

const PersonalInformation: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const params = useParams();
  const orderId = Array.isArray(params?.orderId)
    ? params.orderId[0]
    : params?.orderId; // Chuyển về string nếu cần

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/personal" className="hover:underline text-blue-600">
            Cá nhân
          </Link>

          {pathname === "/personal/personal-infomation" && (
            <span className="text-gray-500"> / Thông tin cá nhân</span>
          )}

          {pathname === "/personal/order-history" && (
            <span className="text-gray-500"> / Lịch sử đơn hàng</span>
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
                <Link href="/personal/personal-infomation">
                  <button
                    className={`font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
              ${
                pathname === "/personal" ||
                pathname === "/personal/personal-infomation"
                  ? "bg-[#F0F5FF] text-[#0053E2]"
                  : "text-gray-800 hover:bg-[#EBEBEB]"
              }`}
                  >
                    <FaRegCircleUser className="mr-2 text-xl" />
                    Thông tin cá nhân
                  </button>
                </Link>

                <Link href="/personal/order-history">
                  <button
                    className={`font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
      ${
        pathname.startsWith("/personal/order-history")
          ? "bg-[#F0F5FF] text-[#0053E2]"
          : "text-gray-800 hover:bg-[#EBEBEB]"
      }`}
                  >
                    <LuFileClock className="mr-2 text-xl" />
                    Lịch sử đơn hàng
                  </button>
                </Link>

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

          <div className="flex-1 px-5">
            {(pathname === "/personal" ||
              pathname === "/personal/personal-infomation") && (
              <PersonalInfomation />
            )}
            {pathname === "/personal/order-history" && <HistoryOrder />}
            {orderId && <OrderDetailPage />}
            {/* Truyền orderId dưới dạng string */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PersonalInformation;
