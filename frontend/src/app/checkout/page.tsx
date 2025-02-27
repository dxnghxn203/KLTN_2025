"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OrderSummary from "@/app/checkout/productInfo/orderSumary";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Image, { StaticImageData } from "next/image";
import medicine from "@/images/medicinee.png";
import Delivery from "./checkoutInfo/page";
import ProductList from "./productInfo/productList";

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
        <div className="flex flex-col">
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
          <div className="flex-1 rounded-xl">
            <ProductList products={products} />
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
