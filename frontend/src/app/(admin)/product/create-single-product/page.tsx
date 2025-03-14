"use client";
import { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import ManagerProducts from "@/components/Admin/Product/ManagerProducts/managerProducts";
import CreateSingleProduct from "@/components/Admin/Product/CreateProduct/CreateSingleProduct";

const CreateSingle = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Product");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar cố định */}
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header cố định */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Phần chính có thể cuộn */}
        <main className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
          <CreateSingleProduct />
        </main>
      </div>
    </div>
  );
};

export default CreateSingle;
