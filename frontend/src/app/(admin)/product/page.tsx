"use client";
import { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import Product from "@/components/Admin/Product/product";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Product");

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="bg-[#FAFBFB] h-full">
          <Product />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
