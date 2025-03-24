"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

import Sidebar from "@/components/Profile/sideBar";

const PersonalInformation: React.FC = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14 mb-10">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/personal" className="hover:underline text-blue-600">
            Cá nhân
          </Link>

          {pathname === "/personal/order-history" && (
            <span className="text-gray-500"> / Lịch sử đơn hàng</span>
          )}
        </div>
        <Sidebar />
      </main>
    </div>
  );
};

export default PersonalInformation;
