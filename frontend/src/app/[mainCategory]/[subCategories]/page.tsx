"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import ProductPortfolioList from "@/components/Product/productMainCategoryList";
import ProductsViewedList from "@/components/Product/productsViewedList";
import SubSubCategory from "@/components/Category/subSubCategory";
import { useCategory } from "@/hooks/useCategory";
import { useEffect } from "react";
import ProductSubCategoryList from "@/components/Product/productSubCategoryList";

export default function CategoryPage() {
  const params = useParams();
  const { subCategory, fetchSubCategory } = useCategory();
  const { mainCategory } = useCategory();

  const mainCategories = Array.isArray(params.mainCategory)
    ? params.mainCategory[0]
    : params.mainCategory;

  // console.log("ĐUYENUYENN", mainCategory);

  const subCategories = Array.isArray(params.subCategories)
    ? params.subCategories[0]
    : params.subCategories;

  const childCategories = Array.isArray(params.childCategories)
    ? params.childCategories[0]
    : params.childCategories;

  // console.log("ĐUYENUYENN", subCategories);

  const categoryTitle = mainCategory?.main_category_name || "Danh mục sản phẩm";
  // console.log("GGGGG", categoryTitle);

  useEffect(() => {
    fetchSubCategory(mainCategories, subCategories);
  }, []);
  // console.log("child", childCategory);

  const subCategoriesTitle = subCategory?.sub_category_name || "Danh mục con";
  // console.log("ĐUYENUYENN", subCategoriesTitle);

  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link
            href={`/${mainCategory?.main_category_slug}`}
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
        <SubSubCategory
          sub_category={subCategory}
          main_category={mainCategory}
        />
        <div className="mt-6">
          <ProductSubCategoryList />
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
