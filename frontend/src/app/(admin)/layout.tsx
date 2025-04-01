"use client";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="admin-layout">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
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
