"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  image: string | StaticImageData;
  price: number;
  originPrice: number;
  quantity: number;
  unit: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="px-8">
      <div
        className="flex-1 bg-[#F5F7F9] rounded-xl"
        style={{ height: `${products.length * 20}%` }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="sticky flex items-center justify-between py-4 px-4 text-sm "
          >
            <div
              className={`absolute bottom-0 left-5 right-5 border-b border-black border-opacity-10 ${
                index === products.length - 1 ? "hidden" : ""
              }`}
            ></div>
            <div className="w-[40%] flex items-center px-5 py-2">
              <Image
                src={product.image}
                alt={product.name}
                width={55}
                height={55}
                className="ml-4 rounded-lg border border-stone-300"
              />
              <span className="ml-4 line-clamp-3 overflow-hidden text-ellipsis">
                {product.name}
              </span>
            </div>
            <div className="w-[15%] text-center flex flex-col items-center">
              <span className="text-lg font-semibold text-[#0053E2]">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originPrice > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
            <div className="w-[15%] text-center">x1 Chai</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
