"use client";
import { useState } from "react";
import Product from "@/components/Admin/Product/product";

const ProductManagement = () => {

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <Product />
    </div>
  );
};

export default ProductManagement;
