"use client";
import CartEmpty from "@/components/Cart/emptyCart";
import ShoppingCart from "@/components/Cart/shoppingCart";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Cart() {
  const { cartLocal } = useCart();

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col space-y-8">
        <div className="flex flex-col px-5">
          <div className="pt-14">
            <Link
              href="/"
              className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
          {cartLocal?.length ? <ShoppingCart /> : <CartEmpty />}
        </div>
        <div className="self-start text-2xl font-extrabold text-black px-5">
          Sản phẩm vừa xem
        </div>
        <div className="px-5">
          <ProductsViewedList />
        </div>
      </main>
    </div>
  );
}
