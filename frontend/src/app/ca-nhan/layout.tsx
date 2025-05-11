"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Profile/sideBar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === "/ca-nhan/thong-tin-ca-nhan") {
      return <span className="text-gray-500"> / Thông tin cá nhân</span>;
    } else if (pathname === "/ca-nhan/lich-su-don-hang") {
      return <span className="text-gray-500"> / Lịch sử đơn hàng</span>;
    } else if (pathname === "/ca-nhan/don-thuoc-cua-toi") {
      return <span className="text-gray-500"> / Đơn thuốc của tôi</span>;
    }
    return null;
  };

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <main className="flex flex-col pt-14 mb-10">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/ca-nhan" className="hover:underline text-blue-600">
            Cá nhân
          </Link>
          {getBreadcrumb()}
        </div>
        <div className="flex flex-row w-full">
          <Sidebar />
          <div className="flex flex-col w-3/4 p-5">{children}</div>
        </div>
      </main>
    </div>
  );
}
