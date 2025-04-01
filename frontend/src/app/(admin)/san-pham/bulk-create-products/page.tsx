"use client";
import { useState } from "react";
import BulkCreateProduct from "@/components/Admin/Product/BulkCreateProducts/bulkCreateProduct";

const CreateSingle = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <BulkCreateProduct />
    </div>
  );
};

export default CreateSingle;
