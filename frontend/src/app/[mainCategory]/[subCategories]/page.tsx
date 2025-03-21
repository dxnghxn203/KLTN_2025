"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductPortfolioList from "@/components/Product/productFunctionalList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import SubSubCategory from "@/components/Category/subSubCategory";
import { useCategory } from "@/hooks/useCategory";
import { useEffect } from "react";

const categoryTitles: Record<string, string> = {
  "thuc-pham-chuc-nang": "Thực phẩm chức năng",
  thuoc: "Thuốc",
  "duoc-my-pham": "Dược mỹ phẩm",
  "thiet-bi-y-te": "Thiết bị y tế",
  "cham-soc-ca-nhan": "Chăm sóc cá nhân",
  "me-va-be": "Mẹ và bé",
  "suc-khoe-sinh-san": "Sức khỏe sinh sản",
  "goc-song-khoe": "Góc sống khỏe",
};

export default function CategoryPage() {
  const params = useParams();
  
  const mainCategory = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;

  const categoryTitle = categoryTitles[mainCategory] || "Danh mục sản phẩm";

  const { subCategory, fetchSubCategory  } = useCategory();

  useEffect(() => {
    fetchSubCategory(mainCategory, subCategories);
  }, []);

  const subCategoriesTitle = subCategory?.sub_category_name || "Danh mục con";

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link
            href={`/${mainCategory}`}
            className="hover:underline text-blue-600"
          >
            {categoryTitle}
          </Link>
          <>
            <span className="text-gray-500"> / </span>
            <span className="text-sm text-gray-500">{subCategoriesTitle}</span>
          </>
        </div>
        <div className="text-2xl font-bold p-4">{subCategoriesTitle}</div>
        <SubSubCategory  child_category = {subCategory}/>
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
