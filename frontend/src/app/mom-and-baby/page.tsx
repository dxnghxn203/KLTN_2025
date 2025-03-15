"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductsViewedList from "@/components/Product/productsViewedList";
import ProductMedicineList from "@/components/Product/productMedicineList";
import CategoryMomAndBaby from "@/components/Category/categoryMomAndBaby";

// Mảng chứa dữ liệu sản phẩm

export default function MomAndBaby() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          {pathname === "/mom-and-baby" && (
            <span className="text-gray-500"> / Mẹ và bé</span>
          )}
        </div>
        <div className="text-2xl font-bold py-4 px-6">Mẹ và bé</div>
        <CategoryMomAndBaby />
        <ProductMedicineList />
      </main>
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm vừa xem
      </div>
      <div className="px-5">
        <ProductsViewedList />
      </div>

      <Footer />
    </div>
  );
}
