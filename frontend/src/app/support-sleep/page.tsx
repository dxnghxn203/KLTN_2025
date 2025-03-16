"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductsViewedList from "@/components/Product/productsViewedList";
import ProductMedicineList from "@/components/Product/productMedicineList";
import CategorySupportSleep from "@/components/Category/categorySupportSleep";

// Mảng chứa dữ liệu sản phẩm

export default function SupportSleep() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          {pathname === "/support-sleep" && (
            <span className="text-gray-500"> / Hỗ trợ giấc ngủ</span>
          )}
        </div>
        <div className="text-2xl font-bold py-4 px-6">Hỗ trợ giấc ngủ</div>
        <CategorySupportSleep />
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
