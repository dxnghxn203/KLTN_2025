"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductPortfolioList from "@/components/Product/productPortfolioList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import CategoryFunctionalProduct from "@/components/Category/category";
import Filter from "@/components/Category/filter";

// Mảng chứa dữ liệu sản phẩm

export default function FunctionalProduct() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        {/* Điều hướng đường dẫn */}
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          {pathname === "/functional-product" && (
            <span className="text-gray-500"> / Thực phẩm chức năng</span>
          )}
        </div>
        <div className="text-2xl font-bold py-4 px-6">Thực phẩm chức năng</div>

        <CategoryFunctionalProduct />
        <div className="grid grid-cols-6 gap-4">
          <Filter />
          <div className="col-span-5 mr-5 pt-[38px] space-y-6">
            <div className="flex space-x-4 items-center">
              <span className="">Sắp xếp theo</span>
              <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
                Giá tăng dần
              </button>
              <button className="px-6 py-2 border border-gray-300 text-black/50 rounded-lg text-semibold ">
                Giá giảm dần
              </button>
            </div>
            <ProductPortfolioList />
          </div>
        </div>
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
