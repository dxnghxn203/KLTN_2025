"use client";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ProductMain from "./productMain/page";
import ProductsRelatedList from "@/components/productsRelatedList/productsRelatedList";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col space-y-8 px-5 pt-16">
        <ProductMain />
      </main>
      <div className="self-start text-2xl font-extrabold text-black px-5 mt-6">
        Những sản phẩm liên quan
        <ProductsRelatedList />
      </div>
      <Footer />
    </div>
  );
}
