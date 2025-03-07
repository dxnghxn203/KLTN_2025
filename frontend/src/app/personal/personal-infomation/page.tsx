"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiUser } from "react-icons/fi";
import EditProfileDialog from "@/components/Dialog/editProfileDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

import Sidebar from "@/components/Profile/sideBar";

const PersonalInformation: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("profile");

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
        <Sidebar />
      </main>
      <Footer />
    </div>
  );
};

export default PersonalInformation;
