"use client";
import { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import Order from "@/components/Admin/Order/orderManagement";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Order");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex flex-col flex-1 h-screen">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
          <Order />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
