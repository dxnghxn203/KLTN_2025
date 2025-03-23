"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductsSelling from "@/components/Collection/productsSelling";
import ProductsDeals from "@/components/Collection/productsDeals";

const Collection: React.FC = () => {
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
       {/* <Header /> */}
      <main className="flex flex-col pt-14">
        <ProductsDeals />
      </main>
      <Footer />
    </div>
  );
};

export default Collection;
