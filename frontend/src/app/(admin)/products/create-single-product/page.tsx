"use client";
import { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar/sidebar";
import Header from "@/components/Admin/Header/header";
import CreateSingleProduct from "@/components/Admin/Product/CreateProduct/CreateSingleProduct";

const CreateSingle = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Product");

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
        <CreateSingleProduct />
    </div>
  );
};

export default CreateSingle;
