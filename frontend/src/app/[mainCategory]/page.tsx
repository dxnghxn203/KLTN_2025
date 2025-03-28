"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer/footer";
import ProductMainCategoryList from "@/components/Product/productMainCategoryList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCategory } from "@/hooks/useCategory";
import { useMemo } from "react";
import CategoryList from "@/components/Category/categoryList";

export default function MainCategoryPage() {
  const params = useParams();
  const { mainCategory, fetchMainCategory } = useCategory();

  const  mainCategoryName  = params.mainCategory;

  const data = useMemo(() => {
    fetchMainCategory(mainCategoryName);
    return mainCategory;
  }, [mainCategoryName]);
  console.log("MainCategory:", mainCategory);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span className="text-gray-500">
            / {mainCategoryName}
          </span>
        </div>
        <div className="text-2xl font-bold p-4">
          {mainCategoryName}
        </div>
        <CategoryList data={mainCategory} />
        <div className="mt-6">
          <ProductMainCategoryList
            data={mainCategory}
            mainCategoryName={mainCategory?.main_category_name}
          />
        </div>
      </main>
      <div className="text-2xl font-extrabold text-black px-5 pt-10">
        Sản phẩm vừa xem
      </div>
      <div className="px-5">
        <ProductsViewedList />
      </div>
    </div>
  );
}
