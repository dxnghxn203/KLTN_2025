"use client";

import Sidebar from "@/components/Pharmacist/Sidebar/sidebar";
import Header from "@/components/Pharmacist/Header/header";
import { useState } from "react";

export default function PharmacistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
