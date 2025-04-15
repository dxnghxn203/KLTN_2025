"use client";
import React from "react";
import Image from "next/image";

interface ProductListProps {
  products: any[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="">
      <div className="flex-1 bg-[#F5F7F9] rounded-xl">
        {products.map((product: any, index: any) => (
          <div
            key={product.id}
            className={`flex items-center justify-between py-4 mx-4 text-sm ${
              index !== products.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <div className="w-[40%] flex items-center px-5 py-2">
              <Image
                src={product.image}
                alt={product.name}
                width={55}
                height={55}
                className="ml-4 rounded-lg border border-stone-300 p-1"
              />
              <span className="ml-4 line-clamp-3 overflow-hidden text-ellipsis">
                {product.products_name}
              </span>
            </div>
            <div className="w-[15%] text-center flex flex-col items-center">
              <span className="text-lg font-semibold text-[#0053E2]">
                {product.price.price.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="w-[15%] text-center">
              x{product.quantity} {product.price.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
