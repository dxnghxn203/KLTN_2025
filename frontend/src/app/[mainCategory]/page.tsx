"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductPortfolioList from "@/components/Product/productFunctionalList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCategory } from "@/hooks/useCategory";
import { useEffect, useMemo } from "react";
import CategoryList from "@/components/Category/categogyList";

export default function MainCategoryPage() {
  const params = useParams();
  const { mainCategory, fetchMainCategory } = useCategory();
  
  useEffect(() => {
    fetchMainCategory(params.mainCategory);
  }, []);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span className="text-gray-500"> / {mainCategory?.main_category_name}</span>
        </div>
        <div className="text-2xl font-bold p-4">{mainCategory?.main_category_name}</div>
        <CategoryList data={mainCategory} />
        <ProductPortfolioList />
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
