"use client";
import { useState } from "react";
import Sidebar from "@/components/Admin/DashBoardNav/dashboardNav";
import Header from "@/components/Admin/Header/header";
import Order from "@/components/Admin/Order/order";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Order");

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="bg-[#FAFBFB]">
          <Order />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
