"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import medicine from "@/images/medicinee.png";
import Image, { StaticImageData } from "next/image";
import OrderSummary from "@/app/checkout/orderSumary";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

import Delivery from "./delivery";

interface Product {
  id: number;
  name: string;
  image: string | StaticImageData;
  price: number;
  originPrice: number;
  quantity: number;
  unit: string;
}

const productsData: Product[] = [
  {
    id: 1,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 1,
    unit: "Cái",
  },
  {
    id: 2,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo",
    image: medicine,
    price: 100000,
    originPrice: 300000,
    quantity: 2,
    unit: "Cái",
  },
];

const ShoppingCart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const totalAmount = useMemo(() => {
    return products
      .filter((product) => selectedProducts.includes(product.id))
      .reduce((total, product) => total + product.price * product.quantity, 0);
  }, [products, selectedProducts]);

  const totalOriginPrice = useMemo(() => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        total += product.originPrice * product.quantity;
      }
      return total;
    }, 0);
  }, [selectedProducts, products]);
  const totalDiscount = totalOriginPrice - totalAmount;
  const totalSave = totalDiscount;

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col px-5">
        <div className="flex flex-col px-5">
          {/* Đặt div chứa link riêng biệt */}
          <div className="pt-14">
            <Link
              href="/cart"
              className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Quay lại giỏ hàng</span>
            </Link>
          </div>
          <h3 className="font-semibold mt-2 mb-3 ml-4">Sản phẩm đã chọn</h3>
        </div>
        <div className="flex flex-col lg:flex-row">
          {/* Cột chứa sản phẩm và thông tin giao hàng */}
          <div className="flex-1 rounded-xl">
            <div className="px-8">
              {/* Danh sách sản phẩm */}
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

            {/* Phần Thông tin giao hàng */}
            <Delivery />
          </div>
          <OrderSummary
            totalAmount={totalAmount}
            totalOriginPrice={totalOriginPrice}
            totalDiscount={totalDiscount}
            totalSave={totalSave}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
