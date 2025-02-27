"use client";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import ProductMain from "./productMain/page";
import ProductsViewedList from "@/components/productsViewedList/productsViewedList";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col space-y-8 px-5 pt-20">
        <ProductMain />
      </main>
      <ProductsViewedList />
      <Footer />
    </div>
  );
}
