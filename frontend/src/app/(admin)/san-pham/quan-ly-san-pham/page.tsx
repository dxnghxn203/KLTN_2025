"use client";
import { useState } from "react";
import ManagerProducts from "@/components/Admin/Product/ManagerProducts/managerProducts";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Product");

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <ManagerProducts />
    </div>
  );
};

export default Dashboard;
