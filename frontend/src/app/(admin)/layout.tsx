"use client";

import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Nếu đang ở trang login thì không render layout
  if (pathname === "/dang-nhap-admin") {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex flex-col flex-1 h-screen">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
