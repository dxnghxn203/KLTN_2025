"use client";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import CartEmpty from "./cartEmpty/page";
import ProductsViewedList from "@/components/productsViewedList/productsViewedList";
import ShoppingCart from "./shoppingCart/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col space-y-8 px-5">
        {/* <CartEmpty /> */}
        <ShoppingCart />
        <div className="self-start text-2xl font-extrabold text-black">
          Sản phẩm vừa xem
        </div>
        <ProductsViewedList />
      </main>
      <Footer />
    </div>
  );
}
